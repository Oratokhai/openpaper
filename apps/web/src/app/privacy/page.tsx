import Link from "next/link";

export const metadata = { title: "Privacy · Openpaper" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f3ee]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-[14px] text-[#888] hover:text-[#f5f3ee] transition-colors">← Openpaper</Link>
        <h1 className="text-4xl mt-8 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
          Privacy Policy
        </h1>
        <div className="space-y-4 text-[15px] text-[#aaa] leading-relaxed">
          <p className="text-[#8d8d8d] text-[13px] uppercase tracking-widest">Placeholder — not yet finalized</p>
          <p>
            Authentication is handled by Clerk; your articles, profile, and social activity are
            stored in our database to run the product. Email delivery (for subscribers) is handled
            by Resend. We don&apos;t sell your data.
          </p>
          <p>
            A complete privacy policy detailing data retention, cookies, and your rights will be
            published before public launch.
          </p>
        </div>
      </div>
    </div>
  );
}
