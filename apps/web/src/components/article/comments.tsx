"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addComment } from "@/lib/social-actions";
import type { CommentView } from "@/db/interactions";
import { formatRelativeDate } from "@/lib/utils";

export function Comments({
  articleId,
  initialComments,
  canComment,
}: {
  articleId: string;
  initialComments: CommentView[];
  canComment: boolean;
}) {
  const [list, setList] = useState(initialComments);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setError("");
    startTransition(async () => {
      const res = await addComment(articleId, text);
      if (!res.ok) {
        setError(res.error === "auth" ? "Please sign in to comment." : "Could not post comment.");
        return;
      }
      setList((prev) => [...prev, res.comment]);
      setBody("");
    });
  };

  return (
    <div id="comments" className="mt-16 pt-10 border-t border-white/[0.06] scroll-mt-24">
      <h3 className="text-[#f5f3ee] text-lg mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
        {list.length} {list.length === 1 ? "comment" : "comments"}
      </h3>

      {canComment ? (
        <form onSubmit={submit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-[#f5f3ee] placeholder:text-[#6e6e6e] focus:outline-none focus:border-[#6366f1]/50 resize-none transition-all"
          />
          {error && <p className="text-[13px] text-rose-400 mt-2">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={pending || !body.trim()}
              className="px-4 py-2 rounded-xl bg-[#6366f1] text-white text-[14px] font-medium hover:bg-[#5457e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Posting…" : "Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-[14px] text-[#858585]">
          <Link href="/signin" className="text-[#6366f1] hover:underline">Sign in</Link> to join the conversation.
        </p>
      )}

      <div className="space-y-6">
        {list.map((c) => {
          const initials = c.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={c.id} className="flex gap-3">
              {c.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.author.avatarUrl} alt={c.author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/${c.author.username}`} className="text-[14px] text-[#f5f3ee] hover:underline">
                    {c.author.name}
                  </Link>
                  <span className="text-[12px] text-[#858585]">{formatRelativeDate(c.createdAt)}</span>
                </div>
                <p className="text-[14px] text-[#bbb] leading-relaxed whitespace-pre-wrap">{c.body}</p>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-[14px] text-[#858585]">No comments yet. Be the first.</p>
        )}
      </div>
    </div>
  );
}
