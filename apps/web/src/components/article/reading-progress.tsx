"use client";

import { useEffect, useState } from "react";
import { useIsland } from "@/components/layout/island-context";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const { setIsland } = useIsland();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      const clamped = Math.min(100, Math.max(0, pct));
      setProgress(clamped);
      setIsland({ mode: "reading", progress: clamped });
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      setIsland(null);
    };
  }, [setIsland]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-[#ff6b5c] transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
