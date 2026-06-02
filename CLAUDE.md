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

- **Never use old tokens:** `#f0ede8`, `#0c0c0c`, `from-[#e8d5b0] to-[#c4a882]`, and the retired indigo/violet accent `#6366f1`/`#8b5cf6`/`#ec4899` — use `#f5f3ee` (text), `#0a0a0a` (bg)
- **Accent is forest/olive green:** `--brand` `#606c38` (olive, legible as fill + text on dark), `--brand-hover`/deep `#283618`, light accent/sage `#a3b18a`. Cream panel `--cream` `#fdf0d5`.
- **Default cover/banner gradient:** `from-[#283618] via-[#3a4d22] to-[#606c38]` (covers carry white overlay titles — keep cover gradients dark→olive, never end light). Avatars: `from-[#606c38] to-[#283618]`.
- **Headings:** always `style={{ fontFamily: "var(--font-fraunces)" }}` — never `font-serif` class for display headings
- **Immersive scale:** section padding `py-36 px-8`, H1 `text-7xl md:text-8xl`, H2 `text-5xl`, body `text-[15px]`
- **`.prose` and `.tiptap` selectors** are scoped to direct children (`>`) — do not change this or AI-native block styles will bleed

## AI-native blocks

All reusable. Use them, don't reinvent them:
- `src/components/article/blocks/prompt-block.tsx`
- `src/components/article/blocks/model-output-block.tsx`
- `src/components/article/blocks/model-mention.tsx`
- `src/components/article/blocks/freshness-stamp.tsx`

## Known tech debt

- `src/components/article/article-card.tsx` — still uses old tokens (`#f0ede8`, cream avatar gradient). Mark for cleanup.
