CREATE TYPE "public"."article_type" AS ENUM('article', 'tutorial', 'benchmark');--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "type" "article_type" DEFAULT 'article' NOT NULL;