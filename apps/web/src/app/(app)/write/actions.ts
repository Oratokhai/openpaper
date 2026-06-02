"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, users } from "@/db/schema";
import { syncCurrentUser } from "@/db/users";
import { sendArticleToSubscribers } from "@/lib/email";

type Freshness = "none" | "current" | "aging" | "outdated";
export type PublicationType = "article" | "tutorial" | "benchmark";

export type PublishInput = {
  articleId?: string; // present → update an existing article
  title: string;
  subtitle: string;
  contentJson: unknown; // Tiptap document JSON
  contentText: string; // plain text (for reading time + excerpt)
  tags: string[];
  models: string[];
  coverGradient: string;
  coverImage: string | null;
  freshness: Freshness;
  type: PublicationType;
  emailDelivery: boolean;
  status: "draft" | "published";
};

export type PublishResult =
  | { ok: true; id: string; username: string; slug: string; status: "draft" | "published" }
  | { ok: false; error: string };

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "untitled"
  );
}

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | undefined;
  return e?.code === "23505" || /duplicate key|unique constraint/i.test(e?.message ?? "");
}

const MAX_TITLE = 200;
const MAX_SUBTITLE = 300;
const MAX_CONTENT_BYTES = 1_000_000; // ~1 MB serialized
const MAX_CONTENT_DEPTH = 60;

function contentDepth(node: unknown, depth = 0): number {
  if (depth > MAX_CONTENT_DEPTH) return depth;
  const n = node as { content?: unknown[] } | null;
  if (!n || !Array.isArray(n.content) || n.content.length === 0) return depth;
  let max = depth;
  for (const child of n.content) max = Math.max(max, contentDepth(child, depth + 1));
  return max;
}

export async function publishArticle(input: PublishInput): Promise<PublishResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "You must be signed in to publish." };

  const title = input.title.trim().slice(0, MAX_TITLE);
  if (!title) return { ok: false, error: "Add a title before publishing." };

  // Guard against oversized / pathologically-nested content (storage + render DoS).
  if (JSON.stringify(input.contentJson ?? null).length > MAX_CONTENT_BYTES) {
    return { ok: false, error: "This article is too large to save." };
  }
  if (contentDepth(input.contentJson) > MAX_CONTENT_DEPTH) {
    return { ok: false, error: "This article's structure is nested too deeply." };
  }

  await syncCurrentUser(); // guarantee author row exists (FK)

  const subtitle = input.subtitle.trim().slice(0, MAX_SUBTITLE);
  const words = input.contentText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = `${Math.max(1, Math.round(words / 200))} min read`;
  const excerpt = (subtitle || input.contentText.trim().slice(0, 180).trim()) || null;
  const freshnessVerified =
    input.freshness === "current"
      ? new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : null;

  const [author] = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const username = author?.username ?? "me";

  /* ── Update an existing article ─────────────────────────────────────────── */
  if (input.articleId) {
    const [existing] = await db
      .select({ authorId: articles.authorId, slug: articles.slug, publishedAt: articles.publishedAt })
      .from(articles)
      .where(eq(articles.id, input.articleId))
      .limit(1);

    if (!existing) return { ok: false, error: "Article not found." };
    if (existing.authorId !== userId) return { ok: false, error: "You can't edit this article." };

    await db
      .update(articles)
      .set({
        title,
        subtitle: subtitle || null,
        excerpt,
        content: input.contentJson,
        coverGradient: input.coverGradient,
        coverImage: input.coverImage,
        status: input.status,
        type: input.type,
        tags: input.tags,
        models: input.models,
        readingTime,
        freshness: input.freshness,
        freshnessVerified,
        emailDelivery: input.emailDelivery,
        // Set publishedAt the first time it goes live; keep the slug stable.
        publishedAt:
          input.status === "published" ? existing.publishedAt ?? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, input.articleId));

    // Email subscribers only the first time the article goes live (not on re-edits).
    const firstPublish = input.status === "published" && !existing.publishedAt;
    if (firstPublish && input.emailDelivery) {
      await sendArticleToSubscribers(input.articleId);
    }

    return { ok: true, id: input.articleId, username, slug: existing.slug, status: input.status };
  }

  /* ── Create a new article ───────────────────────────────────────────────── */
  const base = slugify(title);
  let slug = base;

  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      const [row] = await db
        .insert(articles)
        .values({
          authorId: userId,
          title,
          slug,
          subtitle: subtitle || null,
          excerpt,
          content: input.contentJson,
          coverGradient: input.coverGradient,
          coverImage: input.coverImage,
          status: input.status,
          type: input.type,
          tags: input.tags,
          models: input.models,
          readingTime,
          freshness: input.freshness,
          freshnessVerified,
          emailDelivery: input.emailDelivery,
          publishedAt: input.status === "published" ? new Date() : null,
        })
        .returning({ id: articles.id });

      if (input.status === "published" && input.emailDelivery) {
        await sendArticleToSubscribers(row.id);
      }

      return { ok: true, id: row.id, username, slug, status: input.status };
    } catch (err) {
      if (isUniqueViolation(err)) {
        slug = `${base}-${attempt + 2}`;
        continue;
      }
      console.error("[publishArticle] failed:", err);
      return { ok: false, error: "Could not save the article. Please try again." };
    }
  }

  return { ok: false, error: "Could not generate a unique URL for this title." };
}

/* ── Load an article into the editor (owner only) ──────────────────────────── */

export type EditableArticle = {
  id: string;
  title: string;
  subtitle: string;
  contentJson: unknown;
  tags: string[];
  coverGradient: string;
  coverImage: string | null;
  freshness: Freshness;
  type: PublicationType;
  emailDelivery: boolean;
  status: "draft" | "published";
};

export async function getArticleForEdit(id: string): Promise<EditableArticle | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const [a] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!a || a.authorId !== userId) return null;

  return {
    id: a.id,
    title: a.title,
    subtitle: a.subtitle ?? "",
    contentJson: a.content,
    tags: a.tags,
    coverGradient: a.coverGradient ?? "from-[#6366f1] via-[#8b5cf6] to-[#ec4899]",
    coverImage: a.coverImage,
    freshness: a.freshness,
    type: a.type,
    emailDelivery: a.emailDelivery,
    status: a.status,
  };
}

/* ── Delete an article (owner only) ────────────────────────────────────────── */

export async function deleteArticle(id: string): Promise<{ ok: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "auth" };

  const [a] = await db.select({ authorId: articles.authorId }).from(articles).where(eq(articles.id, id)).limit(1);
  if (!a) return { ok: false, error: "not found" };
  if (a.authorId !== userId) return { ok: false, error: "forbidden" };

  // likes/saves/comments/notifications cascade-delete via FK.
  await db.delete(articles).where(eq(articles.id, id));
  return { ok: true };
}

/* ── List the current user's drafts ────────────────────────────────────────── */

export type DraftSummary = { id: string; title: string; updatedAt: string };

export async function listMyDrafts(): Promise<DraftSummary[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const rows = await db
    .select({ id: articles.id, title: articles.title, updatedAt: articles.updatedAt })
    .from(articles)
    .where(and(eq(articles.authorId, userId), eq(articles.status, "draft")))
    .orderBy(desc(articles.updatedAt));

  return rows.map((r) => ({ id: r.id, title: r.title, updatedAt: r.updatedAt.toISOString() }));
}
