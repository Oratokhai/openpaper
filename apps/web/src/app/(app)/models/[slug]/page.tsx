import { mockModels } from "@/lib/mock-data";
import { FileText, Calendar, Layers, PenLine } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { isModelFollowing } from "@/db/interactions";
import { listArticlesByModel } from "@/db/articles";
import { ModelFollowButton } from "@/components/models/model-follow-button";
import { ModelArticleTabs, type ModelCardArticle } from "@/components/models/model-article-tabs";

export default async function ModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = mockModels.find((m) => m.slug === slug);

  if (!model) notFound();

  const { userId } = await auth();
  const following = await isModelFollowing(userId, slug);

  // Real published articles mentioning this model.
  const realByModel = await listArticlesByModel(slug);
  const articles: ModelCardArticle[] = realByModel.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    author: a.author,
    publishedAt: a.publishedAt,
    readingTime: a.readingTime,
    tags: a.tags,
    likes: a.likes,
    comments: a.comments,
    type: a.type,
  }));

  // Related: same company first, then others — capped.
  const related = [
    ...mockModels.filter((m) => m.slug !== slug && m.company === model.company),
    ...mockModels.filter((m) => m.slug !== slug && m.company !== model.company),
  ].slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex gap-12">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Model header */}
          <div className="mb-10 pb-10 border-b border-white/[0.06]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-[#858585] mb-1">{model.company}</p>
                <h1
                  className="text-[#f5f3ee] text-4xl md:text-5xl"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {model.name}
                </h1>
              </div>
              <ModelFollowButton modelSlug={slug} initialFollowing={following} />
            </div>

            <p className="text-[#888] text-base leading-relaxed mb-6 max-w-2xl">
              {model.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <Stat icon={<FileText className="w-4 h-4" />} label="Articles" value={String(articles.length)} />
              <Stat icon={<Layers className="w-4 h-4" />} label="Context" value={model.contextWindow} />
              <Stat icon={<Calendar className="w-4 h-4" />} label="Released" value={model.releaseDate} />
              <div className="flex items-center gap-2 text-[#8d8d8d]">
                <span className="text-xs text-[#858585]">Modalities</span>
                <div className="flex gap-1.5">
                  {model.modalities.map((m) => (
                    <span key={m} className="text-xs bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full text-[#888]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + articles (filter by publication type) */}
          {articles.length > 0 ? (
            <ModelArticleTabs articles={articles} />
          ) : (
            <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-white/[0.08]">
              <p className="text-[#888] text-lg mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                No articles about {model.name} yet
              </p>
              <p className="text-[#858585] text-sm mb-6 max-w-sm mx-auto">
                Be the first to write about it. Mention{" "}
                <span className="text-[#a3b18a]">@{model.name}</span> in any article and it
                shows up here.
              </p>
              <Link
                href="/write"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors"
              >
                <PenLine className="w-4 h-4" /> Write about {model.name}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-12">
            <h3 className="text-xs font-medium text-[#858585] uppercase tracking-widest mb-4">
              Related models
            </h3>
            <div className="space-y-1">
              {related.map((m) => (
                <Link
                  key={m.slug}
                  href={`/models/${m.slug}`}
                  className="flex items-center justify-between group py-2.5 border-b border-white/[0.04] last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-[#aaa] group-hover:text-[#f5f3ee] transition-colors truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-[#858585]">{m.company}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[#8d8d8d]">
      <span className="text-[#787878]">{icon}</span>
      <span className="text-xs text-[#858585]">{label}</span>
      <span className="text-sm text-[#aaa]">{value}</span>
    </div>
  );
}
