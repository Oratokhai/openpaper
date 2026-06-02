"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/app/(app)/write/actions";

export function DeleteArticleButton({
  articleId,
  redirectTo = "/home",
}: {
  articleId: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    startTransition(async () => {
      const res = await deleteArticle(articleId);
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setConfirming(false);
      }
    });
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-[13px]">
        <span className="text-[#8d8d8d]">Delete?</span>
        <button
          onClick={onDelete}
          disabled={pending}
          className="text-rose-400 hover:text-rose-300 font-medium disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Yes"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-[#858585] hover:text-[#f5f3ee]">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label="Delete article"
      className="flex items-center gap-1.5 text-[13px] text-[#858585] border border-white/[0.1] rounded-lg px-3 py-1.5 hover:text-rose-400 hover:border-rose-400/30 transition-all"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}
