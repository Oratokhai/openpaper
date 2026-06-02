import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  primaryKey,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ──────────────────────────────────────────────────────────────────────────
   Enums
   ────────────────────────────────────────────────────────────────────────── */

export const articleStatus = pgEnum("article_status", ["draft", "published"]);
export const articleType = pgEnum("article_type", ["article", "tutorial", "benchmark"]);
export const notificationType = pgEnum("notification_type", ["like", "comment", "follow", "subscribe"]);
export const freshnessStatus = pgEnum("freshness_status", [
  "none",
  "current",
  "aging",
  "outdated",
]);

/* ──────────────────────────────────────────────────────────────────────────
   Users — mirrors Clerk. `id` is the Clerk user id (e.g. "user_xxx").
   Username (the @handle) lives here because it's disabled on the Clerk side.
   ────────────────────────────────────────────────────────────────────────── */

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk user id
    username: text("username").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    bannerUrl: text("banner_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_username_idx").on(t.username)],
);

/* ──────────────────────────────────────────────────────────────────────────
   Articles — content is the Tiptap JSON document.
   tags/models are slug arrays (models reference the static models directory).
   ────────────────────────────────────────────────────────────────────────── */

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    subtitle: text("subtitle"),
    excerpt: text("excerpt"),
    content: jsonb("content"), // Tiptap document JSON
    coverGradient: text("cover_gradient"),
    status: articleStatus("status").default("draft").notNull(),
    type: articleType("type").default("article").notNull(),
    tags: text("tags").array().default([]).notNull(),
    models: text("models").array().default([]).notNull(),
    readingTime: text("reading_time"),
    freshness: freshnessStatus("freshness").default("none").notNull(),
    freshnessVerified: text("freshness_verified"),
    emailDelivery: boolean("email_delivery").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("articles_author_slug_idx").on(t.authorId, t.slug),
    index("articles_status_published_idx").on(t.status, t.publishedAt),
  ],
);

/* ──────────────────────────────────────────────────────────────────────────
   Social graph
   ────────────────────────────────────────────────────────────────────────── */

// User → User follows
export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("follows_following_idx").on(t.followingId),
  ],
);

// Email subscriptions — "Subscribe" on a profile (distinct from in-app follows).
export const subscriptions = pgTable(
  "subscriptions",
  {
    subscriberId: text("subscriber_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    writerId: text("writer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.subscriberId, t.writerId] }),
    index("subscriptions_writer_idx").on(t.writerId),
  ],
);

// User → Model follows (model slug references the static models directory)
export const modelFollows = pgTable(
  "model_follows",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    modelSlug: text("model_slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.modelSlug] })],
);

export const likes = pgTable(
  "likes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.articleId] }),
    index("likes_article_idx").on(t.articleId),
  ],
);

export const saves = pgTable(
  "saves",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.articleId] }),
    index("saves_user_idx").on(t.userId),
  ],
);

// Notifications — fired when someone likes/comments on your article, follows, or subscribes.
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationType("type").notNull(),
    articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("notifications_recipient_idx").on(t.recipientId, t.read)],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"), // self-reference for threaded replies (set below)
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("comments_article_idx").on(t.articleId)],
);

/* ──────────────────────────────────────────────────────────────────────────
   Relations (for Drizzle's query API)
   ────────────────────────────────────────────────────────────────────────── */

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  comments: many(comments),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
  likes: many(likes),
  saves: many(saves),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, { fields: [comments.articleId], references: [articles.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: "comment_replies" }),
}));

/* ──────────────────────────────────────────────────────────────────────────
   Inferred types
   ────────────────────────────────────────────────────────────────────────── */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
