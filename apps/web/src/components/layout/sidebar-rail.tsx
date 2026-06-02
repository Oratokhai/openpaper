"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Home, Compass, Cpu, Bookmark, Bell, PenLine, LogIn, User, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
      {/* ── Desktop: left icon rail (md and up) ─────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[76px] flex-col items-center py-6 bg-[#0a0a0a]">
        {/* Logo */}
        <Link href={isSignedIn ? "/home" : "/"} aria-label="Openpaper home" className="mb-9 text-[#f5f3ee] text-3xl" style={{ fontFamily: "var(--font-fraunces)" }}>
          ❦
        </Link>

        {/* Nav icons */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-colors group relative",
                  isActive(item.href)
                    ? "bg-white/[0.08] text-[#f5f3ee]"
                    : "text-[#8d8d8d] hover:text-[#f5f3ee] hover:bg-white/[0.04]"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.href === "/notifications" && unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#606c38] text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Write button */}
        <Link
          href="/write"
          title="Write"
          aria-label="Write a new article"
          className="w-11 h-11 rounded-xl bg-[#606c38] hover:bg-[#283618] flex items-center justify-center text-white transition-colors mb-5"
        >
          <PenLine className="w-5 h-5" />
        </Link>

        {/* Avatar / sign in */}
        {isLoaded && (
          isSignedIn ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#606c38] to-[#283618] flex items-center justify-center text-white text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                {user.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.imageUrl} alt={user.fullName ?? "You"} className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute bottom-0 left-12 w-48 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl"
                >
                  {accountMenuItems(() => setMenuOpen(false))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              title="Sign in"
              aria-label="Sign in"
              className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center text-[#858585] hover:text-[#f5f3ee] hover:border-white/[0.2] transition-all"
            >
              <LogIn className="w-4 h-4" />
            </Link>
          )
        )}
      </aside>

      {/* ── Mobile: floating Write button (below md) ────────────────────────── */}
      <Link
        href="/write"
        aria-label="Write a new article"
        className="md:hidden fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+72px)] z-50 w-14 h-14 rounded-full bg-[#606c38] hover:bg-[#283618] active:scale-95 flex items-center justify-center text-white shadow-lg shadow-black/40 transition-all"
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
                <span className="absolute top-2 right-[calc(50%-18px)] min-w-[16px] h-4 px-1 rounded-full bg-[#606c38] text-white text-[10px] font-semibold flex items-center justify-center">
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
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#606c38] to-[#283618] flex items-center justify-center text-white text-[11px] font-semibold overflow-hidden">
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
