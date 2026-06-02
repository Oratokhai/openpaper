import "server-only";
import { and, asc, count, eq } from "drizzle-orm";
import { db } from "./index";
import { likes, saves, follows, modelFollows, subscriptions, comments, articles, users } from "./schema";

export type EngagementState = {
  liked: boolean;
  saved: boolean;
  likeCount: number;
  commentCount: number;
};

export async function getEngagement(
  articleId: string,
  userId: string | null,
): Promise<EngagementState> {
  const [a] = await db
    .select({ likeCount: articles.likeCount, commentCount: articles.commentCount })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  let liked = false;
  let saved = false;
  if (userId) {
    const [l] = await db
      .select({ x: likes.userId })
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.articleId, articleId)))
      .limit(1);
    const [s] = await db
      .select({ x: saves.userId })
      .from(saves)
      .where(and(eq(saves.userId, userId), eq(saves.articleId, articleId)))
      .limit(1);
    liked = Boolean(l);
    saved = Boolean(s);
  }

  return {
    liked,
    saved,
    likeCount: a?.likeCount ?? 0,
    commentCount: a?.commentCount ?? 0,
  };
}

export type CommentView = {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string; username: string; avatarUrl: string | null };
};

export async function listComments(articleId: string): Promise<CommentView[]> {
  const rows = await db
    .select({ comment: comments, user: users })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .where(eq(comments.articleId, articleId))
    .orderBy(asc(comments.createdAt));

  return rows.map((r) => ({
    id: r.comment.id,
    body: r.comment.body,
    createdAt: r.comment.createdAt.toISOString(),
    author: { name: r.user.name, username: r.user.username, avatarUrl: r.user.avatarUrl },
  }));
}

export async function isFollowing(
  followerId: string | null,
  followingId: string,
): Promise<boolean> {
  if (!followerId) return false;
  const [f] = await db
    .select({ x: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);
  return Boolean(f);
}

export async function isModelFollowing(
  userId: string | null,
  modelSlug: string,
): Promise<boolean> {
  if (!userId) return false;
  const [f] = await db
    .select({ x: modelFollows.userId })
    .from(modelFollows)
    .where(and(eq(modelFollows.userId, userId), eq(modelFollows.modelSlug, modelSlug)))
    .limit(1);
  return Boolean(f);
}

export async function isSubscribed(
  subscriberId: string | null,
  writerId: string,
): Promise<boolean> {
  if (!subscriberId) return false;
  const [s] = await db
    .select({ x: subscriptions.subscriberId })
    .from(subscriptions)
    .where(and(eq(subscriptions.subscriberId, subscriberId), eq(subscriptions.writerId, writerId)))
    .limit(1);
  return Boolean(s);
}

export async function countFollowers(userId: string): Promise<number> {
  const [row] = await db.select({ n: count() }).from(follows).where(eq(follows.followingId, userId));
  return row?.n ?? 0;
}
