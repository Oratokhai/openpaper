import { SidebarRail } from "@/components/layout/sidebar-rail";
import { syncCurrentUser, getUsernameById } from "@/db/users";
import { countUnreadNotifications } from "@/db/notifications";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Ensure the signed-in user exists in our DB (idempotent; no-op when signed out).
  const userId = await syncCurrentUser();
  const [unreadNotifications, profileUsername] = userId
    ? await Promise.all([countUnreadNotifications(userId), getUsernameById(userId)])
    : [0, null];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <SidebarRail unreadNotifications={unreadNotifications} profileUsername={profileUsername} />
      <div className="pl-[76px]">{children}</div>
    </div>
  );
}
