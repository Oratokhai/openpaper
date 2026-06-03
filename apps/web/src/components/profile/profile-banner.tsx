"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { updateBanner } from "@/lib/social-actions";
import { uploadImage } from "@/lib/upload-client";

export function ProfileBanner({ bannerUrl, isSelf }: { bannerUrl: string | null; isSelf: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const url = await uploadImage(file);
      await updateBanner(url);
      router.refresh();
    } catch (err) {
      console.error("[banner upload] failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-40 rounded-3xl bg-gradient-to-br from-[#ff6b5c] via-[#e8513f] to-[#3a0f0b] relative overflow-hidden group">
      {bannerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(ellipse at 30% 20%, #ff9a8f 0%, transparent 60%)" }}
      />

      {isSelf && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex items-center justify-center gap-2 text-white/90 text-sm font-medium bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
          >
            {busy ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Change cover
              </>
            )}
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
        </>
      )}
      {error && <p className="absolute bottom-2 left-3 text-[11px] text-rose-300">{error}</p>}
    </div>
  );
}
