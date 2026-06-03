"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocSection {
  id: string;
  label: string;
}

export function TableOfContents({ sections }: { sections: TocSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (sections.length === 0) return null;

  return (
    <nav>
      <h3 className="text-[11px] font-medium text-[#858585] uppercase tracking-widest mb-4">
        In this article
      </h3>
      <ul className="space-y-2.5 border-l border-white/[0.07]">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="-ml-px">
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                className={cn(
                  "block border-l-2 pl-3 text-[13px] leading-snug transition-colors",
                  isActive
                    ? "border-[#ff6b5c] text-[#f5f3ee]"
                    : "border-transparent text-[#8d8d8d] hover:text-[#aaa]"
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
