# AI-Native Features

> **Return to:** [[Features]] | [[Home]]

---

## Status: Designed + Mocked in UI ✅ | Editor integration ✅ | Backend: not started

These are the features that make Openpaper not just another Substack or Medium — the reason an AI developer or researcher would choose it specifically.

---

## 1. Prompt Blocks ✅

**What:** First-class prompt content in articles. Not pasted as raw text.

**Features:**
- `{{variable}}` placeholder highlighting (purple chip styling)
- One-click copy to clipboard
- Model badge (which model the prompt targets)
- Token count estimate (~chars / 4)

**Files:**
- Reader: `src/components/article/blocks/prompt-block.tsx`
- Editor node: `src/components/editor/extensions/prompt-block-node.tsx`
- Insert via: More▾ in editor toolbar

---

## 2. Model Output Blocks ✅

**What:** LLM responses with provenance — not pasted text, but dated and attributed.

**Features:**
- Model name + date generated
- Collapsible in reader ("Show full response")
- Editable model/date in editor

**Files:**
- Reader: `src/components/article/blocks/model-output-block.tsx`
- Editor node: `src/components/editor/extensions/model-output-node.tsx`

---

## 3. Model Mentions & Pages ✅

**What:** `@model-slug` inline chips linking to that model's dedicated page.

**Features:**
- Insert via @Model picker in toolbar
- Purple chip rendering: `text-[#a78bfa] bg-[#a78bfa]/10`
- Links to `/models/{slug}`
- 55 real models across 16 labs in the directory
- "Follow a model" (UI done, backend pending)

**Files:**
- Reader chip: `src/components/article/blocks/model-mention.tsx`
- Editor node: `src/components/editor/extensions/model-mention-node.tsx`
- Model data: `src/lib/mock-data.ts` → `mockModels`
- Model pages: `src/app/(app)/models/[slug]/page.tsx`

---

## 4. AI Taxonomy ✅

**What:** Curated AI-specific tag system.

**Tags:** Models & Research · Prompt Engineering · RAG & Memory · Agents & Automation · Fine-tuning & Training · LLM Apps · Infrastructure · Multimodal · AI Ethics · Industry & Business · Tools & Platforms · Tutorials & Guides

**Used in:** FeedCard badges, article reader, Explore topic tiles, Profile "Covers" section

---

## 5. Freshness Stamps ✅

**What:** Shows how current an article's content is. Critical because AI writing has a shelf life.

**States:**
- ✅ Current — verified recently
- 🟡 May be outdated — not reviewed in a while
- 🔴 Outdated — explicitly stale

**Files:**
- Component: `src/components/article/blocks/freshness-stamp.tsx`
- Data field: `freshness: { status, verified }` on `MockArticle`
- Shown in: article reader header, Explore featured hero
- Editor setting: planned (Settings panel not yet built)

---

## 6. Footnotes ✅ (Editor)

Numbered references, auto-renumbering, collected at article bottom. Research-audience feature — for citing papers, models, benchmarks.

**File:** `src/components/editor/extensions/footnote-node.tsx`

---

## 7. LaTeX / Math ✅ (Editor)

KaTeX rendering. For ML math: attention mechanisms, loss functions, scaling laws.

**Packages:** `@tiptap/extension-mathematics` + `katex`
**Insert via:** More▾ → LaTeX

---

## 8. Syntax-Highlighted Code Blocks ✅ (Editor)

Lowlight (highlight.js grammars) with dark token colors.

**Packages:** `@tiptap/extension-code-block-lowlight` + `lowlight`
**Colors:** `.tiptap > pre .hljs-*` in `globals.css`

---

## Planned

| Feature | Phase | Notes |
|---|---|---|
| Editor Settings panel | Phase 1 remaining | Freshness status + per-post email toggle |
| Follow topics/models | Phase 2 | UI exists, no persistence |
| Model comparison blocks | Phase 2 | Side-by-side outputs |
| Freshness change alerts | Phase 2 | Notify saved-article readers |
| Audio/video embeds | Phase 2 | After social layer |
| Polls | Phase 2 | With social layer |

---

## Related Notes

- [[Prompt Blocks]]
- [[Model Output Blocks]]
- [[Model Mentions & Pages]]
- [[Article Freshness Stamps]]
- [[AI Taxonomy]]

---

*Tags: `#features` `#AI-native` `#differentiators`*
*Last updated: 2026-06-01*
