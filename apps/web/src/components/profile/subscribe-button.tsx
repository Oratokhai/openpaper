"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { toggleSubscribe } from "@/lib/social-actions";

export function SubscribeButton({
  writerId,
  initialSubscribed,
}: {
  writerId: string;
  initialSubscribed: boolean;
}) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [, startTransition] = useTransition();

  const onClick = () => {
    const next = !subscribed;
    setSubscribed(next);
    startTransition(async () => {
      const res = await toggleSubscribe(writerId);
      if (!res.ok) {
        if (res.error === "auth") router.push("/signin");
        setSubscribed(!next);
      } else {
        setSubscribed(res.subscribed);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      title="Get new articles delivered to your inbox"
      className={
        subscribed
          ? "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.12] text-sm text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.25] transition-all"
          : "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b5c] text-white text-sm font-medium hover:bg-[#e8513f] transition-colors"
      }
    >
      {subscribed ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
