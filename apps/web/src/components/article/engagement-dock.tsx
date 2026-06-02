"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Bookmark, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, toggleSave } from "@/lib/social-actions";

export function EngagementDock({
  likes,
  comments,
  articleId,
  initialLiked = false,
  initialSaved = false,
  orientation = "vertical",
}: {
  likes: number;
  comments: number;
  articleId?: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(initialSaved);
  const [shared, setShared] = useState(false);

  const horizontal = orientation === "horizontal";

  const onLike = () => {
    if (!articleId) return setLiked((v) => !v);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const res = await toggleLike(articleId);
      if (!res.ok) {
        if (res.error === "auth") router.push("/signin");
        setLiked(!next);
        setLikeCount((c) => c + (next ? -1 : 1));
      } else {
        setLiked(res.liked);
        setLikeCount(res.count);
      }
    });
  };

  const onSave = () => {
    if (!articleId) return setSaved((v) => !v);
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const res = await toggleSave(articleId);
      if (!res.ok) {
        if (res.error === "auth") router.push("/signin");
        setSaved(!next);
      } else {
        setSaved(res.saved);
      }
    });
  };

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("flex gap-1", horizontal ? "items-center" : "flex-col items-center")}>
      <DockButton orientation={orientation} onClick={onLike} active={liked} activeClass="text-rose-400" label={likeCount.toLocaleString()} ariaLabel={liked ? "Unlike" : "Like"} pressed={liked}>
        <Heart className={cn("w-[18px] h-[18px]", liked && "fill-rose-400")} strokeWidth={2} />
      </DockButton>

      <DockButton
        orientation={orientation}
        label={comments.toLocaleString()}
        ariaLabel="Jump to comments"
        onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
      >
        <MessageCircle className="w-[18px] h-[18px]" strokeWidth={2} />
      </DockButton>

      <DockButton orientation={orientation} onClick={onSave} active={saved} activeClass="text-[#6366f1]" ariaLabel={saved ? "Remove bookmark" : "Save"} pressed={saved}>
        <Bookmark className={cn("w-[18px] h-[18px]", saved && "fill-[#6366f1]")} strokeWidth={2} />
      </DockButton>

      <DockButton orientation={orientation} onClick={onShare} active={shared} activeClass="text-emerald-400" label={horizontal && shared ? "Copied" : undefined} ariaLabel="Share">
        {shared ? <Check className="w-[18px] h-[18px]" strokeWidth={2} /> : <Share2 className="w-[18px] h-[18px]" strokeWidth={2} />}
      </DockButton>
    </div>
  );
}

function DockButton({
  children,
  label,
  onClick,
  active,
  activeClass = "text-[#f5f3ee]",
  orientation = "vertical",
  ariaLabel,
  pressed,
}: {
  children: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  activeClass?: string;
  orientation?: "vertical" | "horizontal";
  ariaLabel?: string;
  pressed?: boolean;
}) {
  const horizontal = orientation === "horizontal";
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={cn(
        "flex items-center justify-center transition-colors rounded-full",
        horizontal ? "flex-row gap-1.5 h-9 px-3 text-[13px] font-medium" : "flex-col gap-0.5 w-11 h-11",
        active ? activeClass : "text-[#8d8d8d] hover:text-[#f5f3ee] hover:bg-white/[0.04]"
      )}
    >
      {children}
      {label && <span className={horizontal ? "text-[13px]" : "text-[10px] font-medium"}>{label}</span>}
    </button>
  );
}
