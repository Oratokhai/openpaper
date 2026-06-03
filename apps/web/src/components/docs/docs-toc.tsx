"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type DocsSection = { id: string; label: string };

export function DocsToc({ sections }: { sections: DocsSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="flex flex-col gap-0.5 text-[14px]">
      <p className="text-[11px] uppercase tracking-widest text-[#6e6e6e] mb-3 px-3">Documentation</p>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "py-1.5 px-3 rounded-lg border-l-2 transition-colors",
            active === s.id
              ? "border-[#ff6b5c] text-[#f5f3ee] bg-white/[0.03]"
              : "border-transparent text-[#8d8d8d] hover:text-[#f5f3ee] hover:bg-white/[0.02]"
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
