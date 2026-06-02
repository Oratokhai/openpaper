# Article Freshness Stamps

> **Return to:** [[AI-Native Features]] | [[Features]] | [[Home]]

---

## Status: 🔵 Tier 2 — Build in Beta

---

## What It Is

A system that shows readers when an article was last reviewed, and what model versions or tools it references — because AI content has a shelf life problem that generic platforms ignore entirely.

---

## Why It Matters

An article titled "Best way to use Claude for coding" written 8 months ago may reference a model that's been superseded twice. Readers can't trust it without knowing its temporal context. Writers have no way to signal "I just reviewed this and it's still accurate."

This is unique to the AI space — no other publishing community has this problem at this scale.

---

## Features

| Feature | Description |
|---|---|
| Last reviewed date | Writer manually marks when they last verified accuracy |
| Model version references | Structured list of models/tools the article covers |
| Freshness indicator | Visual signal — "Current", "May be outdated", "Outdated" |
| Auto-flag | Articles referencing models more than 6 months old get a soft flag |
| Reader prompt | "Has this changed? Suggest an update" — links to comment thread |
| Update log | Writer can append update notes without rewriting the article |

---

## Freshness States

| State | Meaning |
|---|---|
| ✅ Current | Writer reviewed within 90 days |
| 🟡 May be outdated | Not reviewed in 90–180 days, or references old model versions |
| 🔴 Outdated | Not reviewed in 180+ days |
| 📌 Evergreen | Writer marks as not time-sensitive |

---

## Related Notes

- [[Model Mentions & Pages]]
- [[Publishing Features]]
- [[Content Strategy]]

---

*Tags: `#freshness` `#AI-native` `#Tier-2` `#trust`*
