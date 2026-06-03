"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, PenLine, FileText } from "lucide-react";
import type { DraftSummary, PublishedSummary, PublicationType } from "@/app/(app)/write/actions";
import { formatRelativeDate } from "@/lib/utils";

const DEFAULT_COVER = "from-[#4a1410] via-[#9e3329] to-[#d8503f]";

const TYPE_LABEL: Record<PublicationType, string> = {
  article: "Article",
  tutorial: "Tutorial",
  benchmark: "Benchmark",
};

const FILTERS: { value: "all" | PublicationType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "article", label: "Articles" },
  { value: "tutorial", label: "Tutorials" },
  { value: "benchmark", label: "Benchmarks" },
];

function Thumb({ gradient, image }: { gradient: string | null; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt="" className="w-[88px] h-[64px] rounded-xl object-cover shrink-0" />
    );
  }
  return (
    <div className={`w-[88px] h-[64px] rounded-xl shrink-0 bg-gradient-to-br ${gradient || DEFAULT_COVER}`} />
  );
}

export function StudioBoard({
  drafts,
  published,
  username,
}: {
  drafts: DraftSummary[];
  published: PublishedSummary[];
  username: string | null;
}) {
  const [filter, setFilter] = useState<"all" | PublicationType>("all");

  const match = (t: PublicationType) => filter === "all" || filter === t;
  const visibleDrafts = drafts.filter((d) => match(d.type)).slice(0, 6);
  const visiblePublished = published.filter((p) => match(p.type)).slice(0, 6);

  return (
    <>
      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-10 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors ${
              filter === f.value
                ? "bg-[#f5f3ee] text-[#0a0a0a]"
                : "bg-white/[0.05] text-[#969696] hover:bg-white/[0.08] hover:text-[#f5f3ee]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recent Drafts */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#f5f3ee] text-[15px] font-semibold">Recent Drafts</h2>
          <Link href="/drafts" className="text-[13px] text-[#ff6b5c] hover:text-[#ff9a8f] transition-colors">
            See all
          </Link>
        </div>

        {visibleDrafts.length === 0 ? (
          <EmptyRow text={filter === "all" ? "No drafts yet — start something new." : "No drafts of this type."} />
        ) : (
          <div className="flex flex-col gap-1">
            {visibleDrafts.map((d) => (
              <Link
                key={d.id}
                href={`/write?edit=${d.id}`}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors group"
              >
                <Thumb gradient={d.coverGradient} image={d.coverImage} />
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-[#ddd] group-hover:text-[#f5f3ee] transition-colors truncate">
                    {d.title || "Untitled"}
                  </div>
                  <div className="text-[13px] text-[#8d8d8d] mt-1">
                    Edited {formatRelativeDate(d.updatedAt)} · {TYPE_LABEL[d.type]}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Published */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#f5f3ee] text-[15px] font-semibold">Published</h2>
          {username && (
            <Link href={`/${username}`} className="text-[13px] text-[#ff6b5c] hover:text-[#ff9a8f] transition-colors">
              See all
            </Link>
          )}
        </div>

        {visiblePublished.length === 0 ? (
          <EmptyRow text={filter === "all" ? "Nothing published yet. Your first article goes a long way." : "No published work of this type."} />
        ) : (
          <div className="flex flex-col gap-1">
            {visiblePublished.map((p) => (
              <Link
                key={p.id}
                href={username ? `/${username}/${p.slug}` : "#"}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors group"
              >
                <Thumb gradient={p.coverGradient} image={p.coverImage} />
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-[#ddd] group-hover:text-[#f5f3ee] transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#8d8d8d] mt-1">
                    <span>
                      Published{" "}
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </span>
                    <span className="text-[#3a3a3a]">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> {p.likeCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-8 rounded-2xl border border-dashed border-white/[0.08] text-[#8d8d8d]">
      <FileText className="w-4 h-4 shrink-0" />
      <span className="text-[14px]">{text}</span>
      <Link
        href="/write"
        className="ml-auto inline-flex items-center gap-1.5 text-[13px] text-[#ff6b5c] hover:text-[#ff9a8f] transition-colors"
      >
        <PenLine className="w-3.5 h-3.5" /> Write
      </Link>
    </div>
  );
}
