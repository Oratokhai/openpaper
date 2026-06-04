# Openpaper — Master Index

> The publication platform for AI-enthusiast developers and builders.
> **Status:** Phase 1 UI in progress — core loop built | **Name:** Openpaper

---

## Navigation

| Section | Purpose |
|---|---|
| [[Project Overview]] | Vision, mission, goals, and principles |
| [[Audience & Personas]] | Who we're building for |
| [[Features]] | Full feature set and requirements |
| [[Content Strategy]] | Content types, taxonomy, editorial standards |
| [[Design & Style]] | Visual identity, UX principles, component library |
| [[Technical Architecture]] | Stack, system design, infrastructure |
| [[API & Integrations]] | External services, AI integrations |
| [[Business & Monetization]] | Revenue model, pricing, partnerships |
| [[Roadmap]] | Phases, milestones, priorities |
| [[Soft Launch]] | Go-to-market playbook + outreach templates |
| [[Research & Inspiration]] | References, competitive analysis, inspiration |

---

## Decision Log

| Decision | Answer | Date |
|---|---|---|
| Name | Openpaper | 2026-05-30 |
| Platform type | Pure publishing — articles | 2026-05-30 |
| Primary audience | AI writers — developers, builders, enthusiasts | 2026-05-30 |
| Flywheel | Writer-first, readers follow | 2026-05-30 |
| Content format | Articles only at launch (no short-form) | 2026-05-30 |
| Articles = newsletters | Yes — writer chooses email delivery per post | 2026-05-30 |
| Profile | Single profile for all users (no writer/reader split) | 2026-05-30 |
| Social layer | Likes, reactions, comments, replies, threads, reshares, saved, DMs, activity feed, notifications, trending, topics | 2026-05-30 |
| Monetization | Substack-style revenue share — shelved for now | 2026-05-30 |
| Mobile | Web first; **responsive mobile pass shipped 2026-06-02** (bottom tab bar, Write FAB, landing hamburger, full-width drawer, scaled hero/headings) | 2026-05-30 |
| Launch strategy | Open to all | 2026-05-30 |
| Short-form content | No — revisit if audience demands it | 2026-05-30 |
| Closest comparison | Paragraph.xyz but for AI | 2026-05-30 |
| Frontend framework | Next.js 16 (App Router) | 2026-05-30 |
| Styling | Tailwind CSS v4 | 2026-05-30 |
| Component library | shadcn/ui (Base UI) + Radix primitives | 2026-05-30 |
| Editor | Tiptap v3 (ProseMirror-based, React) | 2026-06-01 |
| Display font | Fraunces (variable: opsz, SOFT, WONK axes) | 2026-05-31 |
| Prose font | Lora (serif, article body) | 2026-05-31 |
| UI font | Geist Sans | 2026-05-31 |
| Design language | Dark (#0a0a0a bg), ~~indigo accent (#6366f1), cream (#efeae0)~~ → **forest/olive green accent (#606c38 / #283618 / sage #a3b18a), cream #fdf0d5** (palette swap 2026-06-02) | 2026-05-31 |
| AI-native features | Prompt Blocks, Model Output Blocks, Model Mentions & Pages, AI Taxonomy, Freshness Stamps | 2026-05-31 |
| Backend stack | Clerk v7 (auth) · Neon Postgres + Drizzle (DB) · Resend (email) · Vercel (host) | 2026-06-02 |
| Publication types | **Article (default, incl. opinions), Tutorial, Benchmark** — "Opinion" considered then dropped | 2026-06-02 |
| Subscribe vs Follow | Subscribe = email newsletter (`subscriptions`); Follow = in-app feed/notifications (`follows`) — distinct | 2026-06-02 |
| Docs nav link | Deferred to launch prep — removed from nav for now (no dead link) | 2026-06-02 |
| Documentation | Shipped a dedicated public **`/docs`** page (how-to + reference, sticky scroll-spy TOC, dark/coral); re-added the Docs link to landing nav + footer + mobile menu | 2026-06-03 |
| GTM / launch strategy | **Writer-first soft launch** to ~20 hand-picked people via personal network (seed content first), then public hard launch once flywheel turns — see [[Soft Launch]] | 2026-06-03 |
| Brand accent | **Signal coral `#ff6b5c`** (hover `#e8513f`, light `#ff9a8f`) — swapped wholesale from olive/forest green. Dark theme kept; adapted only the accent from a coral+paper writing-app reference | 2026-06-03 |
| Writer Studio | New `/studio` writer's-desk (greeting + drafts + published) + floating editor command bar — adapted from the same reference, kept dark — see [[Design & Style]] | 2026-06-03 |
| Navigation = Dynamic Island | Desktop rail reimagined as a floating **morphing pill** (motion/Framer): hover-expand (L1) + contextual morph per route (L3, writing/reading faces) + live-activity peeks (L2). Added `motion` dep. Mobile bar unchanged — see [[Design & Style]] | 2026-06-03 |
| First-publish celebration | Publish-success state now nudges sharing (X + LinkedIn intents) on every publish; a writer's **first-ever** published article fires confetti + celebratory copy + a one-time congrats email (`sendFirstPublishCongrats`). See [[First-Publish Celebration]] | 2026-06-04 |
| Signed-out chrome | The left rail / app shell is **signed-in only**. Logged-out visitors on public app pages (`/explore`, `/models`, reader, profile) now get a top **pill nav** (`PublicTopNav`: Explore · Models · Docs + Sign in / Start writing) — they no longer see the "logged-in" rail. `(app)/layout` branches on auth. **One shared nav across landing + docs + explore + models.** See [[Design & Style]] | 2026-06-04 |
| Password guidance | Signup + reset-password forms show a live **strength meter + requirements checklist** (`components/auth/password-strength.tsx`) as the user types — teaches "strong enough" before Clerk rejects on submit (Clerk's own check only fires post-submit) | 2026-06-04 |
| Feed avatars + clickable notif actors | Fixed: (1) `FeedCard` ignored `author.avatar` (always drew initials) — now renders the photo w/ initials fallback; data layer already provided it. (2) Notification rows were one big `<Link>` to the article, so you couldn't reach the actor — split into separate links (avatar + name → actor profile, action text → the post; can't nest `<a>` so the row is now a `<div>`) | 2026-06-04 |

---

## Open Questions

- [x] Backend stack — ✅ Clerk + Neon + Drizzle + Resend + Vercel
- [x] Email delivery — ✅ Resend (code done; needs API key + verified domain to deliver)
- [x] Settings panel — ✅ freshness + per-post email toggle wired into publish flow
- [ ] Monetization detail — shelved, revisit at Phase 3
- [ ] Resend domain verification — needed for real subscriber delivery (free tier = self only)
- [ ] Vercel Blob store — image uploads now work in **local dev** via `public/uploads/` fallback; prod still needs a Blob store connected (`BLOB_READ_WRITE_TOKEN`) for persistent cover/banner images
- [ ] Smarter feed ranking (trending currently = raw like count)

---

*Tags: `#platform` `#publication` `#AI` `#Openpaper`*
*Vault initialized: 2026-05-30 | Last synced: 2026-06-02 (delete-post revalidation + unified image upload w/ dev fallback)*
