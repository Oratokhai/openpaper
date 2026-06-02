import { FeedCard } from "@/components/article/feed-card";
import { FeedHeader } from "@/components/layout/feed-header";
import {
  listFeedArticles,
  listFollowingArticles,
  listTrendingArticles,
} from "@/db/articles";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

type Tab = "foryou" | "following" | "trending";
type TypeFilter = "article" | "tutorial" | "benchmark" | null;

const TABS: { value: Tab; label: string; heading: string; sub: string }[] = [
  { value: "foryou", label: "For you", heading: "For you", sub: "The latest across Openpaper" },
  { value: "following", label: "Following", heading: "Following", sub: "Writing from the writers you follow" },
  { value: "trending", label: "Trending", heading: "Trending", sub: "The most-liked writing right now" },
];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: null, label: "All" },
  { value: "article", label: "Articles" },
  { value: "tutorial", label: "Tutorials" },
  { value: "benchmark", label: "Benchmarks" },
];

function buildHref(tab: Tab, type: TypeFilter): string {
  const params = new URLSearchParams();
  if (tab !== "foryou") params.set("tab", tab);
  if (type) params.set("type", type);
  const qs = params.toString();
  return qs ? `/home?${qs}` : "/home";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; type?: string }>;
}) {
  const { userId } = await auth();
  const { tab, type } = await searchParams;

  const activeTab: Tab = (["following", "trending"].includes(tab ?? "") ? tab : "foryou") as Tab;
  const typeFilter = (["article", "tutorial", "benchmark"].includes(type ?? "") ? type : null) as TypeFilter;
  const meta = TABS.find((t) => t.value === activeTab)!;

  // Fetch the right list for the active tab.
  let baseList =
    activeTab === "following"
      ? userId
        ? await listFollowingArticles(userId)
        : []
      : activeTab === "trending"
        ? await listTrendingArticles(20, userId)
        : await listFeedArticles(20, userId);

  if (typeFilter) baseList = baseList.filter((a) => a.type === typeFilter);

  // "Now popular" sidebar — real trending only.
  const trending = await listTrendingArticles(5, userId);
  const popular = trending.map((a) => ({
    key: a.articleId,
    title: a.title,
    author: a.author.name,
    href: `/${a.author.username}/${a.id}`,
  }));

  return (
    <div className="relative">
      <FeedHeader />

      <div className="max-w-5xl mx-auto px-8 pb-24">
        <div className="flex gap-14">
          {/* Feed */}
          <div className="flex-1 min-w-0 max-w-[660px]">
            <h1 className="text-[#f5f3ee] text-4xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
              {meta.heading}
            </h1>
            <p className="text-[#8d8d8d] text-base mb-8">{meta.sub}</p>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-white/[0.06] mb-4">
              {TABS.map((t) => (
                <Link
                  key={t.value}
                  href={buildHref(t.value, typeFilter)}
                  className={`pb-4 text-base transition-colors border-b-2 -mb-px ${
                    activeTab === t.value
                      ? "text-[#f5f3ee] border-[#f5f3ee]"
                      : "text-[#8d8d8d] border-transparent hover:text-[#aaa]"
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>

            {/* Publication-type filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {TYPE_FILTERS.map((f) => (
                <Link
                  key={f.label}
                  href={buildHref(activeTab, f.value)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    typeFilter === f.value
                      ? "bg-[#606c38] text-white"
                      : "text-[#888] bg-white/[0.04] border border-white/[0.07] hover:text-[#f5f3ee] hover:border-white/[0.14]"
                  }`}
                >
                  {f.label}
                </Link>
              ))}
            </div>

            {/* Feed cards */}
            <div className="pt-6">
              {baseList.map((article) => (
                <FeedCard key={`db-${article.articleId}`} article={article} cover={article.cover} />
              ))}

              {baseList.length === 0 && <EmptyFeed tab={activeTab} typeFilter={typeFilter} />}
            </div>
          </div>

          {/* Now popular sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0 pt-24">
            <div className="sticky top-24">
              {popular.length > 0 && (
                <>
                  <h3 className="text-[#f5f3ee] text-base font-medium mb-6">Now popular</h3>
                  <div className="space-y-6">
                    {popular.map((a, i) => (
                      <Link key={a.key} href={a.href} className="flex gap-4 group">
                        <span className="text-xl text-[#6e6e6e] font-medium" style={{ fontFamily: "var(--font-fraunces)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[15px] text-[#bbb] leading-snug group-hover:text-[#f5f3ee] transition-colors line-clamp-2 mb-1">
                            {a.title}
                          </p>
                          <p className="text-[13px] text-[#858585]">{a.author}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-white/[0.06] my-8" />
                </>
              )}

              <h3 className="text-[#f5f3ee] text-base font-medium mb-5">Topics</h3>
              <div className="flex flex-wrap gap-2.5">
                {["Prompts", "RAG", "Agents", "Models", "Tuning", "Evals"].map((t) => (
                  <Link
                    key={t}
                    href={`/explore?tag=${t}`}
                    className="text-[13px] text-[#888] bg-white/[0.04] border border-white/[0.06] px-3.5 py-2 rounded-full hover:text-[#f5f3ee] hover:border-white/[0.14] transition-all"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function EmptyFeed({ tab, typeFilter }: { tab: Tab; typeFilter: TypeFilter }) {
  if (tab === "following") {
    return (
      <div className="py-20 text-center">
        <p className="text-[#888] text-[15px] mb-2">You&apos;re not following anyone yet</p>
        <p className="text-[#858585] text-[13px] mb-6">Follow writers and their work shows up here.</p>
        <Link href="/home?tab=trending" className="px-5 py-2.5 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors">
          Discover writers
        </Link>
      </div>
    );
  }
  return (
    <p className="py-16 text-center text-[#858585] text-[15px]">
      {typeFilter ? `No ${typeFilter}s here yet.` : "Nothing here yet."}
    </p>
  );
}
