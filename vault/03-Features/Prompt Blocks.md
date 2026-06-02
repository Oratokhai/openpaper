# Prompt Blocks

> **Return to:** [[AI-Native Features]] | [[Features]] | [[Home]]

---

## Status: ✅Confirmed — Tier 1, Build at Launch

---

## What It Is

A first-class content block type specifically for AI prompts. Not a code block. Not plain text. A **prompt block** — designed from the ground up for how AI people write and share prompts.

---

## Why It Matters

Every AI writer uses prompts. When they publish on Substack, Medium, or dev.to, they paste prompts as code blocks or raw text — no structure, no context, no copy button, no variable highlighting. The platform doesn't understand what a prompt is.

On Openpaper, the platform knows. A reader sees a prompt block and immediately knows: *this was built for me.*

---

## Features of a Prompt Block

| Feature | Description |
|---|---|
| Formatted display | Clean, distinct visual treatment — not a generic code block |
| One-click copy | Copy the full prompt to clipboard instantly |
| Variable highlighting | `{{placeholders}}` highlighted in a distinct colour |
| Model context (optional) | Writer can tag which model(s) the prompt is written for |
| System / user split (optional) | Writer can separate system prompt from user prompt |
| Character / token count | Displayed for reference |
| Collapsible (optional) | Long prompts can be collapsed by default |

---

## Example Display

```
┌─ PROMPT ──────────────────────────────── [Copy] ─┐
│ Model: Claude Sonnet 4                            │
│                                                   │
│ You are a {{role}} helping a user with            │
│ {{task}}. Be concise and technical.               │
│                                                   │
│ User: {{user_input}}                              │
└───────────────────────────────────────── 12 tok ─┘
```

---

## Build Notes

- Implemented as a custom block type in the article editor (TipTap or Lexical)
- Stored as structured JSON in the article content model, not as raw text
- Rendered as a custom React component on the reader side
- Copy button uses the Clipboard API

---

## Related Notes

- [[Model Output Blocks]]
- [[Publishing Features]]
- [[Technical Architecture]]

---

*Tags: `#prompt-blocks` `#AI-native` `#editor` `#Tier-1`*
