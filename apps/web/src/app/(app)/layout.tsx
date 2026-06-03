import { SidebarRail } from "@/components/layout/sidebar-rail";
import { IslandProvider } from "@/components/layout/island-context";
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
      <IslandProvider>
        <SidebarRail unreadNotifications={unreadNotifications} profileUsername={profileUsername} />
        {/* Clear the left rail on desktop; clear the bottom tab bar on mobile. */}
        <div className="md:pl-[76px] pb-[calc(env(safe-area-inset-bottom)+56px)] md:pb-0">{children}</div>
      </IslandProvider>
    </div>
  );
}
