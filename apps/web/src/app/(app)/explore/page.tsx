import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { mockModels, mockTags } from "@/lib/mock-data";
import { FeedCard } from "@/components/article/feed-card";
import { SearchBox } from "@/components/explore/search-box";
import { formatRelativeDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import {
  searchArticles,
  searchWriters,
  listArticlesByTag,
  listFeedArticles,
  listTrendingArticles,
  topicCounts,
  modelArticleCounts,
} from "@/db/articles";

const topicGradients = [
  "from-[#ff6b5c] to-[#c9443a]",
  "from-[#06b6d4] to-[#3b82f6]",
  "from-[#f59e0b] to-[#ef4444]",
  "from-[#e8513f] to-[#ff9a8f]",
  "from-[#10b981] to-[#06b6d4]",
  "from-[#ef4444] to-[#f59e0b]",
  "from-[#3b82f6] to-[#ff6b5c]",
  "from-[#ff9a8f] to-[#e8513f]",
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { userId } = await auth();
  const { q, tag } = await searchParams;
  const query = (q ?? "").trim();
  const activeTag = (tag ?? "").trim();

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#ff6b5c] text-[13px] font-medium mb-3">Written by the people building it</p>
        <h1 className="text-[#f5f3ee] text-5xl mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
          Explore
        </h1>
        <p className="text-[#969696] text-base">AI moves fast. This is where people write it down.</p>
      </div>

      <SearchBox initial={query} />

      {query ? (
        <SearchResults query={query} userId={userId} />
      ) : activeTag ? (
        <TagResults tag={activeTag} userId={userId} />
      ) : (
        <Discovery userId={userId} />
      )}
    </div>
  );
}

