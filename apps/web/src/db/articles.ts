import "server-only";
import { and, desc, eq, inArray, ilike, or, sql } from "drizzle-orm";
import { db } from "./index";
import { articles, users, likes, saves, follows } from "./schema";

export type PublicationType = "article" | "tutorial" | "benchmark";

/* Shape the existing feed/card components already expect (mirrors MockArticle). */
export type FeedArticle = {
  id: string; // slug — used as the URL segment
  articleId: string; // UUID — used for like/save/comment
  title: string;
  excerpt: string;
  author: { name: string; username: string; avatar: string | null };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  models: string[];
  likes: number;
  comments: number;
  cover: string; // gradient classes
  coverImage: string | null; // uploaded image URL (overrides gradient)
  type: PublicationType;
  liked: boolean;
  saved: boolean;
};

type ArticleRow = typeof articles.$inferSelect;
type UserRow = typeof users.$inferSelect;

function toFeedArticle(a: ArticleRow, u: Pick<UserRow, "name" | "username" | "avatarUrl">): FeedArticle {
  return {
    id: a.slug,
    articleId: a.id,
    title: a.title,
    excerpt: a.excerpt ?? "",
    author: { name: u.name, username: u.username, avatar: u.avatarUrl },
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    readingTime: a.readingTime ?? "",
    tags: a.tags,
    models: a.models,
    likes: a.likeCount,
    comments: a.commentCount,
    cover: a.coverGradient ?? "from-[#6366f1] via-[#8b5cf6] to-[#ec4899]",
    coverImage: a.coverImage,
    type: a.type,
    liked: false,
    saved: false,
  };
}

/** Annotate a list with the current user's liked/saved state (2 batch queries). */
async function annotateInteractions(list: FeedArticle[], userId: string | null): Promise<FeedArticle[]> {
  if (!userId || list.length === 0) return list;
  const ids = list.map((a) => a.articleId);
  const [likedRows, savedRows] = await Promise.all([
    db.select({ id: likes.articleId }).from(likes).where(and(eq(likes.userId, userId), inArray(likes.articleId, ids))),
    db.select({ id: saves.articleId }).from(saves).where(and(eq(saves.userId, userId), inArray(saves.articleId, ids))),
  ]);
  const likedSet = new Set(likedRows.map((r) => r.id));
  const savedSet = new Set(savedRows.map((r) => r.id));
  return list.map((a) => ({ ...a, liked: likedSet.has(a.articleId), saved: savedSet.has(a.articleId) }));
}

/** Newest published articles for the feed. */
export async function listFeedArticles(limit = 20, userId: string | null = null): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  return annotateInteractions(rows.map((r) => toFeedArticle(r.article, r.user)), userId);
}

/** Articles by writers the user follows, newest first. */
export async function listFollowingArticles(userId: string, limit = 20): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .innerJoin(follows, eq(follows.followingId, articles.authorId))
    .where(and(eq(follows.followerId, userId), eq(articles.status, "published")))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
  return annotateInteractions(rows.map((r) => toFeedArticle(r.article, r.user)), userId);
}

/** Most-liked published articles (Trending). */
export async function listTrendingArticles(limit = 20, userId: string | null = null): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.likeCount), desc(articles.publishedAt))
    .limit(limit);
  return annotateInteractions(rows.map((r) => toFeedArticle(r.article, r.user)), userId);
}

/** Articles the user has saved (bookmarked), newest-saved first. */
export async function listSavedArticles(userId: string): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(saves)
    .innerJoin(articles, eq(articles.id, saves.articleId))
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(eq(saves.userId, userId))
    .orderBy(desc(saves.createdAt));
  // Everything here is saved by definition; mark liked too for accurate icons.
  return annotateInteractions(
    rows.map((r) => ({ ...toFeedArticle(r.article, r.user), saved: true })),
    userId,
  );
}

/** Published articles that @-mention a given model slug. */
export async function listArticlesByModel(slug: string): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(and(eq(articles.status, "published"), sql`${articles.models} @> ARRAY[${slug}]::text[]`))
    .orderBy(desc(articles.publishedAt));
  return rows.map((r) => toFeedArticle(r.article, r.user));
}

/** Published articles by a given @handle. */
export async function listArticlesByAuthor(username: string): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(and(eq(users.username, username), eq(articles.status, "published")))
    .orderBy(desc(articles.publishedAt));
  return rows.map((r) => toFeedArticle(r.article, r.user));
}

export type FullArticle = {
  id: string; // article UUID (for editing)
  meta: FeedArticle;
  subtitle: string | null;
  content: unknown; // Tiptap JSON
  freshness: ArticleRow["freshness"];
  freshnessVerified: string | null;
};

/** A single published article by author handle + slug, for the reader. */
export async function getArticleForReader(
  username: string,
  slug: string,
): Promise<{ article: FullArticle; author: UserRow } | null> {
  const [row] = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(
      and(
        eq(users.username, username),
        eq(articles.slug, slug),
        eq(articles.status, "published"),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    article: {
      id: row.article.id,
      meta: toFeedArticle(row.article, row.user),
      subtitle: row.article.subtitle,
      content: row.article.content,
      freshness: row.article.freshness,
      freshnessVerified: row.article.freshnessVerified,
    },
    author: row.user,
  };
}

/** Search published articles by title/excerpt. */
export async function searchArticles(query: string, userId: string | null = null): Promise<FeedArticle[]> {
  const q = `%${query}%`;
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(and(eq(articles.status, "published"), or(ilike(articles.title, q), ilike(articles.excerpt, q))))
    .orderBy(desc(articles.publishedAt))
    .limit(30);
  return annotateInteractions(rows.map((r) => toFeedArticle(r.article, r.user)), userId);
}

/** Search writers by name/username. */
export async function searchWriters(query: string): Promise<{ name: string; username: string; avatar: string | null }[]> {
  const q = `%${query}%`;
  const rows = await db
    .select({ name: users.name, username: users.username, avatar: users.avatarUrl })
    .from(users)
    .where(or(ilike(users.name, q), ilike(users.username, q)))
    .limit(12);
  return rows;
}

/** Published articles carrying a given topic tag. */
export async function listArticlesByTag(tag: string, userId: string | null = null): Promise<FeedArticle[]> {
  const rows = await db
    .select({ article: articles, user: users })
    .from(articles)
    .innerJoin(users, eq(users.id, articles.authorId))
    .where(and(eq(articles.status, "published"), sql`${articles.tags} @> ARRAY[${tag}]::text[]`))
    .orderBy(desc(articles.publishedAt));
  return annotateInteractions(rows.map((r) => toFeedArticle(r.article, r.user)), userId);
}

/** Real published-article count per model slug. */
export async function modelArticleCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ models: articles.models })
    .from(articles)
    .where(eq(articles.status, "published"));
  const out: Record<string, number> = {};
  for (const r of rows) for (const m of r.models) out[m] = (out[m] ?? 0) + 1;
  return out;
}

/** Real published-article count per topic tag. */
export async function topicCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ tags: articles.tags })
    .from(articles)
    .where(eq(articles.status, "published"));
  const out: Record<string, number> = {};
  for (const r of rows) for (const t of r.tags) out[t] = (out[t] ?? 0) + 1;
  return out;
}

/** A user profile by @handle (real DB users). */
export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const [u] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return u ?? null;
}
