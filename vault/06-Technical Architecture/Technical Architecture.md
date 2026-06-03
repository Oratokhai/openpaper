# Technical Architecture

> **Return to:** [[Home]]

---

## Status

Stack decided and in use. Frontend is fully scaffolded and in active development.

---

## Monorepo Structure

```
ai-publication-platform/
├── apps/
│   └── web/                  # Next.js 16 frontend (active)
│       ├── src/app/           # App Router routes
│       ├── src/components/    # UI + editor components
│       └── src/lib/           # Utilities, mock data
└── vault/                     # This Obsidian knowledge base
```

---

## Frontend (Built)

| Decision | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `params` are Promises — must `await params` in dynamic routes |
| Styling | **Tailwind CSS v4** | `@theme inline` tokens in globals.css |
| Component library | **shadcn/ui** (Base UI) + Radix primitives | shadcn in Next 16 uses `@base-ui/react`, not Radix Dialog etc. — use Radix primitives directly |
| Editor | **Tiptap v3** (ProseMirror) | Installed: StarterKit, CodeBlockLowlight, Mathematics (KaTeX), Image, Placeholder + custom AI-native nodes |
| Language | **TypeScript** | Strict mode |
| Icons | **Lucide React v1.17** | Note: brand icons (Github etc.) removed — use inline SVG |
| Animation | **motion** (Framer Motion v12) | Added 2026-06-03 for the Dynamic Island rail morph (`<motion.aside layout>`); React 19-ready |
| Fonts | **Fraunces** (display), **Lora** (prose), **Geist Sans/Mono** (UI) | Fraunces via `next/font/google` with axes: `["opsz", "SOFT", "WONK"]` |

## Backend (Phase 2 — in progress)

| Decision | Choice | Status |
|---|---|---|
| Auth | **Clerk v7** (`@clerk/nextjs@7.4.2`) | ✅ Integrated |
| Primary DB | **Neon serverless Postgres** | ✅ Provisioned + schema migrated |
| ORM | **Drizzle** (`drizzle-orm@0.45`, `drizzle-kit@0.31`) | ✅ Wired |
| Search | Postgres FTS or Typesense | ⬜ Deferred |
| Email | **Resend + React Email** | ⬜ Not started |
| Hosting | **Vercel** | ⬜ Not started |
| Storage | Cloudflare R2 | ⬜ Deferred |

> DB decision changed from Supabase → **Neon** (2026-06-01).

### Database — Neon + Drizzle (✅ live, 2026-06-02)

- **Driver:** `@neondatabase/serverless` (HTTP) + `drizzle-orm/neon-http`. Connection string in `.env.local` `DATABASE_URL` (Neon project, region us-east-1).
- **Files:** `src/db/schema.ts` (tables + relations + inferred types), `src/db/index.ts` (exports `db` client — import from `@/db`), `drizzle.config.ts`, migrations in `src/db/migrations/`.
- **Scripts:** `npm run db:generate` (write SQL migration), `db:migrate` (apply — use this, non-interactive), `db:push` (⚠️ prompts for a TTY → fails in agent shells, use generate+migrate instead), `db:studio` (GUI).
- **7 tables:** `users` (id = Clerk user id, `username` = @handle, unique), `articles` (content = Tiptap JSON, `tags`/`models` = text[], freshness/email_delivery/featured columns, unique (author_id, slug)), `follows`, `model_follows`, `likes`, `saves`, `comments` (self-ref `parent_id` for replies). All social tables cascade-delete on user/article removal.
- **Gotcha:** drizzle-kit `push` requires an interactive TTY confirmation — in non-interactive shells always do `db:generate` then `db:migrate`.

### User sync — Clerk → DB (✅ 2026-06-02)

