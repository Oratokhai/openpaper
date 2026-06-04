"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandingMobileMenu } from "./landing-mobile-menu";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/models", label: "Models" },
  { href: "/docs", label: "Docs" },
];

/**
 * Public, signed-out navigation for the otherwise app-shelled pages
 * (/explore, /models). A floating top **pill** — same Dynamic-Island language as
 * the signed-in rail, but horizontal — so logged-out visitors never see the
 * signed-in left rail. Active link glows coral like the rail's active icon.
 */
export function PublicTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-2 flex justify-center">
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 rounded-full border border-white/[0.08] bg-[#141414]/90 backdrop-blur-md pl-5 pr-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[#f5f3ee] text-xl" style={{ fontFamily: "var(--font-fraunces)" }}>
            ❦
          </span>
          <span className="text-[#f5f3ee] font-medium tracking-tight hidden sm:inline">Openpaper</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[14px]">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full transition-colors ${
                  active
                    ? "text-[#ff6b5c] bg-[#ff6b5c]/10"
                    : "text-[#a8a8a8] hover:text-[#f5f3ee] hover:bg-white/[0.05]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/signin"
            className="hidden sm:inline-block text-[14px] text-[#a8a8a8] hover:text-[#f5f3ee] px-3 py-2 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-[#ff6b5c] text-white text-[14px] px-4 py-2 rounded-full font-medium hover:bg-[#e8513f] transition-colors"
          >
            Start writing
          </Link>
          <LandingMobileMenu />
        </div>
      </div>
    </header>
  );
}
