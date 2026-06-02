import Link from "next/link";
import { mockModels } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { FullArticle, FeedArticle } from "@/db/articles";
import type { users } from "@/db/schema";
import { ReadingProgress } from "./reading-progress";
import { EngagementDock } from "./engagement-dock";
import { TableOfContents } from "./table-of-contents";
import { FreshnessStamp } from "./blocks/freshness-stamp";
import { TiptapRenderer, extractToc } from "./tiptap-renderer";
import { Comments } from "./comments";
import { FollowButton } from "@/components/profile/follow-button";
import { SubscribeButton } from "@/components/profile/subscribe-button";
import type { EngagementState, CommentView } from "@/db/interactions";

type UserRow = typeof users.$inferSelect;

export function DbArticleReader({
  article,
  author,
  moreArticles,
  isOwner = false,
  engagement,
  comments,
  canComment,
  isFollowing = false,
  isSubscribed = false,
}: {
  article: FullArticle;
  author: UserRow;
  moreArticles: FeedArticle[];
  isOwner?: boolean;
  engagement: EngagementState;
  comments: CommentView[];
  canComment: boolean;
  isFollowing?: boolean;
  isSubscribed?: boolean;
}) {
  const meta = article.meta;
  const toc = extractToc(article.content);
  const initials = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const mentionedModels = meta.models
    .map((s) => mockModels.find((m) => m.slug === s))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <>
      <ReadingProgress />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex gap-10">
          {/* Left: engagement dock */}
          <div className="hidden lg:block shrink-0 w-12">
            <div className="sticky top-32">
              <EngagementDock
                articleId={article.id}
                likes={engagement.likeCount}
                comments={engagement.commentCount}
                initialLiked={engagement.liked}
                initialSaved={engagement.saved}
              />
            </div>
          </div>

          {/* Center: the article */}
          <article className="flex-1 min-w-0 max-w-[680px] mx-auto">
            <div className={`relative h-72 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${meta.cover} flex items-center justify-center`}>
              <span
                className="text-white/95 text-3xl md:text-4xl px-10 text-center leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {meta.title}
              </span>
            </div>

            {meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {meta.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/explore?tag=${encodeURIComponent(t)}`}
                    className="text-[13px] text-[#888] bg-white/[0.05] border border-white/[0.07] px-3 py-1 rounded-full hover:text-[#f5f3ee] transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}

            <h1
              className="text-[#f5f3ee] text-4xl md:text-5xl leading-tight tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {meta.title}
            </h1>
            {article.subtitle && (
              <p className="text-[#888] text-xl leading-relaxed mb-8">{article.subtitle}</p>
            )}

            {/* Byline */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/[0.06]">
              <Link href={`/${author.username}`} className="flex items-center gap-3 group">
                {author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-semibold">
                    {initials}
                  </span>
                )}
                <div>
                  <p className="text-[15px] text-[#f5f3ee] group-hover:text-white transition-colors">{author.name}</p>
                  <p className="text-[13px] text-[#858585]">{formatDate(meta.publishedAt)} · {meta.readingTime}</p>
                </div>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                {article.freshness !== "none" && (
                  <FreshnessStamp status={article.freshness} verified={article.freshnessVerified ?? undefined} />
                )}
                {isOwner ? (
                  <Link
                    href={`/write?edit=${article.id}`}
                    className="text-[13px] text-[#888] border border-white/[0.1] rounded-lg px-3 py-1.5 hover:text-[#f5f3ee] hover:border-white/[0.2] transition-all"
                  >
                    Edit
                  </Link>
                ) : (
                  <>
                    <SubscribeButton writerId={author.id} initialSubscribed={isSubscribed} />
                    <FollowButton targetUserId={author.id} initialFollowing={isFollowing} />
                  </>
                )}
              </div>
            </div>

            {/* Inline engagement bar — shown when the sticky side dock is hidden */}
            <div className="lg:hidden -mt-2 mb-8">
              <EngagementDock
                orientation="horizontal"
                articleId={article.id}
                likes={engagement.likeCount}
                comments={engagement.commentCount}
                initialLiked={engagement.liked}
                initialSaved={engagement.saved}
              />
            </div>

            {/* Body */}
            <div className="prose">
              <TiptapRenderer content={article.content} />
            </div>

            {/* Comments */}
            <Comments articleId={article.id} initialComments={comments} canComment={canComment} />

            {/* More from author */}
            {moreArticles.length > 0 && (
              <div className="mt-16 pt-10 border-t border-white/[0.06]">
                <h3 className="text-[#f5f3ee] text-lg mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
                  More from {author.name.split(" ")[0]}
                </h3>
                <div className="space-y-4">
                  {moreArticles.map((a) => (
                    <Link key={a.id} href={`/${a.author.username}/${a.id}`} className="block group">
                      <p className="text-[15px] text-[#bbb] group-hover:text-[#f5f3ee] transition-colors leading-snug">{a.title}</p>
                      <p className="text-[13px] text-[#858585] mt-0.5">{a.readingTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right: TOC + model rail */}
          <div className="hidden xl:block shrink-0 w-56">
            <div className="sticky top-32 space-y-10">
              <TableOfContents sections={toc} />
              {mentionedModels.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-medium text-[#858585] uppercase tracking-widest mb-4">Models referenced</h3>
                  <div className="space-y-2">
                    {mentionedModels.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/models/${m.slug}`}
                        className="block text-[14px] text-[#aaa] hover:text-[#f5f3ee] transition-colors"
                      >
                        {m.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
