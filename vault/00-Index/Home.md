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
