"use client";

import { useState } from "react";

export function ModelOutputBlock({
  model,
  date,
  meta,
  children,
  collapsedHeight = 96,
}: {
  model: string;
  date?: string;
  meta?: string;
  children: React.ReactNode;
  /** px height when collapsed; set 0 to always show full */
  collapsedHeight?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = collapsedHeight > 0;

  return (
    <div className="not-prose my-7 rounded-xl bg-[#0a0a0a] border border-white/[0.08] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] text-[#ff6b5c] font-medium uppercase tracking-widest">
          Model Output
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#888]">{model}</span>
          {date && <span className="text-[11px] text-[#858585]">· {date}</span>}
        </div>
      </div>
      <div className="relative px-4 py-3">
        <div
          className="text-[14px] text-[#bbb] leading-relaxed overflow-hidden transition-[max-height] duration-300"
          style={{
            maxHeight: collapsible && !expanded ? collapsedHeight : undefined,
          }}
        >
          {children}
        </div>
        {collapsible && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        )}
      </div>
      {(collapsible || meta) && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04]">
          <span className="text-[11px] text-[#858585]">{meta ?? " "}</span>
          {collapsible && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[11px] text-[#ff6b5c] font-medium hover:text-[#818cf8] transition-colors"
            >
              {expanded ? "Show less ↑" : "Show full response ↓"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
