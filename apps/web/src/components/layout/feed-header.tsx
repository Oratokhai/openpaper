"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function FeedHeader() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-end gap-4">
        {!isLoaded ? null : isSignedIn ? (
          <Link
            href="/write"
            className="text-[15px] bg-[#ff6b5c] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#e8513f] transition-colors"
          >
            Start writing
          </Link>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-[15px] text-[#888] hover:text-[#f5f3ee] transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-[15px] bg-[#ff6b5c] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#e8513f] transition-colors"
            >
              Start writing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
