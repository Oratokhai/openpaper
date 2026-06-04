# Design & Style

> **Return to:** [[Home]]

---

## Design Direction

**Reference:** Paragraph.com — immersive, editorial, generous scale. Not Medium's utilitarian grid, not Substack's newsletter template.

**Principles:**
- Large, breathing elements — hero text at `text-7xl/8xl`, section headings at `text-5xl`, generous `py-36` section spacing
- Dark-first, warm not cold — `#0a0a0a` not pure black, `#f5f3ee` not pure white
- Signal coral accent as the single brand color — used sparingly for CTAs, active states, AI block labels. `#ff6b5c` (coral) as the workhorse accent (legible as both fill and text on dark), `#e8513f` (deep coral) for hover/depth, `#ff9a8f` (light coral) for light accent text/highlights
- Cream panels (`#fdf0d5`) for contrast sections (growth CTA); cream text `--cream-foreground` `#4a1410` (deep coral-brown)
- **Retired 2026-06-03:** the forest/olive green accent (`#606c38`/`#283618`/`#3a4d22`/`#a3b18a`) — swapped wholesale to **signal coral** `#ff6b5c` per user direction (they liked a coral+paper writing-app reference; we kept the dark theme and took only the accent). Earlier retired 2026-06-02: indigo/violet/pink (`#6366f1`/`#8b5cf6`/`#a78bfa`/`#ec4899`), old cream `#efeae0`.
- Rounded generously — `rounded-2xl` cards, `rounded-3xl` panels, `rounded-xl` buttons

---

## Typography

| Role | Font | Config |
|---|---|---|
| Display / headings | **Fraunces** | Variable font: `axes: ["opsz", "SOFT", "WONK"]` — optical size adaptation |
| Article prose | **Lora** | Serif, Georgia fallback. Used in `.prose p`, `.tiptap > p` |
| UI / chrome | **Geist Sans** | Applied on `body` |
| Code | **Geist Mono** | Applied to `<code>`, `<pre>`, code blocks |

**Fraunces note:** Chosen over Instrument Serif (readability at smaller sizes). The SOFT and WONK axes give it distinctive editorial warmth at large headline sizes.

---

## Color Tokens (`apps/web/src/app/globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0a0a0a` | Page background |
| `--foreground` | `#f5f3ee` | Primary text |
| `--card` | `#121212` | Card surface |
| `--border` | `rgba(255,255,255,0.07)` | Subtle borders |
| `--muted-foreground` | `#888` | Secondary text |
| `--brand` | `#ff6b5c` | Signal coral accent (fill + text on dark) |
| `--brand-hover` | `#e8513f` | Deep coral hover |
| `--brand-muted` | `rgba(255,107,92,0.14)` | Subtle accent tint bg |
| `--cream` | `#fdf0d5` | Warm cream panel |
| `--cream-foreground` | `#4a1410` | Cream text (deep coral-brown) |

**Light coral (light accent):** `#ff9a8f` — variable highlights, light accent text, banner radial glow.
**Default cover/banner gradient:** `from-[#4a1410] via-[#9e3329] to-[#d8503f]` (dark→coral; keep the dark anchor so white overlay titles stay legible, never end light). Cover presets in `write/page.tsx` keep a terracotta `#bc6c25` option (harmonizes with coral). Profile banner: `from-[#ff6b5c] via-[#e8513f] to-[#3a0f0b]`.

**Gradient avatars:** `from-[#ff6b5c] to-[#c9443a]` — all user avatars.
**Old tokens to avoid:** `#f0ede8`, `#0c0c0c`, retired indigo/violet `#6366f1`/`#8b5cf6`/`#ec4899`/`#a78bfa`/`#818cf8`, old cream `#efeae0`, **retired olive `#606c38`/`#283618`/`#3a4d22`/`#a3b18a`**.
**Tailwind gotcha:** arbitrary cover-gradient classes (`from-[#…]`) only generate CSS when present in source — DB articles that stored an old olive gradient string render with no gradient until re-saved.

---

## Component Patterns

