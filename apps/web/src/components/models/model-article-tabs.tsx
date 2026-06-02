"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/article/article-card";
import type { PublicationType } from "@/db/articles";

export type ModelCardArticle = {
  id: string;
  title: string;
  excerpt: string;
  author: { name: string; username: string; avatar: string | null };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  likes: number;
  comments: number;
  type: PublicationType;
};

const TABS: { value: "all" | PublicationType; label: string }[] = [
  { value: "all", label: "All articles" },
  { value: "tutorial", label: "Tutorials" },
  { value: "benchmark", label: "Benchmarks" },
];

export function ModelArticleTabs({ articles }: { articles: ModelCardArticle[] }) {
  const [tab, setTab] = useState<"all" | PublicationType>("all");
  const filtered = tab === "all" ? articles : articles.filter((a) => a.type === tab);

  return (
    <>
      <div className="flex items-center gap-1 mb-8 border-b border-white/[0.06]">
        {TABS.map((t) => {
          const active = tab === t.value;
          const count = t.value === "all" ? articles.length : articles.filter((a) => a.type === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`relative px-4 py-3 text-sm transition-colors ${
                active ? "text-[#f5f3ee]" : "text-[#8d8d8d] hover:text-[#aaa]"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-[12px] text-[#858585]">{count}</span>
              {active && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-[#f5f3ee]" />}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((a) => (
            <ArticleCard key={`${a.author.username}-${a.id}`} article={a} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-white/[0.08]">
          <p className="text-[#888] text-[15px] mb-1">
            No {tab === "tutorial" ? "tutorials" : tab === "benchmark" ? "benchmarks" : "articles"} yet
          </p>
          <p className="text-[#858585] text-[13px]">
            {tab === "tutorial"
              ? "Step-by-step guides using this model will appear here."
              : tab === "benchmark"
                ? "Evaluations and comparisons of this model will appear here."
                : "Articles mentioning this model will appear here."}
          </p>
        </div>
      )}
    </>
  );
}
