# Model Output Blocks

> **Return to:** [[AI-Native Features]] | [[Features]] | [[Home]]

---

## Status: ✅ Confirmed — Tier 1, Build at Launch

---

## What It Is

A structured content block for displaying an LLM's response. When AI writers share what a model said, they need more than pasted text — they need **provenance**: which model said this, which version, when.

---

## Why It Matters

AI content has a dating problem. A model output shared six months ago may look completely different from what the same model produces today — models are updated, fine-tuned, and replaced constantly. Without provenance, a reader can't trust or contextualise a model response.

A model output block gives the response structure and credibility. It also enables future features like output comparison and community testing.

---

## Features of a Model Output Block

| Feature | Description |
|---|---|
| Model name + version | E.g. "Claude Sonnet 4.6", "GPT-4o (May 2025)" |
| Response text | Formatted, readable, clearly demarcated from article prose |
| Date generated | When the writer generated this output |
| Linked prompt (optional) | Link back to the [[Prompt Blocks\|Prompt Block]] that generated it |
| Temperature / settings (optional) | For technical transparency |
| One-click copy | Copy the response text |
| Truncate long outputs | Collapsible with "show full response" |

---

## Example Display

```
┌─ MODEL OUTPUT ────────────────────────── [Copy] ─┐
│ Claude Sonnet 4.6  ·  Generated: May 28, 2026    │
│                                                   │
│ Here's a concise explanation of RAG:             │
│ Retrieval-Augmented Generation combines a        │
│ retrieval system with a language model...        │
│                                                   │
│ [Show full response ↓]                           │
└───────────────────────────────────────────────── ┘
```

---

## Build Notes

- Custom block type in the article editor, parallel to [[Prompt Blocks]]
- Model name/version stored as structured metadata (not free text — pulled from a model registry)
- Links to [[Model Mentions & Pages]] — the model name is a live @mention
- Stored as structured JSON in content model

---

## Related Notes

- [[Prompt Blocks]]
- [[Model Mentions & Pages]]
- [[Model Comparison Blocks]]
- [[Technical Architecture]]

---

*Tags: `#model-output` `#AI-native` `#editor` `#Tier-1`*
