# Roadmap

> **Return to:** [[Home]]

---

## Phase 0 — Discovery & Foundation ✅ COMPLETE
**Goal:** Lock vision, name, stack, and core feature set.

- [x] Complete grilling session / product discovery
- [x] Finalize platform name → **Openpaper**
- [x] Write vision & mission statement — see [[Project Overview]]
- [x] Define audience — see [[Audience & Personas]]
- [x] Define social feature set — see [[Social Features]]
- [x] Lock content format (articles only) — see [[Content Strategy]]
- [x] Define AI-native features — see [[AI-Native Features]]
- [x] Choose tech stack — Next.js 16, Tailwind v4, TypeScript, Tiptap — see [[Technical Architecture]]
- [x] Design direction — Fraunces headings, dark + indigo + cream, immersive Paragraph-scale sizing — see [[Design & Style]]

---

## Phase 1 — UI Build 🔄 IN PROGRESS
**Goal:** Complete, cohesive, clickable UI for all core flows.

### Completed
- [x] Landing page — hero, AI-native features section, cream CTA panel, footer
- [x] App shell — sidebar rail (icons: Home, Explore, Models, Saved, Notifications, Write)
- [x] Home feed — `FeedCard` with large covers, engagement, tabs (For you / Following / Trending)
- [x] Article reader — signature 3-zone layout (engagement dock + reading column + TOC/model rail)
  - Reading progress bar
  - Freshness stamp
  - Inline AI-native blocks: PromptBlock, ModelOutputBlock, ModelMention
  - Table of contents (IntersectionObserver auto-highlight)
  - Models in this article rail
- [x] Article editor (`/write`) — Tiptap rich text with full toolbar
  - Bold, italic, strike, inline code, link
  - Bullet + numbered lists, image, divider
  - Heading / subheading / blockquote (Style menu)
  - Code block with syntax highlighting (lowlight/highlight.js)
  - LaTeX / math (KaTeX)
  - Footnotes (numbered, auto-renumber, collected at bottom)
  - Prompt Block (node), Model Output Block (node), Model Mention chips (@model picker)
  - Preview mode (read-only render)
- [x] Models directory (`/models`) — 55 real models, working company filter, sorted by article count
- [x] Individual model page (`/models/[slug]`) — header, stats, article list, related models rail
- [x] Explore page — magazine front page + working search (articles/models/writers) + scrollable feed
  - Featured hero
  - Trending models horizontal rail
  - Browse by topic tiles
  - Fresh this week
  - The latest (full feed)
- [x] Profile page — builder's page design (UX-overhauled 2026-06-01)
  - Gradient banner + overlapping avatar (z-index stacking fix)
  - Subscribe (email/primary CTA) + Follow (in-app notifications/secondary)
  - Banner edit-cover affordance (hover overlay, Phase 2 upload)
  - GitHub + portfolio + location inline in handle row
  - "Writes about" section: Models subheading (@chips) + Topics subheading (pills)
  - "Best of" hero card (most-liked, replaces "Starred")
  - Stats (followers · articles · total likes) above bio
  - Bio in main flow (always visible on mobile and desktop)
  - Compact article list (title + tag + reading time + likes) replaces heavy FeedCards
  - "Writers like this" sidebar (scored by overlapping tags + models)
  - Empty state for new writers (banner + avatar + "Publish first article" CTA)

### Remaining
- [x] `/saved` page — saved articles list (2026-06-01)
- [x] `/notifications` page — activity feed (2026-06-01)
- [x] `/signin` and `/signup` — auth pages (2026-06-01)
- [x] Settings panel in editor — freshness status + per-post email delivery toggle (2026-06-01)
- [x] Publish flow — right-side drawer with cover picker, subtitle, freshness, email toggle, success state (2026-06-01)

---

