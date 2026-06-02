"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { likes, saves, follows, modelFollows, subscriptions, notifications, comments, articles, users } from "@/db/schema";
import { syncCurrentUser } from "@/db/users";
import { createNotification } from "@/db/notifications";
import type { CommentView } from "@/db/interactions";

/** Returns the author id ONLY if the article exists and is published; else null. */
async function publishedArticleAuthorId(articleId: string): Promise<string | null> {
  const [a] = await db
    .select({ authorId: articles.authorId, status: articles.status })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);
  return a && a.status === "published" ? a.authorId : null;
}

type AuthFail = { ok: false; error: "auth" | "error" };

export async function toggleLike(
  articleId: string,
): Promise<{ ok: true; liked: boolean; count: number } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };
  const author = await publishedArticleAuthorId(articleId);
  if (!author) return { ok: false, error: "error" };
  await syncCurrentUser();

  const [existing] = await db
    .select({ x: likes.userId })
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.articleId, articleId)))
    .limit(1);

  if (existing) {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.articleId, articleId)));
  } else {
    await db.insert(likes).values({ userId, articleId }).onConflictDoNothing();
    await createNotification({ recipientId: author, actorId: userId, type: "like", articleId });
  }

  // Derive the count from the actual rows so it never drifts under concurrency.
  await db
    .update(articles)
    .set({ likeCount: sql`(SELECT COUNT(*)::int FROM ${likes} WHERE ${likes.articleId} = ${articleId})` })
    .where(eq(articles.id, articleId));

  const [a] = await db
    .select({ count: articles.likeCount })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);
  return { ok: true, liked: !existing, count: a?.count ?? 0 };
}

export async function toggleSave(
  articleId: string,
): Promise<{ ok: true; saved: boolean } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };

  const [existing] = await db
    .select({ x: saves.userId })
    .from(saves)
    .where(and(eq(saves.userId, userId), eq(saves.articleId, articleId)))
    .limit(1);

  // Allow un-saving anything; only allow saving a published article.
  if (existing) {
    await db.delete(saves).where(and(eq(saves.userId, userId), eq(saves.articleId, articleId)));
  } else {
    if (!(await publishedArticleAuthorId(articleId))) return { ok: false, error: "error" };
    await syncCurrentUser();
    await db.insert(saves).values({ userId, articleId }).onConflictDoNothing();
  }
  return { ok: true, saved: !existing };
}

export async function toggleFollow(
  targetUserId: string,
): Promise<{ ok: true; following: boolean } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };
  if (userId === targetUserId) return { ok: false, error: "error" };
  await syncCurrentUser();

  const [existing] = await db
    .select({ x: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)))
    .limit(1);

  if (existing) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)));
  } else {
    await db.insert(follows).values({ followerId: userId, followingId: targetUserId }).onConflictDoNothing();
    await createNotification({ recipientId: targetUserId, actorId: userId, type: "follow" });
  }
  return { ok: true, following: !existing };
}

export async function toggleSubscribe(
  writerId: string,
): Promise<{ ok: true; subscribed: boolean } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };
  if (userId === writerId) return { ok: false, error: "error" };
  await syncCurrentUser();

  const [existing] = await db
    .select({ x: subscriptions.subscriberId })
    .from(subscriptions)
    .where(and(eq(subscriptions.subscriberId, userId), eq(subscriptions.writerId, writerId)))
    .limit(1);

  if (existing) {
    await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.subscriberId, userId), eq(subscriptions.writerId, writerId)));
  } else {
    await db.insert(subscriptions).values({ subscriberId: userId, writerId }).onConflictDoNothing();
    await createNotification({ recipientId: writerId, actorId: userId, type: "subscribe" });
  }
  return { ok: true, subscribed: !existing };
}

export async function updateBanner(url: string | null): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!userId) return { ok: false };
  // syncCurrentUser never touches banner_url, so this persists across syncs.
  await db.update(users).set({ bannerUrl: url, updatedAt: new Date() }).where(eq(users.id, userId));
  return { ok: true };
}

export async function markNotificationsRead(): Promise<{ ok: boolean }> {
  const { userId } = await auth();
  if (!userId) return { ok: false };
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.recipientId, userId), eq(notifications.read, false)));
  return { ok: true };
}

export async function toggleModelFollow(
  modelSlug: string,
): Promise<{ ok: true; following: boolean } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };
  await syncCurrentUser();

  const [existing] = await db
    .select({ x: modelFollows.userId })
    .from(modelFollows)
    .where(and(eq(modelFollows.userId, userId), eq(modelFollows.modelSlug, modelSlug)))
    .limit(1);

  if (existing) {
    await db
      .delete(modelFollows)
      .where(and(eq(modelFollows.userId, userId), eq(modelFollows.modelSlug, modelSlug)));
  } else {
    await db.insert(modelFollows).values({ userId, modelSlug }).onConflictDoNothing();
  }
  return { ok: true, following: !existing };
}

export async function addComment(
  articleId: string,
  body: string,
): Promise<{ ok: true; comment: CommentView } | AuthFail> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };
  const text = body.trim().slice(0, 5000); // cap length
  if (!text) return { ok: false, error: "error" };

  const author = await publishedArticleAuthorId(articleId);
  if (!author) return { ok: false, error: "error" };
  await syncCurrentUser();

  let row;
  try {
    [row] = await db
      .insert(comments)
      .values({ articleId, authorId: userId, body: text })
      .returning({ id: comments.id, createdAt: comments.createdAt });
  } catch (err) {
    console.error("[addComment] insert failed:", err);
    return { ok: false, error: "error" };
  }

  await db
    .update(articles)
    .set({ commentCount: sql`(SELECT COUNT(*)::int FROM ${comments} WHERE ${comments.articleId} = ${articleId})` })
    .where(eq(articles.id, articleId));

  await createNotification({ recipientId: author, actorId: userId, type: "comment", articleId });

  const [u] = await db
    .select({ name: users.name, username: users.username, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    ok: true,
    comment: {
      id: row.id,
      body: text,
      createdAt: row.createdAt.toISOString(),
      author: { name: u?.name ?? "You", username: u?.username ?? "", avatarUrl: u?.avatarUrl ?? null },
    },
  };
}
