import "server-only";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, users, subscriptions } from "@/db/schema";
import { ArticleEmail } from "@/emails/article-email";
import { FirstPublishEmail } from "@/emails/first-publish-email";

const FROM = process.env.EMAIL_FROM ?? "Openpaper <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Emails a published article to the author's subscribers. Safe to await from a
 * server action — never throws; returns a small summary for logging.
 */
export async function sendArticleToSubscribers(
  articleId: string,
): Promise<{ sent: number; skipped?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: 0, skipped: "RESEND_API_KEY not set" };

  try {
    const [row] = await db
      .select({ article: articles, author: users })
      .from(articles)
      .innerJoin(users, eq(users.id, articles.authorId))
      .where(eq(articles.id, articleId))
      .limit(1);
    if (!row) return { sent: 0, skipped: "article not found" };

    const subs = await db
      .select({ email: users.email })
      .from(subscriptions)
      .innerJoin(users, eq(users.id, subscriptions.subscriberId))
      .where(eq(subscriptions.writerId, row.author.id));

    const recipients = [...new Set(subs.map((s) => s.email).filter((e): e is string => Boolean(e)))];
    if (recipients.length === 0) return { sent: 0, skipped: "no subscribers" };

    const resend = new Resend(key);
    const url = `${APP_URL}/${row.author.username}/${row.article.slug}`;

    const element = (
      <ArticleEmail
        title={row.article.title}
        subtitle={row.article.subtitle}
        authorName={row.author.name}
        readingTime={row.article.readingTime ?? ""}
        cover={row.article.coverGradient ?? "#ff6b5c"}
        url={url}
        content={row.article.content}
      />
    );

    let sent = 0;
    await Promise.all(
      recipients.map(async (to) => {
        const { error } = await resend.emails.send({
          from: FROM,
          to,
          subject: row.article.title,
          react: element,
        });
        if (error) console.error("[email] send failed to", to, error);
        else sent += 1;
      }),
    );

    return { sent };
  } catch (err) {
    console.error("[email] sendArticleToSubscribers failed:", err);
    return { sent: 0, skipped: "error" };
  }
}

/**
 * One-time congratulations email to a writer when their first-ever article goes
 * live. Recipient is the author themselves, so this delivers even on Resend's
 * free tier (no verified domain needed). Safe to await — never throws.
 */
export async function sendFirstPublishCongrats(
  articleId: string,
): Promise<{ sent: number; skipped?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: 0, skipped: "RESEND_API_KEY not set" };

  try {
    const [row] = await db
      .select({ article: articles, author: users })
      .from(articles)
      .innerJoin(users, eq(users.id, articles.authorId))
      .where(eq(articles.id, articleId))
      .limit(1);
    if (!row) return { sent: 0, skipped: "article not found" };
    if (!row.author.email) return { sent: 0, skipped: "author has no email" };

    const resend = new Resend(key);
    const url = `${APP_URL}/${row.author.username}/${row.article.slug}`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: row.author.email,
      subject: "🎉 Your first article is live on Openpaper",
      react: (
        <FirstPublishEmail
          authorName={row.author.name}
          title={row.article.title}
          url={url}
        />
      ),
    });
    if (error) {
      console.error("[email] first-publish congrats failed:", error);
      return { sent: 0, skipped: "send error" };
    }
    return { sent: 1 };
  } catch (err) {
    console.error("[email] sendFirstPublishCongrats failed:", err);
    return { sent: 0, skipped: "error" };
  }
}