/* ── Search ────────────────────────────────────────────────────────────────── */
async function SearchResults({ query, userId }: { query: string; userId: string | null }) {
  const ql = query.toLowerCase();
  const [articles, writers] = await Promise.all([
    searchArticles(query, userId),
    searchWriters(query),
  ]);

  // Models are a real reference directory — searching them is legitimate.
  const models = mockModels
    .filter((m) => m.name.toLowerCase().includes(ql) || m.company.toLowerCase().includes(ql))
    .slice(0, 8);

  const empty = articles.length + models.length + writers.length === 0;
  if (empty) {
    return (
      <p className="text-[#8d8d8d] text-base py-16 text-center">
        No results for <span className="text-[#aaa]">“{query}”</span>. Try a model name, a topic, or a writer.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {writers.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-[#858585] mb-4">Writers</h2>
          <div className="flex flex-wrap gap-3">
            {writers.map((w) => (
              <Link key={w.username} href={`/${w.username}`} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 hover:border-white/[0.14] transition-all">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[11px] font-semibold">
                  {w.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="text-[14px] text-[#e8e6e0]">{w.name}</p>
                  <p className="text-[12px] text-[#858585]">@{w.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {models.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-[#858585] mb-4">Models</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {models.map((m) => (
              <Link key={m.slug} href={`/models/${m.slug}`} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 hover:border-white/[0.14] transition-all">
                <p className="text-[#e8e6e0] font-medium">{m.name}</p>
                <p className="text-[12px] text-[#858585]">{m.company}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-[#858585] mb-4">Articles</h2>
          <div>
            {articles.map((a) => (
              <FeedCard key={`db-${a.articleId}`} article={a} cover={a.cover} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Topic filter ──────────────────────────────────────────────────────────── */
async function TagResults({ tag, userId }: { tag: string; userId: string | null }) {
  const articles = await listArticlesByTag(tag, userId);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[#f5f3ee] text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>
          {tag}
        </h2>
        <Link href="/explore" className="text-[13px] text-[#888] hover:text-[#f5f3ee] transition-colors">
          ← All
        </Link>
      </div>
      {articles.length === 0 ? (
        <p className="py-16 text-center text-[#858585] text-[15px]">No articles tagged “{tag}” yet.</p>
      ) : (
        <div>
          {articles.map((a) => (
            <FeedCard key={`db-${a.articleId}`} article={a} cover={a.cover} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Discovery (default) ───────────────────────────────────────────────────── */
async function Discovery({ userId }: { userId: string | null }) {
  const [trending, latest, counts, modelCounts] = await Promise.all([
    listTrendingArticles(1, userId),
    listFeedArticles(12, userId),
    topicCounts(),
    modelArticleCounts(),
  ]);

  const featured = trending[0] ?? null;

  // Trending models — real reference directory ranked by REAL article counts; only show ones with articles.
  const trendingModels = mockModels
    .map((m) => ({ ...m, count: modelCounts[m.slug] ?? 0 }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const fresh = latest.slice(0, 3);

  return (
    <>
      {/* Featured hero (real top article) */}
      {featured ? (
        <Link href={`/${featured.author.username}/${featured.id}`} className="group block mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-8 hover:border-white/[0.14] transition-all">
            {featured.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImage} alt={featured.title} className="h-64 md:h-72 w-full rounded-2xl object-cover" />
            ) : (
              <div className={`h-64 md:h-72 rounded-2xl bg-gradient-to-br ${featured.cover} flex items-center justify-center overflow-hidden`}>
                <span className="text-white/95 text-2xl md:text-3xl px-8 text-center leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {featured.title}
                </span>
              </div>
            )}
            <div>
              <span className="text-[11px] text-[#ff6b5c] font-medium uppercase tracking-widest mb-4 inline-block">Featured</span>
              <h2 className="text-[#f5f3ee] text-3xl md:text-4xl leading-tight mb-4 group-hover:text-white transition-colors" style={{ fontFamily: "var(--font-fraunces)" }}>
                {featured.title}
              </h2>
              <p className="text-[#888] text-[15px] leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-[14px] text-[#aaa]">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[10px] font-semibold">
                  {featured.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                {featured.author.name}
                <span className="text-[#858585]">· {featured.readingTime}</span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="mb-16 rounded-3xl border border-dashed border-white/[0.1] p-12 text-center">
          <p className="text-[#f5f3ee] text-xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>Nothing published yet</p>
          <p className="text-[#8d8d8d] text-[14px] mb-6">Be the first to write about what you&apos;re building with AI.</p>
          <Link href="/write" className="inline-block px-5 py-2.5 rounded-xl bg-[#ff6b5c] text-white text-sm font-medium hover:bg-[#e8513f] transition-colors">Start writing</Link>
        </div>
      )}

      {/* Trending models — only if any have real articles */}
      {trendingModels.length > 0 && (
        <Section title="Trending models" href="/models" linkLabel="All models">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {trendingModels.map((m) => (
              <Link key={m.slug} href={`/models/${m.slug}`} className="shrink-0 w-56 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 hover:border-white/[0.14] hover:bg-white/[0.04] transition-all group">
                <p className="text-[11px] text-[#858585] mb-1">{m.company}</p>
                <p className="text-[#f5f3ee] font-medium mb-3 group-hover:text-white transition-colors">{m.name}</p>
                <p className="text-[12px] text-[#858585] flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  {m.count} {m.count === 1 ? "article" : "articles"}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Browse by topic — real counts */}
      <Section title="Browse by topic">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {mockTags.map((t, i) => {
            const count = counts[t] ?? 0;
            return (
              <Link key={t} href={`/explore?tag=${encodeURIComponent(t)}`} className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 hover:border-white/[0.14] transition-all">
                <span className={`absolute -right-6 -top-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${topicGradients[i % topicGradients.length]} opacity-70 blur-[2px] group-hover:opacity-100 transition-opacity`} />
                <p className="relative text-[#e8e6e0] font-medium text-[15px] group-hover:text-white transition-colors">{t}</p>
                <p className="relative text-[12px] text-[#858585] mt-1">
                  {count} {count === 1 ? "article" : "articles"}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Fresh */}
      {fresh.length > 0 && (
        <Section title="Fresh">
          <div className="grid md:grid-cols-3 gap-4">
            {fresh.map((a) => (
              <Link key={`${a.author.username}/${a.id}`} href={`/${a.author.username}/${a.id}`} className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/[0.14] transition-all">
                {a.tags[0] && <span className="text-[11px] text-[#888] bg-white/[0.05] border border-white/[0.07] px-2.5 py-0.5 rounded-full">{a.tags[0]}</span>}
                <h3 className="text-[#f5f3ee] text-xl leading-snug mt-3 mb-2 group-hover:text-white transition-colors line-clamp-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {a.title}
                </h3>
                <p className="text-[13px] text-[#8d8d8d]">{a.author.name} · {formatRelativeDate(a.publishedAt)}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Latest */}
      <Section title="The latest">
        {latest.length > 0 ? (
          <div>
            {latest.map((a) => (
              <FeedCard key={`db-${a.articleId}`} article={a} cover={a.cover} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-[#858585] text-[15px]">No articles yet.</p>
        )}
      </Section>
    </>
  );
}

function Section({ title, href, linkLabel, children }: { title: string; href?: string; linkLabel?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[#f5f3ee] text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>{title}</h2>
        {href && (
          <Link href={href} className="flex items-center gap-1.5 text-[13px] text-[#888] hover:text-[#f5f3ee] transition-colors">
            {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
