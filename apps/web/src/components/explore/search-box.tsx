"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  useEffect(() => {
    const next = q.trim();
    if (next === initial.trim()) return; // skip the no-op on mount
    const t = setTimeout(() => {
      router.replace(next ? `/explore?q=${encodeURIComponent(next)}` : "/explore");
    }, 300);
    return () => clearTimeout(t);
  }, [q, initial, router]);

  return (
    <div className="relative mb-12 max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="text"
        placeholder="Search articles, models, and writers…"
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3.5 text-[15px] text-[#f5f3ee] placeholder:text-[#858585] focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
      />
    </div>
  );
}
