import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6">
      <p className="text-[#ff6b5c] text-[64px] leading-none mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
        404
      </p>
      <h1 className="text-[#f5f3ee] text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
        This page doesn&apos;t exist
      </h1>
      <p className="text-[#8d8d8d] text-[14px] mb-8 max-w-sm">
        The article, profile, or page you&apos;re looking for isn&apos;t here.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/home" className="px-5 py-2.5 rounded-xl bg-[#ff6b5c] text-white text-sm font-medium hover:bg-[#e8513f] transition-colors">
          Go home
        </Link>
        <Link href="/explore" className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-sm text-[#aaa] hover:text-[#f5f3ee] hover:border-white/[0.25] transition-all">
          Explore
        </Link>
      </div>
    </div>
  );
}
