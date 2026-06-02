"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { toggleFollow } from "@/lib/social-actions";

export function FollowButton({
  targetUserId,
  initialFollowing,
}: {
  targetUserId: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [, startTransition] = useTransition();

  const onClick = () => {
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const res = await toggleFollow(targetUserId);
      if (!res.ok) {
        if (res.error === "auth") router.push("/signin");
        setFollowing(!next);
      } else {
        setFollowing(res.following);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      className={
        following
          ? "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-sm text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.25] transition-all"
          : "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors"
      }
    >
      {following ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
      {following ? "Following" : "Follow"}
    </button>
  );
}