### Buttons
- Primary: `bg-[#ff6b5c] text-white px-6 py-3 rounded-xl hover:bg-[#e8513f]`
- Secondary: `border border-white/[0.1] text-[#aaa] px-6 py-3 rounded-xl hover:border-white/[0.25]`
- Cream: `bg-[#1a1a1a] text-white px-7 py-3.5 rounded-xl` (on cream panels)

### Cards
- Standard: `rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all`
- Feed: `FeedCard` — `h-72` gradient cover, `text-3xl` Fraunces title

### AI-Native Blocks
All use: `rounded-xl bg-[#0a0a0a] border border-white/[0.08]`
- Label: `text-[10px] text-[#ff6b5c] uppercase tracking-widest`
- Variable highlights: `text-[#ff9a8f] bg-[#ff9a8f]/10 px-1 rounded`

---

## Immersive Scale (site-wide upgrade)

Matched to Paragraph.com's scale after side-by-side comparison:

| Element | Value |
|---|---|
| Nav height | `h-20` |
| Section padding | `py-36 px-8` |
| Landing H1 | `text-7xl md:text-8xl` |
| Section H2 | `text-5xl` |
| Feature H3 | `text-2xl` |
| Body text | `text-[15px]` / `text-base` |
| Primary button | `px-7 py-3.5 rounded-xl` |

---

## Article Reader — 3-Zone Layout

Unique signature layout. Not found elsewhere:

```
[Reading progress bar — thin olive green, fixed top]
[Left dock]     [Center ~680px]          [Right rail]
  ♥ likes        Cover image              Table of Contents
  💬 comments    Freshness stamp          Models in this article
  🔖 save        Fraunces title           More from author
  ↗ share        Lora prose body
                 └ AI blocks inline
                 Author bio
                 Comments
```

---

## Profile Page — Builder's Page

- Gradient banner (`h-40 rounded-3xl`)
- Avatar overlaps banner (`-mt-12` row, `items-end` for correct alignment)
- Name + handle + GitHub + portfolio site below
- **Covers** section: derived `@model` chips + top topics from their articles
- Starred article (most-liked, hero card)
- About sidebar: bio, role, location, member since

---

## Editor Toolbar

Mirrors Substack's toolbar pattern (decided after analysing their options):
- Fixed: Undo/Redo · **Style▾** · Bold/Italic/Strike/Inline-code/Link · Image/Lists/Divider · **@Model▾** · **More▾**
- More▾: Prompt Block · Model Output · Code block · LaTeX · Footnote
- Preview: read-only render using same Tiptap instance

**Floating command bar (added 2026-06-03):** desktop-only bottom-center dark pill holding the *global* actions — Preview · Settings · | · **Publish** (coral) · ⋯(More → Studio/Drafts). Adapted from a coral+paper writing-app reference the user liked. The inline formatting toolbar above is unchanged. On mobile (`< md`) the old top-right action cluster stays (`md:hidden`) to avoid colliding with the bottom tab bar + Write FAB. Positioned `left-[calc(50%+38px)]` to center over the content area (clears the 76px rail). File: `app/(app)/write/page.tsx`.

**Substack options we deliberately excluded:** Financial chart, Prediction market, Poetry, Recipe — not our audience.
**On roadmap:** Audio/Video embeds (Phase 2), Poll (social layer Phase 2).

---

## Writer Studio — `/studio` (added 2026-06-03)

Writer's-desk home, adapted from the reference (kept dark, not the cream original):
- Greeting "Hey, {firstName}!" (name in coral) + Fraunces "What will you write today?" + coral "New article" CTA
- Filter pills (All / Articles / Tutorials / Benchmarks) — client-side filter over loaded lists
- **Recent Drafts** (thumbnail + title + edited-relative + type → `/write?edit=`) and **Published** (thumbnail + title + date + likes → `/{username}/{slug}`), each with "See all"
- Files: `app/(app)/studio/page.tsx` (server: `currentUser` + `listMyDrafts`/`listMyPublished` + `getUsernameById`), `components/studio/studio-board.tsx` (client). Entry points: sidebar rail `LayoutGrid` icon + account menu. Protected in `proxy.ts`. `/drafts` still exists (drafts-only list).

