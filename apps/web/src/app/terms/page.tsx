import Link from "next/link";

export const metadata = { title: "Terms · Openpaper" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f3ee]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-[14px] text-[#888] hover:text-[#f5f3ee] transition-colors">← Openpaper</Link>
        <h1 className="text-4xl mt-8 mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
          Terms of Service
        </h1>
        <div className="space-y-4 text-[15px] text-[#aaa] leading-relaxed">
          <p className="text-[#8d8d8d] text-[13px] uppercase tracking-widest">Placeholder — not yet finalized</p>
          <p>
            By using Openpaper you agree to write and behave in good faith: you own or have the
            right to publish what you post, you won&apos;t post unlawful, abusive, or infringing
            content, and you&apos;re responsible for your account.
          </p>
          <p>
            Openpaper is provided as-is during this early period. These terms will be expanded into
            full legal language before public launch.
          </p>
        </div>
      </div>
    </div>
  );
}
