import { mockModels } from "@/lib/mock-data";
import { Bookmark, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { listSavedArticles } from "@/db/articles";
import { UnsaveButton } from "@/components/article/unsave-button";

export default async function SavedPage() {
  const { userId } = await auth();
  const savedArticles = userId ? await listSavedArticles(userId) : [];

  const totalReadingMinutes = savedArticles.reduce((sum, a) => {
    const mins = parseInt(a.readingTime);
    return sum + (isNaN(mins) ? 0 : mins);
  }, 0);

  const savedTags = [...new Set(savedArticles.flatMap((a) => a.tags))].slice(0, 8);

  const savedModels = [...new Set(savedArticles.flatMap((a) => a.models))]
    .map((slug) => mockModels.find((m) => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .slice(0, 4);

  const savedAuthors = [
    ...new Map(savedArticles.map((a) => [a.author.username, a.author])).values(),
  ].slice(0, 4);

  return (
    <div className="relative">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-[#ff6b5c]" />
            <span className="text-[#f5f3ee] text-[15px] font-medium">Saved</span>
            <span className="text-[12px] text-[#858585] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
              {savedArticles.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#858585]">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalReadingMinutes} min of reading</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {savedArticles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex gap-12">
            {/* ── Article list ──────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[#f5f3ee] text-4xl mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
                Your reading list
              </h1>
              <p className="text-[#858585] text-[14px] mb-8">
                Articles you&apos;ve bookmarked across Openpaper
              </p>

              <div className="space-y-0">
                {savedArticles.map((article) => {
                  const initials = article.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                  return (
                    <div
                      key={article.articleId}
                      className="group flex items-start gap-5 py-5 border-b border-white/[0.06] hover:border-white/[0.1] transition-colors"
                    >
                      {article.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.coverImage} alt="" className="hidden sm:block w-20 h-16 rounded-xl shrink-0 object-cover" />
                      ) : (
                        <div className={`hidden sm:block w-20 h-16 rounded-xl shrink-0 bg-gradient-to-br ${article.cover}`} />
                      )}

                      <div className="flex-1 min-w-0">
                        <Link href={`/${article.author.username}`} className="inline-flex items-center gap-2 mb-2 group/author">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="text-[13px] text-[#8d8d8d] group-hover/author:text-[#aaa] transition-colors">
                            {article.author.name}
                          </span>
                        </Link>

                        <Link href={`/${article.author.username}/${article.id}`}>
                          <h3
                            className="text-[#f5f3ee] text-[17px] font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors mb-2"
                            style={{ fontFamily: "var(--font-fraunces)" }}
                          >
                            {article.title}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 flex-wrap">
                          {article.tags[0] && (
                            <span className="text-[11px] text-[#888] bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full">
                              {article.tags[0]}
                            </span>
                          )}
                          <span className="text-[12px] text-[#858585]">{article.readingTime}</span>
                          <span className="text-[#2a2a2a]">·</span>
                          <span className="text-[12px] text-[#858585] flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {article.likes.toLocaleString()}
                          </span>
                          <span className="text-[#2a2a2a]">·</span>
                          <time className="text-[12px] text-[#787878]">{formatDate(article.publishedAt)}</time>
                        </div>
                      </div>

                      <UnsaveButton articleId={article.articleId} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────── */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-8">
                {savedTags.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-[#858585] uppercase tracking-widest mb-3">Topics saved</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedTags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/explore?tag=${encodeURIComponent(tag)}`}
                          className="text-[12px] text-[#888] bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full hover:text-[#f5f3ee] hover:border-white/[0.14] transition-all"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {savedModels.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-[#858585] uppercase tracking-widest mb-3">Models referenced</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedModels.map((m) => (
                        <Link
                          key={m.slug}
                          href={`/models/${m.slug}`}
                          className="text-[#ff9a8f] bg-[#ff9a8f]/10 hover:bg-[#ff9a8f]/15 px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors"
                        >
                          @{m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {savedAuthors.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-[#858585] uppercase tracking-widest mb-3">Saved from</h3>
                    <div className="space-y-2">
                      {savedAuthors.map((author) => {
                        const ini = author.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                        return (
                          <Link
                            key={author.username}
                            href={`/${author.username}`}
                            className="group flex items-center gap-3 py-2 hover:opacity-80 transition-opacity"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                              {ini}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[#bbb] text-[13px] font-medium truncate group-hover:text-[#f5f3ee] transition-colors">
                                {author.name}
                              </p>
                              <p className="text-[#787878] text-[11px] truncate">@{author.username}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-5">
        <Bookmark className="w-6 h-6 text-[#6e6e6e]" />
      </div>
      <h2 className="text-[#f5f3ee] text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
        Nothing saved yet
      </h2>
      <p className="text-[#858585] text-[14px] leading-relaxed mb-8">
        Bookmark articles as you read — they&apos;ll collect here for later.
      </p>
      <Link
        href="/home"
        className="px-6 py-3 rounded-xl bg-[#ff6b5c] text-white text-[14px] font-medium hover:bg-[#e8513f] transition-colors"
      >
        Browse articles
      </Link>
    </div>
  );
}
