import Link from "next/link";

export const metadata = { title: "About · Openpaper" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f3ee]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-[14px] text-[#888] hover:text-[#f5f3ee] transition-colors">← Openpaper</Link>
        <h1 className="text-4xl mt-8 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
          About Openpaper
        </h1>
        <div className="space-y-4 text-[15px] text-[#aaa] leading-relaxed">
          <p>
            Openpaper is the publication platform for people building with AI — developers,
            researchers, and practitioners. It&apos;s where the AI era gets written down properly,
            by the people actually doing the work.
          </p>
          <p>
            Articles, tutorials, and benchmarks. AI-native blocks — prompts, model outputs,
            model mentions, freshness stamps. Readers follow writers and models; writers reach
            inboxes. One home for AI writing instead of five scattered platforms.
          </p>
          <p className="text-[#8d8d8d]">More here soon.</p>
        </div>
      </div>
    </div>
  );
}
