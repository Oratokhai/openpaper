"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toggleSave } from "@/lib/social-actions";

export function UnsaveButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => { await toggleSave(articleId); router.refresh(); })}
      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#787878] hover:text-[#888] hover:bg-white/[0.04] transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
      title="Remove from saved"
      aria-label="Remove from saved"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}
