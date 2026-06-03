import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { listMyDrafts, listMyPublished } from "../write/actions";
import { getUsernameById } from "@/db/users";
import { StudioBoard } from "@/components/studio/studio-board";

export default async function StudioPage() {
  const { userId } = await auth();
  if (!userId) redirect("/signin");

  const [user, drafts, published, username] = await Promise.all([
    currentUser(),
    listMyDrafts(),
    listMyPublished(),
    getUsernameById(userId),
  ]);

  const firstName = user?.firstName || user?.username || "there";

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <p className="text-[15px] text-[#8d8d8d] font-medium">
        Hey, <span className="text-[#ff6b5c] font-semibold">{firstName}!</span>
      </p>

      <div className="flex items-end justify-between gap-4 mt-2 mb-10">
        <h1
          className="text-[#f5f3ee] text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          What will you
          <br />
          write today?
        </h1>
        <Link
          href="/write"
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6b5c] text-white text-sm font-semibold hover:bg-[#e8513f] transition-colors shrink-0"
        >
          <PenLine className="w-4 h-4" /> New article
        </Link>
      </div>

      <StudioBoard drafts={drafts} published={published} username={username} />
    </div>
  );
}