## 🚀 LIVE — deployed 2026-06-02
Openpaper is live on Vercel: **openpaper-five.vercel.app** (GitHub: `Oratokhai/openpaper`, public). Root dir `apps/web`, Framework Preset Next.js, dev Clerk keys, Neon (cloud), env vars set in Vercel. Verified: landing/explore/reader/post all 200, real 404 status in prod. First editorial post published: `/oratokhai/why-i-built-openpaper`.
**Still for real launch:** Vercel Blob store (cover/banner uploads — `BLOB_READ_WRITE_TOKEN`), `NEXT_PUBLIC_APP_URL` = live domain (email/share links), production Clerk instance + own OAuth apps, Resend verified domain.

### Polish fixes (2026-06-02)
- [x] **Delete-post UX** — `deleteArticle` now calls `revalidatePath` (`/home`, `/explore`, `/drafts`, `/<user>`, `/<user>/<slug>`), so a deleted post disappears immediately on redirect instead of lingering until a manual refresh.
- [x] **Image uploads work without infra** — rewrote `/api/upload` into a unified server route: uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set (prod), else falls back to writing `public/uploads/` (local dev). Shared client helper `src/lib/upload-client.ts` (`uploadImage`); both cover (`write/page.tsx`) and banner (`profile-banner.tsx`) use it. Dropped `@vercel/blob/client` direct-upload. Cap 4 MB (under Vercel's 4.5 MB serverless body limit). `public/uploads/` gitignored. Prod still needs a Blob store connected for persistence.
- [x] **Palette rebrand** — indigo/violet → forest/olive green (`#283618`/`#606c38`/sage `#a3b18a`) + cream `#fdf0d5`. See [[Design & Style]].
- [x] **Mobile responsive pass** — site now feels good on phones (verified at 390px, zero horizontal overflow):
  - **App shell**: `SidebarRail` is the left rail on `md+`, a **fixed bottom tab bar** below `md` (Home/Explore/Models/Saved/Notifications + account), with a floating **Write FAB**. `(app)/layout` uses `md:pl-[76px]` + bottom padding (safe-area aware) on mobile.
  - **Landing**: new `landing-mobile-menu.tsx` hamburger (Explore/Models/Sign in); hero `text-6xl sm:text-7xl md:text-8xl`; section headings `text-4xl sm:text-5xl`; `py-20 md:py-36`; hero min-h `600px lg:860px`.
  - **Editor**: publish drawer `w-full sm:w-[420px]`.
  - **Reader**: byline + Subscribe/Follow stack on mobile (`flex-col sm:flex-row`) — fixed a collision bug.
  - **Root**: added `viewport` export (`width=device-width`, `themeColor #0a0a0a`).

### Coral rebrand + Writer Studio (2026-06-03)
- [x] **Palette swap olive/forest green → signal coral `#ff6b5c`** across tokens + ~44 files (perl find-exec; cover/avatar/banner gradients + cream-foreground special-cased to keep dark anchors & legibility). Dark theme unchanged.
- [x] **Floating editor command bar** — desktop bottom-center pill (Preview · Settings · Publish · More); mobile keeps the top cluster.
- [x] **`/studio` writer workspace** — greeting + type pills + Recent Drafts + Published (`listMyPublished` added); sidebar `LayoutGrid` + account-menu entry; protected route.
- ⬜ Cleanup: `article-card.tsx` stray retired tokens (`#818cf8` indigo, `#e8d5b0` gold). ⬜ Re-save the one existing published post so its stored olive cover gradient → coral (Tailwind only generates in-source classes).

### Documentation page (2026-06-03)
- [x] Public **`/docs`** — practical how-to + reference: what Openpaper is, who it's for, getting started, the 3 publication types, AI-native blocks, the editor/Studio, follow vs subscribe, discovery, FAQ.
- [x] Sticky scroll-spy TOC (`components/docs/docs-toc.tsx`); dark/coral, Fraunces. Docs link re-added to landing nav + footer + mobile menu (fills the deferred nav link).

### Dynamic Island navigation (2026-06-03)
- [x] **Desktop rail → floating morphing pill** with `motion` (Framer Motion). Mobile bottom bar unchanged.
- [x] **L1** expand-on-hover (icons → labels, spring `layout` morph).
- [x] **L3** contextual morph: `useIsland()` channel + `IslandProvider` in `(app)` layout; collapsed face = writing (live word count + saved dot) on `/write`, reading (progress ring) on reader pages.
- [x] **L2** live-activity peek (`pushActivity`) — "Draft saved ✓"/"Published ✓" on save.
- ⬜ Real-time notification peeks (needs realtime/polling — notifications aren't live yet). ⬜ Reduced-motion fallback pass.

## Phase 2 — Backend
**Goal:** Make it real — auth, database, actual publishing/following.

### Stack locked (2026-06-01)
| Layer | Choice | Reason |
|---|---|---|
| Auth | Clerk v7 | Best Next.js 16 App Router DX, headless mode keeps custom UI |
| Database | Neon | Serverless Postgres, clean Drizzle pairing, Vercel-native |
| ORM | Drizzle | TypeScript-first, serverless-friendly |
| Email | Resend + React Email | React templates, best DX for dev audience |
| Hosting | Vercel | Native Next.js deployment |

### Completed
- [x] Clerk installed + wired — `ClerkProvider` in root layout, middleware protecting `/home`, `/write`, `/saved`, `/notifications`
- [x] Auth pages wired to Clerk v7 Signal API — email/password + OAuth (GitHub, Google) + email verification step
- [x] SSO callback route at `/sso-callback`
- [x] Sidebar shows real auth state — signed-in avatar, sign-out, sign-in prompt when logged out

### Must-haves
- [x] Neon DB provisioned + Drizzle schema (users, articles, follows, model_follows, likes, saves, comments) — migrated 2026-06-02
- [x] Clerk→DB user sync — webhook (`/api/webhooks/clerk`) + lazy sync in `(app)/layout` (`syncCurrentUser`). Verified 2026-06-02: user row lands in Neon on app load.
- [x] Real user profiles — DB-backed profile (`components/profile/db-profile.tsx`) for signed-up users
- [x] Article publishing — create/publish/draft + **edit/update** existing (`write/actions.ts`: `publishArticle` upserts via optional `articleId`, `getArticleForEdit`, `listMyDrafts`). Editor loads `?edit=<id>`, owner "Edit" link on reader. Drafts page at `/drafts`.
- [x] Likes / saves / comments — `lib/social-actions.ts` + reads in `db/interactions.ts`. Wired **everywhere**: reader EngagementDock, **feed cards** (`FeedCardActions`, per-user liked/saved via `annotateInteractions` batch query), and `Comments`. Optimistic; signed-out → /signin. Verified 2026-06-02.
- [x] Saved page — DB-backed (`listSavedArticles`), real unsave (`UnsaveButton` → `router.refresh()`), sidebar derived from real saves.
- [x] Read articles from DB — reader, home feed, profile all DB-backed (mock fallback kept for showcase). Verified 2026-06-02. Tiptap JSON → React via `tiptap-renderer.tsx`; queries in `db/articles.ts`.
- [x] Follow system — writers (`toggleFollow`, `FollowButton`, follower count) **and models** (`toggleModelFollow`, `ModelFollowButton` on model page). Verified 2026-06-02.
- [x] Publication types (Article/Tutorial/Benchmark) — global taxonomy: `article_type` column, editor picker, home feed filter chips, model-page tabs (functional), landing-page explainer. 2026-06-02.
- [x] Email delivery — Resend + React Email. `subscriptions` table, Subscribe button (`toggleSubscribe`), full-article email template (`emails/article-email.tsx` w/ Tiptap→email renderer incl. AI blocks), `lib/email.tsx` `sendArticleToSubscribers`, sent on first publish w/ toggle on. Needs `RESEND_API_KEY` (+ verified domain for non-self recipients). Code done 2026-06-02.
- [ ] User profiles — real data, not mock
- [x] Notifications (real) — `notifications` table + enum; fired on like/comment/follow/subscribe (not self) from `social-actions`; `db/notifications.ts` (create/list/countUnread); `/notifications` server page lists real events; bell badge in sidebar (unread count via `(app)/layout`); visiting marks read (`markNotificationsRead` + `MarkNotificationsRead` client). 2026-06-02.
- [~] Feed personalization — ✅ home tabs real: For you (`listFeedArticles`), Following (`listFollowingArticles` — writers you follow), Trending (`listTrendingArticles` — by like_count). Tabs+type filter combine via `?tab=&type=`. "Now popular" sidebar = real trending (mock fallback). 2026-06-02. ⬜ smarter ranking later.
- [x] Search + Explore (real) — Explore is now a server component: search (`?q=`, `searchArticles` ILIKE title/excerpt + `searchWriters` + static model match, real+mock combined), topic filter (`?tag=`, `listArticlesByTag`), real featured/latest (trending+feed), **real topic counts** (`topicCounts`). `SearchBox` client (debounced URL nav). Trending-models cards still use static model reference. 2026-06-02. ⬜ upgrade to Postgres FTS later.

### Nice-to-haves (Phase 2+)
- [ ] DMs
- [ ] Reshares
- [ ] Reactions
- [ ] Activity feed (real-time)

---

## 🌱 Soft Launch — first ~20 users (planned 2026-06-03)
**Goal:** ~20 real users + structured feedback. Writer-first, personal outreach, current setup. Full playbook + outreach template: [[Soft Launch]].

### A — Minimum pre-launch tweaks (not a hardening project)
- [ ] Verify a Resend domain (+ set `EMAIL_FROM`) — **only hard requirement** (else Subscribe silently fails); fallback: label Subscribe "coming soon"
- [ ] Set `NEXT_PUBLIC_APP_URL` to the real promotion URL
- [x] Accept knowingly: no Blob store (images may not persist), dev Clerk (fine at this scale)

### B — Seed content (before inviting anyone)
- [ ] Publish 3–5 strong posts across all 3 types (Article / Tutorial / Benchmark), using AI-native blocks
- [ ] Confirm Explore / Home / a model page render real content (no empty states) for a logged-out stranger

### C — Soft launch (the ~20)
- [ ] List 20–30 AI builders/writers from network (bias to those who'll publish)
- [ ] ~5–8 seed writers (ask: publish one post) + ~15 first readers (ask: read/follow/comment/feedback)
- [ ] Send short personal messages (staggered over a few days)

### D — Feedback
- [ ] One channel (form or DM thread), 4–5 questions
- [ ] Log findings in vault as they arrive

### E — Trigger for hard launch
- [ ] ≥3 unprompted publishes · no critical loop breakage · signs of return visits
- [ ] Then production hardening: custom domain · prod Clerk + own OAuth apps · Vercel Blob · Resend verified at volume
- [ ] Then public: X/LinkedIn · Show HN · subreddits · Product Hunt (wedge = AI-native blocks)

---

## Phase 3 — Growth & Monetization
**Goal:** Revenue model live, platform scaling.

- [ ] Monetization — Substack-style revenue share
- [ ] Mobile app (web complete by this point)
- [ ] Advanced discovery / personalization
- [ ] Analytics for writers

---

## Key Decisions Remaining

1. Backend stack — auth provider, DB, hosting (see [[Technical Architecture]])
2. Settings/publish flow — what the writer sees before hitting publish
3. Email strategy — Resend vs Postmark, template design

---

## Related Notes

- [[Project Overview]]
- [[Features]]
- [[Technical Architecture]]
- [[Business & Monetization]]

---

*Tags: `#roadmap` `#phases` `#milestones` `#planning`*
*Last updated: 2026-06-02 — Phase 2 backend: auth, DB, publishing, reading, social (likes/saves/comments/follows/subscribe), publication types, notifications, feed tabs, email delivery (code). Pending: Resend key/domain, search.*
