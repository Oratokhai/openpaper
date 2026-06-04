import Link from "next/link";
import { Bell, Heart, MessageCircle, UserPlus, Mail } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { listNotifications, type NotificationView } from "@/db/notifications";
import { formatRelativeDate } from "@/lib/utils";
import { MarkNotificationsRead } from "@/components/notifications/mark-read";

const ICONS = {
  like: { Icon: Heart, color: "text-rose-400", verb: "liked your article" },
  comment: { Icon: MessageCircle, color: "text-[#ff6b5c]", verb: "commented on your article" },
  follow: { Icon: UserPlus, color: "text-emerald-400", verb: "started following you" },
  subscribe: { Icon: Mail, color: "text-amber-400", verb: "subscribed to you" },
} as const;

function href(n: NotificationView): string {
  if (n.article) return `/${n.article.authorUsername}/${n.article.slug}`;
  return `/${n.actor.username}`;
}

export default async function NotificationsPage() {
  const { userId } = await auth();
  const notifications = userId ? await listNotifications(userId) : [];

  return (
    <div className="relative">
      <MarkNotificationsRead />

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-8 h-16 flex items-center gap-3">
          <Bell className="w-4 h-4 text-[#ff6b5c]" />
          <span className="text-[#f5f3ee] text-[15px] font-medium">Notifications</span>
          {notifications.length > 0 && (
            <span className="text-[12px] text-[#858585] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-5">
              <Bell className="w-6 h-6 text-[#6e6e6e]" />
            </div>
            <h2 className="text-[#f5f3ee] text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
              No notifications yet
            </h2>
            <p className="text-[#858585] text-[14px] max-w-xs">
              When people like, comment on, follow, or subscribe to you, it&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {notifications.map((n) => {
              const cfg = ICONS[n.type];
              const initials = n.actor.name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 py-4 px-2 -mx-2 rounded-xl transition-colors hover:bg-white/[0.02] ${
                    n.read ? "" : "bg-[#ff6b5c]/[0.04]"
                  }`}
                >
                  {/* Avatar → actor's profile */}
                  <Link href={`/${n.actor.username}`} className="relative shrink-0" aria-label={`View ${n.actor.name}'s profile`}>
                    {n.actor.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.actor.avatarUrl} alt={n.actor.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-xs font-semibold">
                        {initials}
                      </span>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#161616] border border-white/[0.08] flex items-center justify-center">
                      <cfg.Icon className={`w-2.5 h-2.5 ${cfg.color}`} />
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#ccc] leading-snug">
                      {/* Name → actor's profile */}
                      <Link href={`/${n.actor.username}`} className="text-[#f5f3ee] font-medium hover:underline underline-offset-2">
                        {n.actor.name}
                      </Link>{" "}
                      {/* Action text → the article (falls back to the profile when there's no article) */}
                      <Link href={href(n)} className="hover:text-[#f5f3ee] transition-colors">
                        {cfg.verb}
                        {n.article && <span className="text-[#888]"> · {n.article.title}</span>}
                      </Link>
                    </p>
                    <p className="text-[12px] text-[#858585] mt-0.5">{formatRelativeDate(n.createdAt)}</p>
                  </div>

                  {!n.read && <span className="mt-2 w-2 h-2 rounded-full bg-[#ff6b5c] shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
