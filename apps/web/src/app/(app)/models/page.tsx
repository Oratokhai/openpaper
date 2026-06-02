import Link from "next/link";
import { mockModels } from "@/lib/mock-data";
import { modelArticleCounts } from "@/db/articles";
import { FileText } from "lucide-react";

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>;
}) {
  const { company: companyParam } = await searchParams;
  const counts = await modelArticleCounts();

  // Companies ordered by how many models each has.
  const tally = new Map<string, number>();
  for (const m of mockModels) tally.set(m.company, (tally.get(m.company) ?? 0) + 1);
  const companies = ["All", ...[...tally.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)];
  const company = companies.includes(companyParam ?? "") ? (companyParam as string) : "All";

  const models = (company === "All" ? mockModels : mockModels.filter((m) => m.company === company))
    .map((m) => ({ ...m, count: counts[m.slug] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-10">
        <h1 className="text-[#f5f3ee] text-5xl mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
          Models
        </h1>
        <p className="text-[#969696] text-base max-w-xl">
          {mockModels.length} models across {companies.length - 1} labs, each a living page of
          community writing. Follow a model to get notified when new articles drop — and mention any
          of them in your own with <span className="text-[#a3b18a]">@model</span>.
        </p>
      </div>

      {/* Company filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {companies.map((co) => (
          <Link
            key={co}
            href={co === "All" ? "/models" : `/models?company=${encodeURIComponent(co)}`}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              co === company
                ? "bg-white/[0.08] text-[#f5f3ee] border border-white/[0.14]"
                : "text-[#8d8d8d] border border-white/[0.06] hover:text-[#aaa] hover:border-white/[0.12]"
            }`}
          >
            {co}
          </Link>
        ))}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <Link
            key={model.id}
            href={`/models/${model.slug}`}
            className="group p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all"
          >
            <div className="mb-3">
              <h3 className="text-[#f5f3ee] text-lg font-medium group-hover:text-white transition-colors">
                {model.name}
              </h3>
              <p className="text-[13px] text-[#858585] mt-0.5">
                {model.company} · {model.releaseDate}
              </p>
            </div>

            <p className="text-[14px] text-[#969696] leading-relaxed mb-4 line-clamp-2">{model.description}</p>

            <div className="flex items-center gap-3 text-xs text-[#858585] flex-wrap">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {model.count} {model.count === 1 ? "article" : "articles"}
              </span>
              <span>·</span>
              <span>{model.contextWindow}</span>
              <span>·</span>
              <div className="flex gap-1">
                {model.modalities.map((m) => (
                  <span key={m} className="bg-white/[0.04] px-2 py-0.5 rounded text-[#8d8d8d]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