## Navigation — Dynamic Island rail (added 2026-06-03)

Desktop left rail reimagined as a **floating, morphing pill** (à la iPhone Dynamic Island). Built with **`motion`** (Framer Motion). Mobile bottom bar unchanged. File: `components/layout/sidebar-rail.tsx` + `components/layout/island-context.tsx`.
- **L1 expand-on-hover:** `<motion.aside layout>`; collapsed = icon column (~60px), hover springs to labelled nav (~244px). Labels are conditionally rendered (not opacity) so the pill truly collapses; spring `stiffness 400 / damping 32`.
- **L3 contextual morph:** pages push context via `useIsland()`; collapsed face becomes **writing** (live word count + saved dot) on `/write`, or **reading** (progress ring) on a reader page. Hover always restores full nav.
- **L2 live activities:** `pushActivity()` shows a transient peek (auto-clears ~2.4s) — e.g. "Draft saved ✓". Real-time notification peeks deferred (notifications aren't realtime).
- **Gotchas:** center via an outer flex wrapper, never a `transform` on the animated pill (fights `layout`); the `(app)` layout wraps children in `<IslandProvider>` so rail + pages share state.
- **One public nav for all signed-out pages (2026-06-04):** the left rail / app shell is **signed-in only**. **`PublicTopNav`** (`components/layout/public-top-nav.tsx`) is the single shared public nav — a horizontal floating **pill** at top (same Island language) with `Explore · Models · Docs`, coral active state (`usePathname`), Sign in + Start writing, and the existing `LandingMobileMenu` on phones. It's now used by **all four public surfaces**: the landing page (`app/page.tsx`), `/docs` (`app/docs/page.tsx`), and the public `(app)` pages `/explore` + `/models` (+ reader/profile) via `(app)/layout` branching on `syncCurrentUser()` (no `userId` → render the pill instead of the rail; `pb-16`, no left-rail offset). The bespoke landing header and the `Openpaper / Docs` breadcrumb header were both deleted. Landing redirects signed-in users to `/home`, so the pill's Sign in / Start writing are always correct there. **Change the nav once, here — it updates everywhere.**

## Responsive / Mobile (pass shipped 2026-06-02)

Web-first, but the site is now phone-usable (verified at 390px, no horizontal overflow). Conventions:
- **Breakpoint for the shell:** `md` (768px). Below `md` = mobile chrome, `md+` = desktop chrome.
- **Navigation:** `SidebarRail` renders the left icon rail `hidden md:flex`, **and** a `md:hidden` fixed bottom tab bar + floating Write FAB. Don't add a third nav — extend these.
- **Content offset:** `(app)/layout` = `md:pl-[76px]` (clears rail) + `pb-[calc(env(safe-area-inset-bottom)+56px)] md:pb-0` (clears bottom bar). Honor iOS safe-area insets on fixed bottom UI.
- **Headings:** scale down on mobile — display `text-6xl sm:text-7xl md:text-8xl`, sections `text-4xl sm:text-5xl`. Never ship a fixed `text-5xl`+ heading without a smaller mobile step.
- **Section padding:** `py-20 md:py-36`, `px-5 sm:px-8`.
- **Drawers/side panels:** `w-full sm:w-[Npx]` so they don't clip on narrow phones.
- **Rows with meta + actions** (byline, profile header): stack `flex-col sm:flex-row` so buttons don't collide with text.
- **Covers** keep white overlay titles → cover gradients must stay dark (see cover note above).

## Related Notes

- [[Naming & Brand]]
- [[Technical Architecture]]
- [[AI-Native Features]]

---

*Tags: `#design` `#style` `#typography` `#tokens`*
*Last updated: 2026-06-03 — palette swap: olive/forest green → **signal coral** (`#ff6b5c`/`#e8513f`/`#ff9a8f`); added floating editor command bar + `/studio` writer workspace*
