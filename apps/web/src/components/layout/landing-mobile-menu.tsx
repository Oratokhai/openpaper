"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Compact menu for the marketing nav on phones (the desktop links are hidden
// below md). Surfaces Explore / Models / Sign in behind a hamburger.
export function LandingMobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="md:hidden relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-[#cfcfcf] hover:text-[#f5f3ee] transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl"
        >
          <Link
            href="/explore"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-[#cfcfcf] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/models"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-[#cfcfcf] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
          >
            Models
          </Link>
          <Link
            href="/docs"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-[#cfcfcf] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/signin"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-[#cfcfcf] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
