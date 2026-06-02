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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || user.username?.[0]?.toUpperCase() || "?"
    : "";

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-[76px] flex flex-col items-center py-6 bg-[#0a0a0a]">
      {/* Logo */}
      <Link href={isSignedIn ? "/home" : "/"} aria-label="Openpaper home" className="mb-9 text-[#f5f3ee] text-3xl" style={{ fontFamily: "var(--font-fraunces)" }}>
        ❦
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-colors group relative",
                active
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
                {profileUsername && (
                  <Link
                    href={`/${profileUsername}`}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#888]" /> View profile
                  </Link>
                )}
                <Link
                  href="/drafts"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#888]" /> Drafts
                </Link>
                <button
                  role="menuitem"
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#888]" /> Sign out
                </button>
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
  );
}
