# Model Mentions & Pages

> **Return to:** [[AI-Native Features]] | [[Features]] | [[Home]]

---

## Status: ✅ Confirmed — Tier 1, Build at Launch

---

## What It Is

Two connected features that together make AI models **first-class citizens** of the Openpaper platform:

1. **Model Mentions** — Type `@claude-sonnet-4` or `@gpt-4o` in an article and it becomes a live, rich link to that model's page.
2. **Model Pages** — Every major AI model has its own page on Openpaper, showing specs and every article that mentions it.

---

## Why It Matters

This is the single feature that makes Openpaper feel fundamentally AI-native — not just a publishing platform with AI features bolted on.

Paragraph.xyz made wallets and tokens first-class platform citizens. Openpaper makes *models* first-class platform citizens. When a writer mentions Claude or GPT-4o, Openpaper knows what that is. The platform understands the subject matter of its own content.

---

## Model Mentions

### How it works
- In the editor, type `@` followed by a model name → autocomplete suggestion appears
- Selecting inserts a model mention — displayed as a styled chip/tag
- On publish, the mention is indexed so the article appears on that model's page
- Clicking a model mention in an article navigates to the model's page

### Display
```
...we tested this prompt on @Claude Sonnet 4.6 and @GPT-4o...
                              ╰─ chip ──────╯     ╰─ chip ─╯
```

---

## Model Pages

### What a Model Page Shows

| Section | Content |
|---|---|
| Model name + logo | Company, model family, version |
| Specs | Context window, release date, modality (text/vision/audio) |
| Articles | All Openpaper articles that mention this model — sorted by date and trending |
| Following | Users can follow a model — get notified when new articles mention it |
| Sentiment trend | Rough positive/neutral/negative coverage trend over time |
| Version history | Links to pages for previous versions of the same model |
| Related models | Other models in the same family or category |

### Model Registry
A curated list of models maintained by Openpaper — not crowd-sourced. Covers:
- Anthropic: Claude family
- OpenAI: GPT family
- Google: Gemini family
- Meta: Llama family
- Mistral, Cohere, xAI, and others

New models added as they're released.

---

## Build Notes

- Model registry stored as a structured data source (JSON or DB table) — `id`, `name`, `company`, `version`, `release_date`, `context_window`, `modalities`, `slug`
- Mentions stored as structured nodes in article content JSON — not plain text
- Model pages are generated routes: `/models/claude-sonnet-4`
- Following a model uses the same follow infrastructure as following a user
- Sentiment trend is a simple calculation over article engagement signals — not NLP at MVP

---

## Related Notes

- [[Model Output Blocks]]
- [[AI Taxonomy]]
- [[Technical Architecture]]
- [[Features]]

---

*Tags: `#model-pages` `#model-mentions` `#AI-native` `#Tier-1`*
