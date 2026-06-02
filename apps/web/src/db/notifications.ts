import "server-only";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import { notifications, users, articles } from "./schema";

export type NotificationType = "like" | "comment" | "follow" | "subscribe";

export type NotificationView = {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actor: { name: string; username: string; avatarUrl: string | null };
  article: { title: string; slug: string; authorUsername: string } | null;
};

/** Best-effort: record a notification. No-op for self-actions; never throws. */
export async function createNotification(params: {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  articleId?: string | null;
}): Promise<void> {
  if (params.recipientId === params.actorId) return;
  try {
    // Idempotent events (like/follow/subscribe) dedupe — replace any prior one so
    // toggling doesn't spam. Comments always create a new notification.
    if (params.type !== "comment") {
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.recipientId, params.recipientId),
            eq(notifications.actorId, params.actorId),
            eq(notifications.type, params.type),
            params.articleId
              ? eq(notifications.articleId, params.articleId)
              : isNull(notifications.articleId),
          ),
        );
    }
    await db.insert(notifications).values({
      recipientId: params.recipientId,
      actorId: params.actorId,
      type: params.type,
      articleId: params.articleId ?? null,
    });
  } catch (err) {
    console.error("[createNotification] failed:", err);
  }
}

export async function listNotifications(userId: string, limit = 50): Promise<NotificationView[]> {
  const actor = alias(users, "actor");
  const artAuthor = alias(users, "art_author");

  const rows = await db
    .select({ n: notifications, actor, article: articles, artAuthor })
    .from(notifications)
    .innerJoin(actor, eq(actor.id, notifications.actorId))
    .leftJoin(articles, eq(articles.id, notifications.articleId))
    .leftJoin(artAuthor, eq(artAuthor.id, articles.authorId))
    .where(eq(notifications.recipientId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.n.id,
    type: r.n.type,
    read: r.n.read,
    createdAt: r.n.createdAt.toISOString(),
    actor: { name: r.actor.name, username: r.actor.username, avatarUrl: r.actor.avatarUrl },
    article:
      r.article && r.artAuthor
        ? { title: r.article.title, slug: r.article.slug, authorUsername: r.artAuthor.username }
        : null,
  }));
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.recipientId, userId), eq(notifications.read, false)));
  return row?.n ?? 0;
}
