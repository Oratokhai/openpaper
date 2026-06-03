import Link from "next/link";
import type { ReactNode } from "react";
import {
  FileText, GraduationCap, BarChart3, Terminal, Bot, AtSign, Tag, Clock,
  PenLine, Users, Mail, Compass, Bookmark, Bell,
} from "lucide-react";
import { DocsToc, type DocsSection } from "@/components/docs/docs-toc";

const SECTIONS: DocsSection[] = [
  { id: "overview", label: "What is Openpaper" },
  { id: "who", label: "Who it's for" },
  { id: "getting-started", label: "Getting started" },
  { id: "publication-types", label: "Publication types" },
  { id: "ai-native", label: "AI-native blocks" },
  { id: "editor", label: "Writing & the editor" },
  { id: "audience", label: "Growing an audience" },
  { id: "discovery", label: "Finding things" },
  { id: "faq", label: "FAQ" },
];

export const metadata = {
  title: "Documentation — Openpaper",
  description: "What Openpaper is, how to use it, and every feature — for the people writing the AI era.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-[#f5f3ee] text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>❦</span>
            <span className="text-[#f5f3ee] font-medium text-lg tracking-tight">Openpaper</span>
            <span className="text-[#6e6e6e] text-sm ml-1">/ Docs</span>
          </Link>
          <div className="flex items-center gap-6 text-[15px] text-[#8a8a8a]">
            <Link href="/explore" className="hidden sm:block hover:text-[#f5f3ee] transition-colors">Explore</Link>
            <Link href="/models" className="hidden sm:block hover:text-[#f5f3ee] transition-colors">Models</Link>
            <Link
              href="/signup"
              className="bg-[#ff6b5c] text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:bg-[#e8513f] transition-colors"
            >
              Start writing
            </Link>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <p className="text-[#ff6b5c] text-[15px] font-medium tracking-wide mb-4">Documentation</p>
        <h1 className="text-[#f5f3ee] text-5xl sm:text-6xl tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>
          How Openpaper works
        </h1>
        <p className="text-[#969696] text-lg max-w-2xl leading-relaxed">
          Everything you need to read, write, and grow on the home for AI writing — what it is,
          how to use it, and what every feature does.
        </p>
      </div>

      {/* Body: sticky TOC + content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-32 grid lg:grid-cols-[220px_1fr] gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <DocsToc sections={SECTIONS} />
          </div>
        </aside>

        <main className="max-w-3xl min-w-0">
          {/* 1 — Overview */}
          <Section id="overview" title="What is Openpaper">
            <P>
              Openpaper is a publishing platform for the AI era — a home where the people
              <em> building</em> with AI write about it, and where everyone else comes to read what
              actually matters. Think of it as a publication built specifically for AI work:
              articles, tutorials, and benchmarks, with the things AI writers need treated as
              first-class — prompts, model outputs, and the models themselves.
            </P>
            <P>
              Unlike a generic blog or newsletter tool, Openpaper is <strong>AI-native</strong>:
              you can drop a real prompt block, attach a model&apos;s response with full provenance,
              link a model by name, tag with a curated AI taxonomy, and stamp how fresh a piece is.
              One profile per person — anyone can write, anyone can read.
            </P>
          </Section>

          {/* 2 — Who */}
          <Section id="who" title="Who it's for">
            <P>If you&apos;re active in the AI space, Openpaper is for you:</P>
            <ULItems items={[
              ["Builders & developers", "shipping with AI APIs and models — what you built, how, and what broke."],
              ["Researchers", "model behaviour, benchmarks, papers, findings."],
              ["Founders", "company-building, GTM, and product decisions in AI."],
              ["Educators", "guides, walkthroughs, and explainers."],
              ["Power users", "workflows, tips, and comparisons from using AI tools deeply."],
            ]} />
            <Callout>There&apos;s no &ldquo;writer&rdquo; vs &ldquo;reader&rdquo; split — every account is a single profile that can do both.</Callout>
          </Section>

          {/* 3 — Getting started */}
          <Section id="getting-started" title="Getting started">
            <Steps steps={[
              ["Create an account", <>Sign up with email &amp; password, or one-click with GitHub or Google. Email sign-ups confirm with a short verification code.</>],
              ["Set up your profile", <>Pick your <code>@handle</code>, add a bio, and link your GitHub / site. Your profile is your publication home.</>],
              ["Write your first piece", <>Hit <strong>Write</strong>, give it a title, and start in the editor. Save a draft anytime — it lands in your <Link href="/studio" className="text-[#ff6b5c] hover:text-[#ff9a8f]">Studio</Link>.</>],
              ["Publish", <>Choose a publication type, a cover, topics, a freshness stamp, and whether to email it to subscribers. Hit publish.</>],
              ["Share it", <>Your article gets a clean URL at <code>/your-handle/article-slug</code> — share it anywhere.</>],
            ]} />
          </Section>

          {/* 4 — Publication types */}
          <Section id="publication-types" title="The three publication types">
            <P>Every piece on Openpaper is one of three kinds, so readers can filter to exactly what they want on the feed and on any model page.</P>
            <CardGrid cards={[
              [<FileText className="w-5 h-5 text-[#ff6b5c]" />, "Article", "Explainers, deep-dives, announcements, and opinions. The default — anything that informs or argues a point."],
              [<GraduationCap className="w-5 h-5 text-[#ff6b5c]" />, "Tutorial", "Hands-on, step-by-step guides — how to actually build the thing, with the prompts and code that make it work."],
              [<BarChart3 className="w-5 h-5 text-[#ff6b5c]" />, "Benchmark", "Data and comparisons — evals, test results, and head-to-heads showing how models really perform."],
            ]} />
            <Callout>You pick the type in the publish panel. It powers the filter chips on the home feed and the tabs on each model page.</Callout>
          </Section>

          {/* 5 — AI-native blocks */}
          <Section id="ai-native" title="AI-native blocks">
            <P>These are what make Openpaper AI-native rather than AI-flavoured. Insert them from the editor&apos;s <strong>More</strong> menu (or type <code>@</code> for a model).</P>
            <FeatureList items={[
              [<Terminal className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Prompt Blocks", "Prompts as first-class content — one-click copy, variable highlighting, and the model they're meant for. Not pasted as raw text."],
              [<Bot className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Model Output Blocks", "Responses with provenance: which model, which version, and when — because AI outputs change between releases."],
              [<AtSign className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Model Mentions & Pages", <>Type <code>@claude-opus-4-8</code> and it becomes a live link to that model&apos;s page — specs, version history, and every article written about it. Follow a model to get notified of new writing.</>],
              [<Tag className="w-[18px] h-[18px] text-[#ff6b5c]" />, "AI Taxonomy", "A curated tag system for the AI landscape — RAG, Agents, Fine-tuning, Evals, and more. Follow topics, not just people."],
              [<Clock className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Freshness Stamps", "AI writing has a shelf life. Mark a piece Current, Aging, or Outdated so readers know whether they can still rely on it."],
            ]} />
          </Section>

          {/* 6 — Editor */}
          <Section id="editor" title="Writing & the editor">
            <P>The editor is rich-text (no Markdown needed) with everything technical writing wants:</P>
            <ULItems items={[
              ["Formatting", "headings, bold/italic/strike, inline code, links, bullet & numbered lists, images, and dividers."],
              ["Code blocks", "syntax-highlighted, for sharing real code."],
              ["Math", "LaTeX via the editor for equations."],
              ["Footnotes", "numbered, auto-renumbering, collected at the end."],
              ["AI-native blocks", "Prompt, Model Output, and @model mentions inline."],
            ]} />
            <P>
              On desktop, a <strong>floating command bar</strong> gives you Preview, Settings, and
              Publish without clutter. <strong>Save as draft</strong> anytime — drafts and published
              pieces both live in your <Link href="/studio" className="text-[#ff6b5c] hover:text-[#ff9a8f]">Studio</Link>,
              your writer&apos;s desk.
            </P>
            <P>
              When you publish, the settings panel lets you set the <strong>type</strong>, a
              <strong> cover</strong> (image or gradient), a subtitle, <strong>topics</strong>, a
              <strong> freshness stamp</strong>, and whether to <strong>email the piece to your
              subscribers</strong>.
            </P>
          </Section>

          {/* 7 — Audience */}
          <Section id="audience" title="Growing an audience">
            <P>Two distinct ways people connect with you — and they mean different things:</P>
            <FeatureList items={[
              [<Users className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Follow", "An in-app relationship. Followers see your new work in their Following feed and get notifications."],
              [<Mail className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Subscribe", "Email delivery. Subscribers get your articles in their inbox when you publish (with the email toggle on)."],
            ]} />
            <P>
              Readers <strong>like</strong>, <strong>save</strong>, and <strong>comment</strong> (with
              threaded replies) on your work, and you get a <strong>notification</strong> for likes,
              comments, follows, and subscribes.
            </P>
          </Section>

          {/* 8 — Discovery */}
          <Section id="discovery" title="Finding things to read">
            <FeatureList items={[
              [<Compass className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Home feed", "Three tabs — For you, Following (writers you follow), and Trending (by engagement)."],
              [<Compass className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Explore & search", "A magazine front page plus search across articles, writers, and models, and browse-by-topic."],
              [<Bot className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Models directory", "Every model, filterable by company and sorted by how much is written about it — each with its own page."],
              [<Bookmark className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Saved", "Bookmark anything to read later from your Saved list."],
              [<Bell className="w-[18px] h-[18px] text-[#ff6b5c]" />, "Notifications", "A running feed of activity on your work and the people/models you follow."],
            ]} />
          </Section>

          {/* 9 — FAQ */}
          <Section id="faq" title="FAQ">
            <FAQ items={[
              ["Is Openpaper free?", "Yes — free to read and free to publish."],
              ["Do I need to be a developer?", "No. If you build with, research, or use AI tools thoughtfully, you belong here."],
              ["How is this different from Substack or Medium?", "AI-native blocks (prompts, model outputs, @model pages), a curated AI taxonomy, and freshness stamps — built for AI content, not retrofitted onto a generic blog."],
              ["Can I email my articles to readers?", "Yes — turn on email delivery when publishing and subscribers receive the piece in their inbox."],
              ["Do I write in Markdown?", "No — the editor is rich-text, with dedicated code blocks and LaTeX for the technical bits."],
              ["Who owns what I write?", "You do. Openpaper is a place to publish it, not a claim on it."],
            ]} />
          </Section>

          <div className="mt-16 rounded-2xl border border-[#ff6b5c]/20 bg-[#ff6b5c]/[0.06] p-8 text-center">
            <h3 className="text-[#f5f3ee] text-2xl mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>Ready to write the AI era?</h3>
            <p className="text-[#969696] text-[15px] mb-6 max-w-md mx-auto">It&apos;s free, and your first article goes a long way.</p>
            <Link href="/signup" className="inline-block bg-[#ff6b5c] text-white text-base px-7 py-3.5 rounded-xl font-medium hover:bg-[#e8513f] transition-colors">
              Start writing
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Content primitives ───────────────────────────────────────────────────── */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 pt-12 first:pt-0 mb-4">
      <h2 className="text-[#f5f3ee] text-3xl mb-5" style={{ fontFamily: "var(--font-fraunces)" }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[#b8b5ad] text-[16px] leading-[1.75] mb-4 [&_code]:text-[#ff9a8f] [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_strong]:text-[#f5f3ee] [&_strong]:font-medium [&_em]:text-[#d8d5cd]">{children}</p>;
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-xl border-l-2 border-[#ff6b5c] bg-white/[0.02] px-5 py-3.5 text-[14px] text-[#969696] leading-relaxed [&_strong]:text-[#f5f3ee]">
      {children}
    </div>
  );
}

function ULItems({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-2.5 mb-4">
      {items.map(([t, d]) => (
        <li key={t} className="flex gap-3 text-[15px] leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#ff6b5c] shrink-0" />
          <span className="text-[#969696]"><strong className="text-[#f5f3ee] font-medium">{t}</strong> — {d}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ steps }: { steps: [string, ReactNode][] }) {
  return (
    <ol className="space-y-5 mb-4">
      {steps.map(([t, d], i) => (
        <li key={t} className="flex gap-4">
          <span className="w-8 h-8 rounded-full bg-[#ff6b5c]/10 text-[#ff6b5c] text-[14px] font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[#f5f3ee] text-[16px] font-medium mb-1">{t}</p>
            <p className="text-[#969696] text-[15px] leading-relaxed [&_code]:text-[#ff9a8f] [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_strong]:text-[#cfccc4]">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CardGrid({ cards }: { cards: [ReactNode, string, string][] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4 my-5">
      {cards.map(([icon, t, d]) => (
        <div key={t} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="w-10 h-10 rounded-xl bg-[#ff6b5c]/10 border border-[#ff6b5c]/20 flex items-center justify-center mb-4">{icon}</div>
          <h3 className="text-[#f5f3ee] text-[17px] font-medium mb-2">{t}</h3>
          <p className="text-[14px] text-[#969696] leading-relaxed">{d}</p>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ items }: { items: [ReactNode, string, ReactNode][] }) {
  return (
    <div className="space-y-3 my-5">
      {items.map(([icon, t, d], i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="w-10 h-10 rounded-xl bg-[#ff6b5c]/10 border border-[#ff6b5c]/20 flex items-center justify-center shrink-0">{icon}</div>
          <div className="min-w-0">
            <h3 className="text-[#f5f3ee] text-[16px] font-medium mb-1">{t}</h3>
            <p className="text-[14px] text-[#969696] leading-relaxed [&_code]:text-[#ff9a8f] [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px]">{d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQ({ items }: { items: [string, string][] }) {
  return (
    <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] mt-2">
      {items.map(([q, a]) => (
        <div key={q} className="py-5">
          <p className="text-[#f5f3ee] text-[16px] font-medium mb-2">{q}</p>
          <p className="text-[#969696] text-[15px] leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  );
}
