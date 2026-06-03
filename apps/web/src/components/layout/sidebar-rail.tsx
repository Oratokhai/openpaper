"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Home, Compass, Cpu, Bookmark, Bell, PenLine, LogIn, User, FileText, LogOut, LayoutGrid, Pencil, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsland, type IslandState, type IslandActivity } from "./island-context";

const items = [
  { href: "/home",          icon: Home,     label: "Home"          },
  { href: "/explore",       icon: Compass,  label: "Explore"       },
  { href: "/models",        icon: Cpu,      label: "Models"        },
  { href: "/saved",         icon: Bookmark, label: "Saved"         },
  { href: "/notifications", icon: Bell,     label: "Notifications" },
];

export function SidebarRail({
  unreadNotifications = 0,
  profileUsername = null,
}: {
  unreadNotifications?: number;
  profileUsername?: string | null;
}) {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const island = useIsland();
  // When collapsed and a page has pushed context, the island morphs to a contextual face.
  const showContext = !expanded && island.state !== null;
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close any open menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "?"
    : "";

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const accountMenuItems = (close: () => void) => (
    <>
      {profileUsername && (
        <Link
          href={`/${profileUsername}`}
          role="menuitem"
          onClick={close}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
        >
          <User className="w-4 h-4 text-[#888]" /> View profile
        </Link>
      )}
      <Link
        href="/studio"
        role="menuitem"
        onClick={close}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
      >
        <LayoutGrid className="w-4 h-4 text-[#888]" /> Studio
      </Link>
      <Link
        href="/drafts"
        role="menuitem"
        onClick={close}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
      >
        <FileText className="w-4 h-4 text-[#888]" /> Drafts
      </Link>
      <button
        role="menuitem"
        onClick={() => {
          close();
          signOut({ redirectUrl: "/" });
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
      >
        <LogOut className="w-4 h-4 text-[#888]" /> Sign out
      </button>
    </>
  );

  return (
    <>
      {/* ── Desktop: Dynamic Island rail (md and up) ────────────────────────── */}
      {/* Logo — top-left corner (outside the pill, where it naturally sits) */}
      <Link
        href={isSignedIn ? "/home" : "/"}
        aria-label="Openpaper home"
        className="hidden md:flex fixed left-4 top-4 z-40 w-11 h-11 items-center justify-center rounded-xl text-[#f5f3ee] text-3xl hover:bg-white/[0.05] transition-colors"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        ❦
      </Link>

      {/* Center: floating, morphing nav pill (nav + Write only) */}
      <div className="hidden md:flex fixed left-3 top-0 bottom-0 z-40 items-center pointer-events-none">
        <motion.aside
          layout
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="pointer-events-auto flex flex-col gap-1 p-2 rounded-[26px] bg-[#161616]/95 backdrop-blur-md border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {island.activity ? (
            <ActivityFace activity={island.activity} />
          ) : showContext && island.state ? (
            <ContextFace state={island.state} />
          ) : (
            <>
              {/* Nav (incl. Studio) */}
              {[...items, { href: "/studio", icon: LayoutGrid, label: "Studio" }].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      "relative flex items-center gap-2 rounded-xl h-11 transition-colors",
                      active ? "bg-[#ff6b5c]/10 text-[#ff6b5c]" : "text-[#8d8d8d] hover:text-[#f5f3ee] hover:bg-white/[0.05]"
                    )}
                  >
                    <span className="relative w-11 h-11 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                      {item.href === "/notifications" && unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#ff6b5c] text-white text-[10px] font-semibold flex items-center justify-center">
                          {unreadNotifications > 9 ? "9+" : unreadNotifications}
                        </span>
                      )}
                    </span>
                    {expanded && <span className="text-sm whitespace-nowrap animate-in fade-in duration-200">{item.label}</span>}
                  </Link>
                );
              })}

              <span className="h-px w-full bg-white/[0.07] my-1" />

              {/* Write */}
              <Link
                href="/write"
                aria-label="Write a new article"
                className="flex items-center gap-2 rounded-xl h-11 bg-[#ff6b5c] hover:bg-[#e8513f] text-white transition-colors"
              >
                <span className="w-11 h-11 flex items-center justify-center shrink-0"><PenLine className="w-5 h-5" /></span>
                {expanded && <span className="text-sm font-medium whitespace-nowrap animate-in fade-in duration-200">Write</span>}
              </Link>
            </>
          )}
        </motion.aside>
      </div>

      {/* Account / sign in — bottom-left corner (its own element, so the menu
          isn't killed by the pill's hover-leave) */}
      {isLoaded && (
        isSignedIn ? (
          <div ref={menuRef} className="hidden md:block fixed left-3 bottom-4 z-40">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-11 h-11 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[12px] font-semibold overflow-hidden">
                {user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.imageUrl} alt={user.fullName ?? "You"} className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </span>
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute bottom-0 left-full ml-2 w-48 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl"
              >
                {accountMenuItems(() => setMenuOpen(false))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/signin"
            aria-label="Sign in"
            className="hidden md:flex fixed left-3 bottom-4 z-40 w-11 h-11 items-center justify-center rounded-full border border-white/[0.1] text-[#858585] hover:text-[#f5f3ee] hover:border-white/[0.2] transition-all"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        )
      )}

      {/* ── Mobile: floating Write button (below md) ────────────────────────── */}
      <Link
        href="/write"
        aria-label="Write a new article"
        className="md:hidden fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-50 w-14 h-14 rounded-full bg-[#ff6b5c] hover:bg-[#e8513f] active:scale-95 flex items-center justify-center text-white shadow-lg shadow-black/40 transition-all"
      >
        <PenLine className="w-6 h-6" />
      </Link>

      {/* ── Mobile: bottom tab bar (below md) ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-around border-t border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 h-14 transition-colors",
                active ? "text-[#f5f3ee]" : "text-[#8d8d8d]"
              )}
            >
              <Icon className="w-[22px] h-[22px]" />
              {item.href === "/notifications" && unreadNotifications > 0 && (
                <span className="absolute top-2 right-[calc(50%-18px)] min-w-[16px] h-4 px-1 rounded-full bg-[#ff6b5c] text-white text-[10px] font-semibold flex items-center justify-center">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}

        {/* Account / sign in */}
        {isLoaded && (
          isSignedIn ? (
            <div ref={mobileMenuRef} className="relative flex flex-1 items-stretch">
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={mobileMenuOpen}
                className="flex flex-1 flex-col items-center justify-center h-14 text-[#8d8d8d]"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-[11px] font-semibold overflow-hidden">
                  {user.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.imageUrl} alt={user.fullName ?? "You"} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </span>
              </button>

              {mobileMenuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-full right-2 mb-2 w-48 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl"
                >
                  {accountMenuItems(() => setMobileMenuOpen(false))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              aria-label="Sign in"
              className="flex flex-1 flex-col items-center justify-center gap-0.5 h-14 text-[#8d8d8d]"
            >
              <LogIn className="w-[22px] h-[22px]" />
            </Link>
          )
        )}
      </nav>
    </>
  );
}

/* ── Live activity peek (transient) ───────────────────────────────────────── */

function ActivityFace({ activity }: { activity: IslandActivity }) {
  const Icon = activity.icon === "check" ? Check : activity.icon === "heart" ? Heart : Bell;
  const tone = activity.tone === "ok" ? "text-emerald-400" : "text-[#ff6b5c]";
  return (
    <div className="flex items-center gap-1.5 pr-3 h-11 animate-in fade-in duration-200">
      <span className="w-11 h-11 flex items-center justify-center shrink-0">
        <Icon className={cn("w-[18px] h-[18px]", tone)} />
      </span>
      <span className="text-sm font-medium text-[#f5f3ee] whitespace-nowrap">{activity.label}</span>
    </div>
  );
}

/* ── Contextual ("Dynamic Island") resting face ───────────────────────────── */

function fmtWords(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
}

function ContextFace({ state }: { state: IslandState }) {
  if (state.mode === "writing") {
    return (
      <div className="flex flex-col items-center gap-1 w-11 py-2">
        <Pencil className="w-[18px] h-[18px] text-[#ff6b5c]" />
        <span className="text-[13px] font-semibold text-[#f5f3ee] tabular-nums leading-none">{fmtWords(state.words)}</span>
        <span className="text-[8px] uppercase tracking-wider text-[#8d8d8d] leading-none">words</span>
        <span
          title={state.saved ? "Saved" : state.isNew ? "Unsaved draft" : "Unsaved changes"}
          className={cn("mt-1 w-1.5 h-1.5 rounded-full", state.saved ? "bg-emerald-400" : "bg-[#ff6b5c]")}
        />
      </div>
    );
  }

  // reading — circular progress ring
  const p = Math.round(state.progress);
  const r = 15;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center w-11 h-11">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="20" cy="20" r={r} fill="none" stroke="#ff6b5c" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (circ * p) / 100}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold text-[#f5f3ee] tabular-nums">{p}</span>
    </div>
  );
}
