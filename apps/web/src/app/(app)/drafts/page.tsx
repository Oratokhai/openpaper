import Link from "next/link";
import { FileText, PenLine } from "lucide-react";
import { listMyDrafts } from "../write/actions";
import { formatRelativeDate } from "@/lib/utils";

export default async function DraftsPage() {
  const drafts = await listMyDrafts();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#f5f3ee] text-3xl" style={{ fontFamily: "var(--font-fraunces)" }}>
            Drafts
          </h1>
          <p className="text-[#858585] text-[14px] mt-1">Unpublished work in progress</p>
        </div>
        <Link
          href="/write"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" />
          New article
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#858585]" />
          </div>
          <p className="text-[#888] text-[15px]">No drafts yet</p>
          <p className="text-[#858585] text-[13px]">Saved drafts from the editor will show up here.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {drafts.map((d) => (
            <Link
              key={d.id}
              href={`/write?edit=${d.id}`}
              className="flex items-center justify-between gap-4 py-4 group"
            >
              <span className="text-[15px] text-[#ddd] group-hover:text-[#f5f3ee] transition-colors truncate">
                {d.title || "Untitled"}
              </span>
              <span className="text-[13px] text-[#858585] shrink-0">
                Edited {formatRelativeDate(d.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
