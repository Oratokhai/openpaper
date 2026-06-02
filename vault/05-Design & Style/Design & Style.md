# Design & Style

> **Return to:** [[Home]]

---

## Design Direction

**Reference:** Paragraph.com — immersive, editorial, generous scale. Not Medium's utilitarian grid, not Substack's newsletter template.

**Principles:**
- Large, breathing elements — hero text at `text-7xl/8xl`, section headings at `text-5xl`, generous `py-36` section spacing
- Dark-first, warm not cold — `#0a0a0a` not pure black, `#f5f3ee` not pure white
- Forest/olive green accent as the single brand color — used sparingly for CTAs, active states, AI block labels. `#606c38` (olive) as the workhorse accent (legible as both fill and text on dark), `#283618` (deep green) for hover/depth, `#a3b18a` (sage) for light accent text/highlights
- Cream panels (`#fdf0d5`) for contrast sections (growth CTA)
- **Retired 2026-06-02:** indigo/violet/pink accent (`#6366f1`/`#8b5cf6`/`#a78bfa`/`#ec4899`) and old cream `#efeae0` — swapped wholesale to the green/cream earthy palette per user direction
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
| `--brand` | `#606c38` | Olive green accent (fill + text on dark) |
| `--brand-hover` | `#283618` | Deep green hover |
| `--brand-muted` | `rgba(96,108,56,0.14)` | Subtle accent tint bg |
| `--cream` | `#fdf0d5` | Warm cream panel |
| `--cream-foreground` | `#283618` | Cream text (deep green) |

**Sage (light accent):** `#a3b18a` — variable highlights, light accent text, banner radial glow.
**Default cover/banner gradient:** `from-[#283618] via-[#3a4d22] to-[#606c38]` (dark→olive; covers carry white overlay titles so cover gradients must stay dark, never end light). Earthy cover presets in `write/page.tsx` include a terracotta `#bc6c25` option from the same palette family.

**Gradient avatars:** `from-[#606c38] to-[#283618]` — all user avatars.
**Old tokens to avoid:** `#f0ede8`, `#0c0c0c`, retired indigo/violet `#6366f1`/`#8b5cf6`/`#ec4899`/`#a78bfa`, old cream `#efeae0`.

---

## Component Patterns

### Buttons
- Primary: `bg-[#606c38] text-white px-6 py-3 rounded-xl hover:bg-[#283618]`
- Secondary: `border border-white/[0.1] text-[#aaa] px-6 py-3 rounded-xl hover:border-white/[0.25]`
- Cream: `bg-[#1a1a1a] text-white px-7 py-3.5 rounded-xl` (on cream panels)

### Cards
- Standard: `rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all`
- Feed: `FeedCard` — `h-72` gradient cover, `text-3xl` Fraunces title

### AI-Native Blocks
All use: `rounded-xl bg-[#0a0a0a] border border-white/[0.08]`
- Label: `text-[10px] text-[#606c38] uppercase tracking-widest`
- Variable highlights: `text-[#a3b18a] bg-[#a3b18a]/10 px-1 rounded`

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

**Substack options we deliberately excluded:** Financial chart, Prediction market, Poetry, Recipe — not our audience.
**On roadmap:** Audio/Video embeds (Phase 2), Poll (social layer Phase 2).

---

## Related Notes

- [[Naming & Brand]]
- [[Technical Architecture]]
- [[AI-Native Features]]

---

*Tags: `#design` `#style` `#typography` `#tokens`*
*Last updated: 2026-06-02 — palette swap: indigo/violet → forest/olive green (`#283618`/`#606c38`/`#a3b18a`) + cream `#fdf0d5`*
