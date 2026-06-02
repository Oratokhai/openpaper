"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
  style,
  onKeyDown,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(resize, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={style}
      rows={1}
      className={cn(
        "w-full resize-none bg-transparent outline-none placeholder:text-[#6e6e6e]",
        className
      )}
    />
  );
}
