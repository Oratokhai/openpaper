"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toggleModelFollow } from "@/lib/social-actions";

export function ModelFollowButton({
  modelSlug,
  initialFollowing,
}: {
  modelSlug: string;
  initialFollowing: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [, startTransition] = useTransition();

  const onClick = () => {
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const res = await toggleModelFollow(modelSlug);
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
          ? "shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-sm text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.25] transition-all"
          : "shrink-0 px-5 py-2.5 rounded-xl bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5457e0] transition-colors"
      }
    >
      {following && <Check className="w-3.5 h-3.5" />}
      {following ? "Following" : "Follow model"}
    </button>
  );
}
