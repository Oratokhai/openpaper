# Openpaper — Project Instructions

## Vault

The Obsidian vault at `vault/` is the second brain for this project. Follow the Second Brain Protocol in the global CLAUDE.md — read first, write back at every session end.

**Entry point:** `vault/00-Index/Home.md`
**Key notes to read at session start:**
- `vault/09-Roadmap/Roadmap.md` — what's done, what's next
- `vault/06-Technical Architecture/Technical Architecture.md` — stack, file paths, gotchas
- `vault/05-Design & Style/Design & Style.md` — tokens, patterns, component rules

---

## Stack

- **Next.js 16** (App Router) — `params` are Promises, always `await params` in dynamic routes
- **Tailwind CSS v4** — `@theme inline` tokens, no `tailwind.config.js`
- **TypeScript** — strict
- **Tiptap v3** — editor; custom AI-native nodes in `src/components/editor/extensions/`
- **Lucide React v1.17** — brand icons removed (Github etc.), use inline SVG

## Dev server

```
cd apps/web && npm run dev   # runs on http://localhost:3001
```

## Design rules

- **Never use old tokens:** `#f0ede8`, `#0c0c0c`, `from-[#e8d5b0] to-[#c4a882]`, the retired indigo/violet accent `#6366f1`/`#8b5cf6`/`#ec4899`/`#818cf8`, **and the now-retired olive/forest accent `#606c38`/`#283618`/`#3a4d22`/`#a3b18a`** (swapped to coral 2026-06-03) — use `#f5f3ee` (text), `#0a0a0a` (bg)
- **Accent is signal coral:** `--brand` `#ff6b5c` (legible as fill + text on dark), `--brand-hover`/deep `#e8513f`, light accent `#ff9a8f`, muted tint `rgba(255,107,92,0.14)`. Cream panel `--cream` `#fdf0d5`, `--cream-foreground` `#4a1410`.
- **Default cover/banner gradient:** `from-[#4a1410] via-[#9e3329] to-[#d8503f]` (covers carry white overlay titles — keep cover gradients dark→coral, anchor dark, never end light). Avatars: `from-[#ff6b5c] to-[#c9443a]`. Banner: `from-[#ff6b5c] via-[#e8513f] to-[#3a0f0b]`.
- **Tailwind gotcha:** cover gradients are arbitrary-value classes (`from-[#…]`). A class only gets CSS if it appears in source — articles in the DB that stored an *old* olive gradient string will render with no gradient until re-saved.
- **Headings:** always `style={{ fontFamily: "var(--font-fraunces)" }}` — never `font-serif` class for display headings
- **Immersive scale:** section padding `py-36 px-8`, H1 `text-7xl md:text-8xl`, H2 `text-5xl`, body `text-[15px]`
- **`.prose` and `.tiptap` selectors** are scoped to direct children (`>`) — do not change this or AI-native block styles will bleed

## AI-native blocks

All reusable. Use them, don't reinvent them:
- `src/components/article/blocks/prompt-block.tsx`
- `src/components/article/blocks/model-output-block.tsx`
- `src/components/article/blocks/model-mention.tsx`
- `src/components/article/blocks/freshness-stamp.tsx`

## Navigation — Dynamic Island rail (desktop)

The desktop left rail is a **floating, morphing pill** (`src/components/layout/sidebar-rail.tsx`), built with **`motion`** (Framer Motion, added 2026-06-03). Mobile bottom tab bar is unchanged.
- **L1 — expand on hover:** collapsed icon pill springs wide and reveals labels. Uses `<motion.aside layout>` so size morphs from content; labels are **conditionally rendered** (`{expanded && …}`), *not* opacity-faded — otherwise hidden labels keep their width and the pill never collapses.
- **Centering:** an outer non-animated wrapper (`fixed left-3 top-0 bottom-0 flex items-center`) centers it. **Do not** put a CSS `transform` (e.g. `-translate-y-1/2`) on the `motion.aside` — `layout` drives transforms and they'll fight.
- **L3 — contextual morph:** pages push context via `useIsland()` (`src/components/layout/island-context.tsx`, provider wraps the `(app)` layout). Collapsed face becomes `writing` (live word count + saved dot, from `write/page.tsx`) or `reading` (progress ring, from `reading-progress.tsx`). Hover always reveals full nav.
- **L2 — live activities:** `pushActivity({icon,label,tone})` shows a transient peek (auto-clears ~2.4s), e.g. "Draft saved ✓" on save. Real-time notification peeks are a later upgrade (notifications aren't realtime yet).
- **Signed-in only:** the rail (and the whole app shell) renders only when logged in. `(app)/layout` branches on `syncCurrentUser()` — when there's no `userId` it renders `PublicTopNav` (`src/components/layout/public-top-nav.tsx`), a top floating **pill** (Explore · Models · Docs + Sign in / Start writing), so logged-out visitors on public app pages (`/explore`, `/models`, reader, profile) never see the "logged-in" rail. Keep its links in sync with the landing header.

## Writer surfaces

- **`/studio`** (`src/app/(app)/studio/page.tsx`) — writer's-desk home: "What will you write today?", type filter pills, Recent Drafts + Published. Client board: `src/components/studio/studio-board.tsx`. Data: `listMyDrafts` / `listMyPublished` in `write/actions.ts`. Linked from the sidebar rail (`LayoutGrid`) + account menu.
- **Editor floating command bar** (`src/app/(app)/write/page.tsx`) — desktop-only bottom-center pill (Preview · Settings · Publish · More). Top-right cluster is now `md:hidden` (mobile keeps it). Inline formatting toolbar (`rich-editor.tsx`) is unchanged.

## Known tech debt

- `src/components/article/article-card.tsx` — still uses old tokens (`#f0ede8`, cream/gold avatar gradient `#e8d5b0`, stray indigo `#818cf8`). Not part of the coral palette family — mark for cleanup.
