"use client";

import { useEffect, useRef, useState } from "react";
import { AnthropicLogo } from "./anthropic-logo";

interface IphoneArticleProps {
  article: {
    title: string;
    author: string;
    date: string;
    readingTime: string;
    tag: string;
    body: React.ReactNode;
  };
}

export function IphoneArticle({ article }: IphoneArticleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let pos = 0;
    const speed = 0.6; // px per frame — slow skim

    const tick = () => {
      if (!pausedRef.current && el) {
        pos += speed;
        // Reset to top when near bottom for a seamless loop
        if (pos >= el.scrollHeight - el.clientHeight - 10) {
          pos = 0;
        }
        el.scrollTop = pos;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    pausedRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Sync pos with current scroll before resuming
    if (scrollRef.current) {
      // Short delay before resuming auto-scroll
      setTimeout(() => {
        pausedRef.current = false;
        setIsHovered(false);
      }, 1800);
    }
  };

  const handleTouchStart = () => {
    pausedRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      pausedRef.current = false;
    }, 2500);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      // Keep pos in sync when user manually scrolls
      const el = scrollRef.current;
      // We pause on manual scroll and let the user control
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle glow behind phone */}
      <div
        className="absolute inset-0 rounded-[56px] blur-3xl opacity-20"
        style={{ background: "radial-gradient(ellipse at center, #ff6b5c 0%, transparent 70%)" }}
      />

      {/* iPhone frame */}
      <div
        className="relative"
        style={{
          width: 320,
          height: 640,
        }}
      >
        {/* Outer shell */}
        <div
          className="absolute inset-0 rounded-[46px] shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 40%, #111 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 2px #0a0a0a",
          }}
        />

        {/* Screen bezel */}
        <div
          className="absolute rounded-[38px] overflow-hidden"
          style={{ inset: 10, background: "#000" }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black"
            style={{ width: 116, height: 34 }}
          />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-7 pt-4 pb-2">
            <span className="text-[10px] text-white/80 font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.8">
                <rect x="0" y="4" width="3" height="6" rx="0.5" />
                <rect x="4" y="2.5" width="3" height="7.5" rx="0.5" />
                <rect x="8" y="1" width="3" height="9" rx="0.5" />
                <rect x="12" y="0" width="2" height="10" rx="0.5" opacity="0.4" />
              </svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.8">
                <path d="M7 2.5C9.5 2.5 11.7 3.5 13.2 5.1L14 4.2C12.2 2.3 9.7 1 7 1C4.3 1 1.8 2.3 0 4.2L0.8 5.1C2.3 3.5 4.5 2.5 7 2.5Z" />
                <path d="M7 5.5C8.6 5.5 10.1 6.2 11.1 7.3L11.9 6.4C10.7 5 8.9 4 7 4C5.1 4 3.3 5 2.1 6.4L2.9 7.3C3.9 6.2 5.4 5.5 7 5.5Z" />
                <circle cx="7" cy="9" r="1" />
              </svg>
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" opacity="0.8">
                <rect x="0.5" y="0.5" width="16" height="9" rx="2.5" stroke="white" strokeOpacity="0.4" />
                <rect x="17.5" y="3" width="2" height="4" rx="1" fill="white" fillOpacity="0.4" />
                <rect x="2" y="2" width="11" height="6" rx="1.5" fill="white" />
              </svg>
            </div>
          </div>

          {/* Scrollable article content */}
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onScroll={handleScroll}
          >
            {/* Hide scrollbar in webkit */}
            <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>

            {/* Cover image */}
            <div className="h-52 bg-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
              {/* Anthropic logo */}
              <AnthropicLogo className="w-20 h-20 relative z-10" />
            </div>

            {/* Article body */}
            <div className="bg-[#0f0f0f] px-5 pt-5 pb-20">
              {/* Meta */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-[#ff6b5c] bg-[#ff6b5c]/10 px-2 py-0.5 rounded-full">
                  {article.tag}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[#f5f3ee] text-xl leading-snug mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {article.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[9px] font-bold">
                  DO
                </div>
                <span className="text-[11px] text-[#aaa]">{article.author}</span>
                <span className="text-[11px] text-[#858585]">· {article.date}</span>
                <span className="text-[11px] text-[#858585]">· {article.readingTime}</span>
              </div>

              {/* Body */}
              <div className="text-[13px] text-[#bbb] leading-[1.75] space-y-4">
                {article.body}
              </div>
            </div>
          </div>
        </div>

        {/* Side buttons */}
        {/* Volume up */}
        <div
          className="absolute rounded-r-sm"
          style={{
            left: -3,
            top: 130,
            width: 3,
            height: 34,
            background: "linear-gradient(to right, #1a1a1a, #2a2a2a)",
          }}
        />
        {/* Volume down */}
        <div
          className="absolute rounded-r-sm"
          style={{
            left: -3,
            top: 174,
            width: 3,
            height: 34,
            background: "linear-gradient(to right, #1a1a1a, #2a2a2a)",
          }}
        />
        {/* Power */}
        <div
          className="absolute rounded-l-sm"
          style={{
            right: -3,
            top: 152,
            width: 3,
            height: 60,
            background: "linear-gradient(to left, #1a1a1a, #2a2a2a)",
          }}
        />

        {/* Scroll indicator hint */}
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[#858585] whitespace-nowrap">
            scroll to read
          </div>
        )}
      </div>
    </div>
  );
}
