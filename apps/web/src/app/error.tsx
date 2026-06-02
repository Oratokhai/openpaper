"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-[#f5f3ee] text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
        Something went wrong
      </h1>
      <p className="text-[#8d8d8d] text-[14px] mb-8 max-w-sm">
        An unexpected error occurred. You can try again — if it keeps happening, we&apos;re on it.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-[#606c38] text-white text-sm font-medium hover:bg-[#283618] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
