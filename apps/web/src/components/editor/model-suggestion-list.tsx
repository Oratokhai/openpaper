"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Search } from "lucide-react";

export type ModelItem = { slug: string; name: string; company?: string };

export type ModelListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export const ModelSuggestionList = forwardRef<
  ModelListRef,
  { items: ModelItem[]; query: string; command: (item: ModelItem) => void }
>(function ModelSuggestionList({ items, query, command }, ref) {
  const [selected, setSelected] = useState(0);

  useEffect(() => setSelected(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (items.length === 0) return false;
      if (event.key === "ArrowDown") {
        setSelected((s) => (s + 1) % items.length);
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelected((s) => (s - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        if (items[selected]) command(items[selected]);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="w-72 rounded-xl border border-white/[0.1] bg-[#161616] shadow-2xl overflow-hidden">
      {/* Search header — reflects what you're typing after @ */}
      <div className="flex items-center gap-2 px-3 h-10 border-b border-white/[0.06]">
        <Search className="w-3.5 h-3.5 text-[#858585] shrink-0" />
        <span className="text-[13px] text-[#888] truncate">
          {query ? query : <span className="text-[#787878]">Search models…</span>}
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto p-1.5">
        {items.length === 0 ? (
          <p className="px-3 py-3 text-[13px] text-[#858585]">No models found</p>
        ) : (
          items.map((m, i) => (
            <button
              key={m.slug}
              type="button"
              onMouseEnter={() => setSelected(i)}
              onClick={() => command(m)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                i === selected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-[14px] text-[#f5f3ee] truncate">{m.name}</span>
              {m.company && <span className="text-[12px] text-[#858585] shrink-0">{m.company}</span>}
            </button>
          ))
        )}
      </div>
    </div>
  );
});
