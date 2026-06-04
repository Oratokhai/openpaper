import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FileText, GraduationCap, BarChart3 } from "lucide-react";
import { PublicTopNav } from "@/components/layout/public-top-nav";
import { IphoneArticle } from "@/components/mockup/iphone-article";
import { OpusArticleBody } from "@/components/mockup/opus-article-body";
import { listFeedArticles } from "@/db/articles";

export default async function LandingPage() {
  // Signed-in users belong in the app, not the marketing landing.
  const { userId } = await auth();
  if (userId) redirect("/home");

  const latest = await listFeedArticles(4);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">

      {/* ── Nav — shared pill (same as /explore, /models, /docs) ──────── */}
      <PublicTopNav />

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        {/*
          Layout mirrors Paragraph's hero:
          - Section is full-width, relative, overflow-hidden, fixed height
          - Left copy floats in normal flow (max-width constrained)
          - iPhone is absolutely positioned right, scaled up 2×, cropped at bottom
            so only the top ~half of the phone (screen, cover, title) is visible
        */}
        <section className="relative overflow-hidden min-h-[600px] lg:min-h-[860px]">

          {/* Left: copy — vertically centred within the section */}
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 flex items-center min-h-[600px] lg:min-h-[860px]">
            <div className="max-w-[560px]">
              <p className="text-[#ff6b5c] text-[15px] font-medium tracking-wide mb-6">
                Written by the people building it
              </p>

              <h1
                className="text-[#f5f3ee] text-6xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-0.03em] mb-8"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Write the
                <br />
                AI era
              </h1>

              <p className="text-[#f5f3ee]/70 text-lg font-medium mb-4">
                AI moves fast. Write it down.
              </p>
              <p className="text-[#8a8a8a] text-[17px] leading-relaxed mb-10">
                Openpaper is where developers, builders, and researchers
                publish what they&apos;re learning — so nothing gets lost in the noise.
                The home for AI writing, built for the people making it.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/signup"
                  className="bg-[#ff6b5c] text-white text-base px-7 py-3.5 rounded-xl font-medium hover:bg-[#e8513f] transition-colors"
                >
                  Start writing
                </Link>
                <Link
                  href="/explore"
                  className="text-[#bdbdbd] text-base px-7 py-3.5 rounded-xl font-medium border border-white/[0.1] hover:border-white/[0.25] hover:text-[#f5f3ee] transition-all"
                >
                  Read the era
                </Link>
              </div>
            </div>
          </div>

          {/* Right: iPhone — absolutely positioned, scaled up, cropped at bottom */}
          {/*
            The phone is 320×640 at native size.
            At scale(2.1) it becomes ~672×1344px.
            The container is positioned right-0, starts at top ~-20px,
            and the section overflow-hidden clips the bottom half away —
            leaving only the top ~360px of the scaled phone visible:
            Dynamic Island + status bar + Anthropic cover + article title area.
          */}
          <div
            className="absolute right-0 top-0 hidden lg:flex items-start justify-start"
            style={{ width: "50%", height: "100%", overflow: "hidden" }}
          >
            <div
              style={{
                transform: "scale(1.55)",
                transformOrigin: "top left",
                marginTop: 72,
                marginLeft: 124,
              }}
            >
              <IphoneArticle
                article={{
                  title: "Claude Opus 4.8: the model that finally caught its own mistakes",
                  author: "David Oratokhai",
                  date: "May 31, 2026",
                  readingTime: "7 min read",
                  tag: "Models & Research",
                  body: <OpusArticleBody />,
                }}
              />
            </div>
          </div>

        </section>

        {/* ── Why Openpaper ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-8 py-20 md:py-36 text-center">
          <h2
            className="text-[#f5f3ee] text-4xl sm:text-5xl mb-6"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Why Openpaper?
          </h2>
          <p className="text-[#969696] text-base max-w-xl mx-auto mb-20">
            The AI era is being written right now — in private Substacks, buried
            tweet threads, and Discord messages nobody saves. Openpaper is where
            it lives properly, written by the people actually building it.
          </p>

          <div className="grid md:grid-cols-3 gap-14 text-left">
            {[
              {
                title: "AI moves fast. Keep up.",
                body: "New models, techniques, and breakthroughs every week. Openpaper is the fastest way to publish and find what actually matters — not next month, now.",
              },
              {
                title: "Written by builders, not spectators",
                body: "Every writer on Openpaper is someone in the work. Prompt engineers, AI founders, researchers, power users. Real practitioners. Real signal.",
              },
              {
                title: "One feed for the whole era",
                body: "Stop chasing AI writing across five platforms. Follow the writers, topics, and models you care about — all in one place, finally.",
              },
            ].map((f) => (
              <div key={f.title}>
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b5c]" />
                </div>
                <h3 className="text-[#f5f3ee] text-xl font-medium mb-3">{f.title}</h3>
                <p className="text-[15px] text-[#969696] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Three kinds of publication ──────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-8 py-20 md:py-36 border-t border-white/[0.05]">
          <div className="text-center mb-20">
            <p className="text-[#ff6b5c] text-[15px] font-medium tracking-wide mb-4">
              Three kinds of writing
            </p>
            <h2 className="text-[#f5f3ee] text-4xl sm:text-5xl mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
              However you want to publish
            </h2>
            <p className="text-[#969696] text-base max-w-xl mx-auto">
              Every piece on Openpaper is one of three kinds, so readers find exactly what
              they&apos;re looking for — and filter to it on the feed or any model page.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: <FileText className="w-5 h-5 text-[#ff6b5c]" />,
                title: "Articles",
                body: "Explainers, deep-dives, announcements, and takes. The default — anything that informs or argues a point.",
              },
              {
                icon: <GraduationCap className="w-5 h-5 text-[#ff6b5c]" />,
                title: "Tutorials",
                body: "Hands-on, step-by-step guides. How to actually build the thing, with the prompts and code that make it work.",
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-[#ff6b5c]" />,
                title: "Benchmarks",
                body: "Data and comparisons. Evals, test results, and head-to-heads that show how models really perform.",
              },
            ].map((k) => (
              <div key={k.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
                <div className="w-11 h-11 rounded-xl bg-[#ff6b5c]/10 border border-[#ff6b5c]/20 flex items-center justify-center mb-5">
                  {k.icon}
                </div>
                <h3 className="text-[#f5f3ee] text-xl font-medium mb-3">{k.title}</h3>
                <p className="text-[15px] text-[#969696] leading-relaxed">{k.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI-Native Features ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-8 py-20 md:py-36">
          {/* Section header */}
          <div className="text-center mb-20">
            <p className="text-[#ff6b5c] text-[15px] font-medium tracking-wide mb-4">
              Not just another Substack
            </p>
            <h2
              className="text-[#f5f3ee] text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Built for how AI people actually write
            </h2>
            <p className="text-[#969696] text-base max-w-xl mx-auto">
              Every feature is designed around the content AI developers,
              researchers, and builders actually publish — not generic blogging tools
              retrofitted with an AI badge.
            </p>
          </div>

          {/* Feature rows — alternating layout */}
          <div className="space-y-6">

            {/* Row 1: Prompt Blocks + Model Output Blocks */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Prompt Blocks */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-9 flex flex-col gap-7">
                <div>
                  <span className="text-[12px] text-[#ff6b5c] font-medium uppercase tracking-widest">Prompt Blocks</span>
                  <h3 className="text-[#f5f3ee] text-2xl mt-3 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                    First-class prompts, not code blocks
                  </h3>
                  <p className="text-[15px] text-[#969696] leading-relaxed">
                    Prompts are first-class content on Openpaper. One-click copy, variable highlighting, model context — designed for how AI people actually share prompts, not pasted as raw text.
                  </p>
                </div>
                {/* Visual mockup */}
                <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                    <span className="text-[10px] text-[#ff6b5c] font-medium uppercase tracking-widest">Prompt</span>
                    <span className="text-[10px] text-[#858585] bg-white/[0.04] px-2 py-0.5 rounded">Claude Sonnet 4.6</span>
                  </div>
                  <div className="px-4 py-3 font-mono text-[12px] leading-relaxed">
                    <p className="text-[#bbb]">You are a <span className="text-[#ff9a8f] bg-[#ff9a8f]/10 px-1 rounded">{"{{role}}"}</span> helping a user</p>
                    <p className="text-[#bbb]">understand <span className="text-[#ff9a8f] bg-[#ff9a8f]/10 px-1 rounded">{"{{topic}}"}</span>.</p>
                    <p className="text-[#bbb] mt-2">Be concise. Cite sources.</p>
                    <p className="text-[#bbb]">User: <span className="text-[#ff9a8f] bg-[#ff9a8f]/10 px-1 rounded">{"{{input}}"}</span></p>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04]">
                    <span className="text-[10px] text-[#787878]">47 tokens</span>
                    <button className="text-[10px] text-[#ff6b5c] font-medium">Copy prompt</button>
                  </div>
                </div>
              </div>

              {/* Model Output Blocks */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-9 flex flex-col gap-7">
                <div>
                  <span className="text-[12px] text-[#ff6b5c] font-medium uppercase tracking-widest">Model Output Blocks</span>
                  <h3 className="text-[#f5f3ee] text-2xl mt-3 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                    Responses with provenance
                  </h3>
                  <p className="text-[15px] text-[#969696] leading-relaxed">
                    LLM outputs need more than pasted text. Every model output block shows which model, which version, and when — because AI responses change between releases.
                  </p>
                </div>
                {/* Visual mockup */}
                <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
                    <span className="text-[10px] text-[#ff6b5c] font-medium uppercase tracking-widest">Model Output</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#858585]">Claude Opus 4.8</span>
                      <span className="text-[10px] text-[#787878]">· May 28, 2026</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[12px] text-[#bbb] leading-relaxed">
                      The key insight here is that retrieval quality matters more than generation quality in most RAG systems. Focus your attention on the chunking strategy and embedding model before...
                    </p>
                    <button className="text-[10px] text-[#858585] mt-2 hover:text-[#888]">Show full response ↓</button>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04]">
                    <span className="text-[10px] text-[#787878]">Generated with temp 0.3</span>
                    <button className="text-[10px] text-[#ff6b5c] font-medium">Copy</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Model Pages — full width feature */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-9 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-[12px] text-[#ff6b5c] font-medium uppercase tracking-widest">Model Mentions & Pages</span>
                <h3 className="text-[#f5f3ee] text-4xl mt-4 mb-4 leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
                  AI models are first-class citizens
                </h3>
                <p className="text-[15px] text-[#969696] leading-relaxed mb-5">
                  Type <code className="text-[#ff9a8f] bg-white/[0.05] px-1.5 py-0.5 rounded text-[12px]">@claude-sonnet-4</code> or <code className="text-[#ff9a8f] bg-white/[0.05] px-1.5 py-0.5 rounded text-[12px]">@gpt-4o</code> in any article and it becomes a live link to that model&apos;s page — showing specs, version history, and every article ever written about it on Openpaper.
                </p>
                <p className="text-[15px] text-[#969696] leading-relaxed">
                  Follow a model. Get notified when new writing is published about it. This is what makes Openpaper AI-native — not just AI-flavoured.
                </p>
              </div>
              {/* Model page mockup */}
              <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
                <div className="p-4 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-[10px] text-[#858585] mb-0.5">Anthropic</p>
                      <p className="text-[#f5f3ee] text-sm font-medium">Claude Opus 4.8</p>
                    </div>
                    <span className="text-[11px] text-[#ff6b5c] border border-[#ff6b5c]/30 px-3 py-1 rounded-full">Following</span>
                  </div>
                  <div className="flex gap-4 mt-3 text-[10px] text-[#858585]">
                    <span>1M ctx</span>
                    <span>·</span>
                    <span>Text · Vision</span>
                    <span>·</span>
                    <span className="text-[#aaa]">1,240 articles</span>
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { title: "Claude Opus 4.8: the model that finally caught its own mistakes", author: "David Oratokhai" },
                    { title: "Why Opus 4.8's alignment gains matter more than the benchmarks", author: "Sarah Chen" },
                    { title: "Dynamic Workflows in production: what actually works", author: "Marcus Webb" },
                  ].map((a) => (
                    <div key={a.title} className="px-4 py-3">
                      <p className="text-[12px] text-[#ccc] leading-snug line-clamp-1 mb-0.5">{a.title}</p>
                      <p className="text-[10px] text-[#858585]">{a.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: AI Taxonomy + Freshness Stamps */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* AI Taxonomy */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-9 flex flex-col gap-7">
                <div>
                  <span className="text-[12px] text-[#ff6b5c] font-medium uppercase tracking-widest">AI Taxonomy</span>
                  <h3 className="text-[#f5f3ee] text-2xl mt-3 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                    Tags that actually mean something
                  </h3>
                  <p className="text-[15px] text-[#969696] leading-relaxed">
                    A curated tag system built for the AI landscape — not generic labels. RAG, Agents, Fine-tuning, Evals, Benchmarks. Follow topics, not just people.
                  </p>
                </div>
                {/* Visual mockup */}
                <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-4">
                  <p className="text-[10px] text-[#787878] mb-3 uppercase tracking-widest">Topics you follow</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { t: "Prompt Engineering", f: true },
                      { t: "RAG & Memory", f: true },
                      { t: "Agents", f: true },
                      { t: "Fine-tuning", f: false },
                      { t: "Benchmarks", f: false },
                      { t: "LLM Apps", f: false },
                    ].map((tag) => (
                      <span
                        key={tag.t}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          tag.f
                            ? "text-[#ff9a8f] bg-[#ff6b5c]/10 border-[#ff6b5c]/20"
                            : "text-[#858585] bg-white/[0.03] border-white/[0.06]"
                        }`}
                      >
                        {tag.t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Freshness Stamps */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-9 flex flex-col gap-7">
                <div>
                  <span className="text-[12px] text-[#ff6b5c] font-medium uppercase tracking-widest">Freshness Stamps</span>
                  <h3 className="text-[#f5f3ee] text-2xl mt-3 mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                    AI writing has a shelf life
                  </h3>
                  <p className="text-[15px] text-[#969696] leading-relaxed">
                    An article about &ldquo;the best embedding model&rdquo; written eight months ago may be dangerously wrong today. Every article shows what it covers and when it was last verified.
                  </p>
                </div>
                {/* Visual mockup */}
                <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] divide-y divide-white/[0.04]">
                  {[
                    { title: "RAG chunking strategies that work in 2026", stamp: "✅ Current", stampColor: "text-emerald-400", note: "Verified May 2026" },
                    { title: "Best embedding models for production use", stamp: "🟡 May be outdated", stampColor: "text-yellow-400", note: "Last verified Jan 2026" },
                    { title: "GPT-3 fine-tuning guide", stamp: "🔴 Outdated", stampColor: "text-red-400", note: "Not reviewed in 14mo" },
                  ].map((a) => (
                    <div key={a.title} className="px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-[12px] text-[#bbb] line-clamp-1 flex-1">{a.title}</p>
                      <div className="text-right shrink-0">
                        <p className={`text-[10px] font-medium ${a.stampColor}`}>{a.stamp}</p>
                        <p className="text-[10px] text-[#787878]">{a.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Topics ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-8 py-20 md:py-36 text-center">
          <h2
            className="text-[#f5f3ee] text-4xl sm:text-5xl mb-6"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Every corner of the AI era
          </h2>
          <p className="text-[#969696] text-base max-w-xl mx-auto mb-16">
            From foundational research to production war stories — the whole
            landscape, written by people who live in it.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {[
              { label: "Prompts",  c: "from-[#ff6b5c] to-[#c9443a]" },
              { label: "RAG",     c: "from-[#06b6d4] to-[#3b82f6]" },
              { label: "Agents",  c: "from-[#f59e0b] to-[#ef4444]" },
              { label: "Models",  c: "from-[#e8513f] to-[#ff9a8f]" },
              { label: "Tuning",  c: "from-[#10b981] to-[#06b6d4]" },
              { label: "Evals",   c: "from-[#ef4444] to-[#f59e0b]" },
              { label: "Infra",   c: "from-[#3b82f6] to-[#ff6b5c]" },
              { label: "Ethics",  c: "from-[#ff9a8f] to-[#e8513f]" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-3">
                <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${t.c} flex items-center justify-center shadow-lg`} style={{ width: 72, height: 72 }}>
                  <span className="text-white text-2xl font-semibold">{t.label[0]}</span>
                </div>
                <span className="text-[13px] text-[#8d8d8d]">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Article cards (real latest) ─────────────────────────────── */}
        {latest.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-20 md:py-36">
          <h2
            className="text-[#f5f3ee] text-4xl sm:text-5xl text-center mb-5 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            From the people building it
          </h2>
          <p className="text-[#969696] text-base text-center max-w-xl mx-auto mb-16">
            AI moves fast. These writers are keeping up — and writing it all down.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {latest.map((a) => (
              <Link
                key={a.articleId}
                href={`/${a.author.username}/${a.id}`}
                className="group rounded-2xl border border-white/[0.07] bg-[#121212] overflow-hidden hover:border-white/[0.14] transition-all"
              >
                {a.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.coverImage} alt={a.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className={`h-40 bg-gradient-to-br ${a.cover}`} />
                )}
                <div className="p-5">
                  <h3 className="text-[#e8e6e0] text-base font-medium leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-[13px] text-[#8d8d8d]">{a.author.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        )}

        {/* ── Cream growth panel ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-8 py-20 md:py-36">
          <div className="rounded-3xl bg-[#fdf0d5] p-12 md:p-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-[#1a1a1a] text-4xl sm:text-5xl md:text-6xl leading-[1.02] mb-7"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Your thinking
                <br />
                belongs here
              </h2>
              <p className="text-[#858585] text-base leading-relaxed mb-3 max-w-sm font-medium">
                AI moves fast. Write it down.
              </p>
              <p className="text-[#969696] text-base leading-relaxed mb-9 max-w-sm">
                Build an audience of people who actually care. Reach readers&apos;
                inboxes. Become the voice that people trust when the next model
                drops, the next paper lands, the next era begins.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-[#1a1a1a] text-white text-base px-7 py-3.5 rounded-xl font-medium hover:bg-black transition-colors"
              >
                Start writing — it&apos;s free
              </Link>
            </div>

            {/* What you get — honest, non-fabricated panel */}
            <div className="rounded-2xl bg-white p-7 shadow-xl">
              <p className="text-[12px] font-medium text-[#999] uppercase tracking-widest mb-5">
                What you get
              </p>
              <div className="space-y-4">
                {[
                  { t: "Your own publication", s: "A profile + page for every article you write" },
                  { t: "Readers in their inbox", s: "Subscribers get new articles by email" },
                  { t: "AI-native blocks", s: "Prompts, model outputs, @model mentions, freshness" },
                  { t: "Followers & comments", s: "Build an audience that actually engages" },
                ].map((f, i) => (
                  <div key={f.t} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-[#ff6b5c]/10 text-[#ff6b5c] text-[13px] font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] text-[#1a1a1a] font-medium">{f.t}</p>
                      <p className="text-[13px] text-[#999]">{f.s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-20">
        <div className="max-w-6xl mx-auto px-8 flex flex-col items-center gap-5">
          <span className="text-[#f5f3ee] text-3xl" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
          <p className="text-[#858585] text-[15px]">Written by the people building it.</p>
          <nav className="flex items-center gap-8 text-[15px] text-[#858585]">
            <Link href="/about"   className="hover:text-[#f5f3ee] transition-colors">About</Link>
            <Link href="/docs"    className="hover:text-[#f5f3ee] transition-colors">Docs</Link>
            <Link href="/explore" className="hover:text-[#f5f3ee] transition-colors">Explore</Link>
            <Link href="/models"  className="hover:text-[#f5f3ee] transition-colors">Models</Link>
            <Link href="/privacy" className="hover:text-[#f5f3ee] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[#f5f3ee] transition-colors">Terms</Link>
          </nav>
          <p className="text-[#6e6e6e] text-sm">© 2026 Openpaper</p>
        </div>
      </footer>

    </div>
  );
}
