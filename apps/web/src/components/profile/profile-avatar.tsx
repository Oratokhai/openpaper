"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Camera } from "lucide-react";

export function ProfileAvatar({
  avatarUrl,
  name,
  isSelf,
}: {
  avatarUrl: string | null;
  name: string;
  isSelf: boolean;
}) {
  const { user } = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file || !user) return;
    setBusy(true);
    try {
      await user.setProfileImage({ file });
      // Our DB avatar_url re-syncs from Clerk on the next layout render.
      router.refresh();
    } catch (err) {
      console.error("[profile avatar] upload failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const inner = avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0a0a0a]" />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6b5c] to-[#c9443a] flex items-center justify-center text-white text-3xl font-bold ring-4 ring-[#0a0a0a]">
      {initials}
    </div>
  );

  if (!isSelf) return <div className="shrink-0">{inner}</div>;

  return (
    <div className="relative shrink-0 group">
      {inner}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="Change profile photo"
        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/55 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
      >
        {busy ? (
          <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
    </div>
  );
}
