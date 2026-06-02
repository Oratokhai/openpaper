"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, toggleSave } from "@/lib/social-actions";

export function FeedCardActions({
  articleId,
  href,
  likes,
  comments,
  initialLiked = false,
  initialSaved = false,
}: {
  href: string;
  likes: number;
  comments: number;
  /** When present, like/save persist. Omit for display-only (mock). */
  articleId?: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(initialSaved);

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

  return (
    <div className="flex items-center gap-5 text-[#8d8d8d]">
      <button
        onClick={onLike}
        aria-label={liked ? "Unlike" : "Like"}
        aria-pressed={liked}
        className={cn("flex items-center gap-2 text-sm transition-colors", liked ? "text-rose-400" : "hover:text-rose-400")}
      >
        <Heart className={cn("w-5 h-5", liked && "fill-rose-400")} /> {likeCount}
      </button>
      <button
        onClick={() => router.push(`${href}#comments`)}
        aria-label="View comments"
        className="flex items-center gap-2 text-sm hover:text-[#f5f3ee] transition-colors"
      >
        <MessageCircle className="w-5 h-5" /> {comments}
      </button>
      <button
        onClick={onSave}
        aria-label={saved ? "Remove bookmark" : "Save"}
        aria-pressed={saved}
        className={cn("transition-colors", saved ? "text-[#606c38]" : "hover:text-[#f5f3ee]")}
      >
        <Bookmark className={cn("w-5 h-5", saved && "fill-[#606c38]")} />
      </button>
    </div>
  );
}