- `src/db/users.ts`: `upsertUserFromClerk` (webhook path, snake_case `UserJSON`) + `syncCurrentUser` (lazy, camelCase `currentUser()` resource). Shared idempotent `upsertUser` (onConflictDoUpdate by id; retries handle with numeric suffix on username unique violation). Handle derived from `username` → `unsafe_metadata.username` → email local-part → name; slugified to `[a-z0-9_]`.
- `src/app/api/webhooks/clerk/route.ts`: `verifyWebhook` from `@clerk/nextjs/webhooks` (no svix dep needed; reads `CLERK_WEBHOOK_SIGNING_SECRET`). Handles `user.created/updated/deleted`.
- `(app)/layout.tsx` is now an async server component calling `syncCurrentUser()` — this is what makes sync work on **localhost** (webhooks can't reach localhost). Webhook is the production path; secret placeholder in `.env.local`.
- **Gotcha:** OAuth users get their GitHub/Google username as the handle (e.g. GitHub `oratokhai`). `verifyWebhook` wants `NextRequest`, not `Request`.

### Publishing (✅ create/publish, 2026-06-02)

- `src/app/(app)/write/actions.ts` → `publishArticle(input)` server action (`"use server"`, `auth()` for userId, calls `syncCurrentUser()` first to satisfy FK). Auto-slug from title (unique per author, numeric suffix on collision), reading time from word count, excerpt = subtitle || first 180 chars, `@model` mentions walked out of Tiptap doc → `models[]`. `status: published` sets `published_at`.
- `write/page.tsx` captures the Tiptap `Editor` via `RichEditor onReady`, extracts `getJSON()`/`getText()` on save. "Publish now" / "Save as draft" both call the action; success panel links to `/{username}/{slug}`.
- ⬜ Not yet: editing/updating an existing article (always inserts new).

### Reading from DB (✅ 2026-06-02)

- `src/db/articles.ts`: `listFeedArticles`, `listArticlesByAuthor`, `getArticleForReader(username, slug)`, `getUserByUsername`. `toFeedArticle` maps DB row → the `MockArticle`-shaped object the cards expect (`id` = slug).
- `src/components/article/tiptap-renderer.tsx`: server component rendering stored Tiptap JSON → React (standard nodes + custom `promptBlock`/`modelOutput`/`modelMention`/`footnote`; headings get slug `id`s). `extractToc()` builds the TOC (`{id,label}` — note TocSection uses `label`).
- **Pattern: DB-first, mock-fallback.** Reader (`[slug]/page.tsx`), profile (`[username]/page.tsx`), home feed all try DB first, fall back to mock showcase. Reader → `DbArticleReader`, profile → `DbProfile`. Real users (e.g. `oratokhai`) don't collide with mock authors (`davidoratokhai`, etc.).
- Reader & profile routes are **public** (not in `proxy.ts` protected matcher) → testable via curl without auth.

### Editing, drafts & social (✅ 2026-06-02)

- **Editing:** `publishArticle` takes optional `articleId` → UPDATE (keeps slug stable, sets `published_at` first time live). `getArticleForEdit(id)` (owner-only) loads into the client editor via `?edit=<id>` (read from `window.location`, applied to Tiptap with `commands.setContent` once `onReady`). Owner sees "Edit" link on the reader.
- **Drafts:** `listMyDrafts()` → `/drafts` page (protected). "Drafts" link in editor toolbar + "Your drafts" on own profile.
- **Mutations:** `src/lib/social-actions.ts` (`"use server"`): `toggleLike` (also bumps `articles.like_count` via SQL), `toggleSave`, `toggleFollow`, `addComment` (bumps `comment_count`). All `auth()`-gated → return `{ok:false, error:"auth"}` so the client redirects to `/signin`.
- **Reads:** `src/db/interactions.ts` (`server-only`): `getEngagement`, `listComments`, `isFollowing`, `countFollowers`.
- **UI:** `EngagementDock` now optimistic + DB-backed (articleId optional → still works display-only for mock reader). `Comments` (client) + `FollowButton` (client) call the actions. **Pattern:** client components import server actions directly; type-only imports from the `server-only` interactions module are safe (erased).
- **Feed cards now interactive:** `FeedArticle` carries `articleId` (UUID) + `liked`/`saved`; `annotateInteractions(list, userId)` batch-fills per-user state (2 queries w/ `inArray`). `FeedCardActions` (client) on every card. Home feed passes `auth()` userId.
- **Saved page** (`/saved`): `listSavedArticles(userId)`, `UnsaveButton` (client → `toggleSave` + `router.refresh()`).
- **Model follows:** `toggleModelFollow` / `isModelFollowing` (table `model_follows`), `ModelFollowButton` on `/models/[slug]`.
- ⬜ Still genuinely not built (separate feature, needs external setup): **email delivery via Resend** (the per-post email toggle is stored but doesn't send). Not a fake button — just an unbuilt integration.

### Publication types — global taxonomy (✅ 2026-06-02)

Decision: **3 first-class types — Article (default, includes opinions/takes), Tutorial, Benchmark.** ("Opinion" considered then dropped — opinions live under Article.)

- **Schema:** `article_type` pgEnum + `articles.type` column (default `article`), migration `0001`.
- **Author picks type** in the publish panel (`write/page.tsx` `TYPE_OPTIONS`, stored via `publishArticle`/`getArticleForEdit`).
- **Filterable globally:** `FeedArticle.type` carried through queries. Home feed type chips (`/home?type=`, server-filtered; mock only shown on "All"). Model page tabs (`ModelArticleTabs`, client filter All/Tutorials/Benchmarks) over real `listArticlesByModel(slug)` + mock (mock type inferred: Benchmarks tag → benchmark, else article).
- **Explained on landing** (`app/page.tsx` "However you want to publish" section).
- `listArticlesByModel` uses Postgres array containment: `sql\`${articles.models} @> ARRAY[${slug}]::text[]\``.

### Email delivery — Resend (✅ code, 2026-06-02)

- **Subscriptions** (email) are distinct from in-app follows: `subscriptions(subscriber_id, writer_id)` table (migration `0002`). `toggleSubscribe`/`isSubscribed`; profile "Subscribe" button = `SubscribeButton` (client). "Follow" still = `follows`.
- **Template:** `src/emails/article-email.tsx` — React Email (`@react-email/components`), dark theme, **full article body** via an email-safe Tiptap→email renderer (own copy with inline styles; handles paragraphs/headings/lists/quote/code/hr/img, marks, and AI blocks promptBlock/modelOutput/modelMention/footnote; cover gradient parsed from Tailwind classes → CSS gradient + bg fallback).
- **Send:** `src/lib/email.tsx` `sendArticleToSubscribers(articleId)` (`server-only`) — loads article+author, gets subscriber emails, sends per-recipient via `resend.emails.send({ react })`. Never throws (publish unaffected).
- **Trigger:** `publishArticle` calls it only on **first publish** (new published article, or draft→published where `publishedAt` was null) AND `emailDelivery` on — no resend on edits.
- **Env:** `RESEND_API_KEY`, `EMAIL_FROM` (default `onboarding@resend.dev`), `NEXT_PUBLIC_APP_URL`. ⚠️ Resend free tier w/o verified domain only delivers to the Resend account's own email — verify a domain for real subscriber delivery.

### Explore + Search (✅ 2026-06-02)

- `app/(app)/explore/page.tsx` is now a **server component** with 3 modes via searchParams: search (`?q=`), topic (`?tag=`), discovery (default).
- Queries in `db/articles.ts`: `searchArticles` (ILIKE title/excerpt), `searchWriters` (ILIKE name/username), `listArticlesByTag` (array `@>`), `topicCounts` (JS tally of `tags[]` — avoids `db.execute` driver-shape issues). Featured = `listTrendingArticles(1)`, latest = `listFeedArticles`.
- `components/explore/search-box.tsx` — client, debounced `router.replace(/explore?q=)`.
- Real + mock combined in results (dedupe by `username/slug`); models match against static `mockModels`; "Trending models" cards stay static reference.

### Adversarial-audit hardening (2026-06-02)

Fixed Critical + High findings from a 3-agent adversarial review:
- **XSS:** `src/lib/safe-url.ts` (`safeHref`/`safeImageSrc`, allow http/https/mailto + relative only) applied in `tiptap-renderer.tsx` and `emails/article-email.tsx`.
- **Mock removed app-wide** (product decision): home/explore/reader/profile/models render **only real DB data**; mock author/article URLs now 404. Kept `mockModels`/`mockTags` as legit reference (model directory + topic taxonomy) with **real** counts (`modelArticleCounts`, `topicCounts`). Reader & profile = DB-only (`notFound()` otherwise). Landing pulls real `listFeedArticles(4)`; fabricated "top writers" card replaced.
- **Token source-of-truth:** `globals.css` `:root` now canonical (`#0a0a0a`/`#f5f3ee`); removed the override hack + old `rgba(240,237,232)`. `article-card.tsx` migrated off `#f0ede8`/gold gradient/`font-serif`.
- **Social-action security** (`lib/social-actions.ts`): all mutations gated on `publishedArticleAuthorId` (no draft like/comment leak); comment length cap + try/catch; counters now **derived from `COUNT(*)`** (no drift).
- **Publish limits** (`write/actions.ts`): title 200 / subtitle 300 / content 1 MB + depth 60.
- **Reader** gets real Follow/Subscribe (non-owner). **Sidebar avatar** → dropdown (View profile/Drafts/Sign out) via `getUsernameById`, no more one-click logout.
- **Medium fixes:** notification dedupe (non-comment) + SQL `count()` for unread/followers; deleted dead `navbar.tsx`/`footer.tsx` + unused `ui/button.tsx`; stub pages `/about` `/terms` `/privacy` (signup legal links wired; dead "Forgot password?" removed — real reset is a TODO); branded `not-found.tsx` + `error.tsx`; a11y — real `alt`, `aria-label`/`aria-pressed` on icon buttons.
- **Contrast sweep (✅):** all sub-AA gray text raised monotonically — `#333/#3a3a3a→#6e6e6e`, `#444→#787878`, `#555→#858585`, `#666→#8d8d8d`, `#777→#969696` (meta text now ≥ ~4.5:1 on `#0a0a0a`).
- **Password reset (✅):** `(auth)/forgot-password` — Clerk `reset_password_email_code` (create → attemptFirstFactor → setActive); link restored on sign-in.
- **Still open (noted, not done):** custom 404 returns soft-200 in `next dev` (real 404 under `next start`); adopt a Button primitive as a consistency pass.

### Gotchas found wiring the reader (2026-06-02)

- **Tiptap `getJSON()` drops `attrs` on React-NodeView atom nodes** (`modelMention`) → content stored as `{type:"modelMention"}` (no slug), rendered "@@". Fix in `write/page.tsx` save(): collect mention slugs in doc order from live `editor.state.doc`, patch them back into the `getJSON()` output in order before saving. `ModelMention` display hardened (no double-`@`, returns null on empty slug). Existing broken row repaired via one-off DB patch.
- **Reader engagement dock is `hidden lg:block`** — added an inline **horizontal** `EngagementDock` (`orientation` prop, `lg:hidden`) under the byline so like/save/comment are reachable on narrow screens. Icons uniform `w-[18px]`; horizontal mode renders icon+count inline (not stacked). **Share** button: `navigator.share` → clipboard fallback + "Copied" check.
- **`@` model autocomplete in editor:** `model-mention-suggestion.ts` (Extension + `@tiptap/suggestion`, char `@`, filters `mockModels`) + `model-suggestion-list.tsx` (`ReactRenderer` dropdown, search header, ↑/↓/Enter via `useImperativeHandle`, manual fixed-position popup, no tippy). Inserts the existing `modelMention` node. Registered in `rich-editor.tsx`.

### Auth — Clerk integration (✅ working, 2026-06-01)

Custom-designed sign-in/sign-up pages (not Clerk's prebuilt components). Files:
- `apps/web/src/app/(auth)/signin/page.tsx`, `signup/page.tsx`, `sso-callback/page.tsx`, `layout.tsx`
- `apps/web/src/proxy.ts` — `clerkMiddleware` (renamed from `middleware.ts`, see gotcha)
- `ClerkProvider` wraps the app in `apps/web/src/app/layout.tsx`
- `.env.local` holds `pk_test_…` / `sk_test_…` (dev instance `crisp-kit-95`)

**Clerk v7 gotchas (cost a full debugging session — read before touching auth):**
1. **Use the LEGACY hook API, not the default Signal API.** `@clerk/nextjs@7.4.2` defaults `useSignIn`/`useSignUp` to an experimental **Signal/Future** API (`{ signUp, fetchStatus }`, errors surface on a separate `errors` signal). It silently hangs on `fetchStatus: "fetching"`. Import the classic hooks instead: `import { useSignIn, useSignUp } from "@clerk/nextjs/legacy"` → returns `{ isLoaded, signIn/signUp, setActive }`. `useUser` stays on `@clerk/nextjs` (legacy entry doesn't export it).
2. **Classic custom flow:** signup = `create()` → `prepareEmailAddressVerification({ strategy: "email_code" })` → `attemptEmailAddressVerification({ code })` → `setActive({ session })`. signin = `create({ identifier, password })` → `setActive()`. OAuth = `authenticateWithRedirect({ strategy, redirectUrl: "/sso-callback", redirectUrlComplete: "/home" })`. Catch errors with `isClerkAPIResponseError` from `@clerk/nextjs/errors`.
3. **CAPTCHA element is mandatory.** Bot Sign-up Protection is ON. Custom signup forms MUST include `<div id="clerk-captcha" />` or `create()` fails with `captcha_invalid`. (Cloudflare Turnstile blocks headless browsers — only test signup in a real browser.)
4. **SSO callback:** `/sso-callback` mounts `<AuthenticateWithRedirectCallback signInForceRedirectUrl="/home" signUpForceRedirectUrl="/home" />` from `@clerk/nextjs` (NOT `HandleSSOCallback`, which is from the mismatched `@clerk/react` signal package).
5. **Guard auth pages against active sessions.** After OAuth, users can land back on `/signin` with a live session; clicking a provider again throws *"You're already signed in."* Both auth pages `useEffect` → `router.replace("/home")` when `useUser()` reports signed in.
6. **Username is OFF** on the Clerk instance. The @handle is stored in `signUp.create({ unsafeMetadata: { username } })` and will be mirrored into our own `users` table.
7. OAuth sends **no confirmation email** — provider email is pre-verified. Email verification only applies to the email+password path.

---

## Key File Paths

| Path | Purpose |
|---|---|
| `apps/web/src/app/page.tsx` | Landing page |
| `apps/web/src/app/docs/page.tsx` | Public **/docs** — how-to + reference (sticky TOC) |
| `apps/web/src/components/docs/docs-toc.tsx` | Docs sticky scroll-spy TOC (IntersectionObserver) |
| `apps/web/src/app/(app)/home/page.tsx` | Authenticated home feed |
| `apps/web/src/app/(app)/explore/page.tsx` | Explore / discovery |
| `apps/web/src/app/(app)/[username]/page.tsx` | Builder profile page |
| `apps/web/src/app/(app)/[username]/[slug]/page.tsx` | Article reader (signature 3-zone layout) |
| `apps/web/src/app/(app)/write/page.tsx` | Tiptap article editor (+ floating command bar, desktop) |
| `apps/web/src/app/(app)/studio/page.tsx` | Writer Studio — drafts + published workspace |
| `apps/web/src/components/studio/studio-board.tsx` | Studio client board (filter pills + lists) |
| `apps/web/src/components/layout/sidebar-rail.tsx` | Desktop **Dynamic Island** rail (motion morph) + mobile bottom bar |
| `apps/web/src/components/layout/island-context.tsx` | `IslandProvider` / `useIsland()` — context channel pages use to morph the rail |
| `apps/web/src/app/(app)/models/page.tsx` | Models directory (55 models, filterable) |
| `apps/web/src/app/(app)/models/[slug]/page.tsx` | Individual model page |
| `apps/web/src/components/article/blocks/` | AI-native block components (reusable) |
| `apps/web/src/components/editor/` | Tiptap editor + extension nodes |
| `apps/web/src/components/mockup/` | iPhone article mockup (landing page) |
| `apps/web/src/lib/mock-data.ts` | All mock data (articles, models, authors, tags) |
| `apps/web/src/app/globals.css` | Design tokens, `.prose` styles, `.tiptap` styles |

---

## Design Tokens (globals.css)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0a0a0a` | Page background |
| `--foreground` | `#f5f3ee` | Primary text |
| `--card` | `#121212` | Card surfaces |
| `--border` | `rgba(255,255,255,0.07)` | Borders |
| `--brand` | `#ff6b5c` | Signal coral accent (was indigo→olive→coral) |
| `--brand-hover` | `#e8513f` | Deep coral hover |
| `--brand-muted` | `rgba(255,107,92,0.14)` | Accent tint bg |
| `--cream` | `#fdf0d5` | Cream panel bg |
| `--cream-foreground` | `#4a1410` | Cream panel text (coral-brown) |
| `--font-fraunces` | CSS variable | Display/heading font |
| `--font-lora` | CSS variable | Prose/article body |
| `--font-geist-sans` | CSS variable | UI font |

---

## Related Notes

- [[API & Integrations]]
- [[Features]]
- [[Design & Style]]

---

*Tags: `#tech` `#architecture` `#stack` `#infrastructure`*
*Last updated: 2026-06-01*
