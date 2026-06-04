# Soft Launch

> **Return to:** [[Home]] · Related: [[Business & Monetization]] · [[Roadmap]] · [[Audience & Personas]] · [[Launch Posts]]

**Status:** Planned 2026-06-03 · ⬜ Not started
**Goal:** ~20 real users + structured feedback. Not numbers, not a public moment yet.

---

## Strategy in one line

Writer-first soft launch — hand-pick ~20 people from the network, seed content first, get a
few publishing, collect feedback, then use that to trigger the public hard launch.

**Decisions:** ~20 users / small engaged network / soft-first / promote on current dev setup.

---

## Pre-launch checklist (minimum, not hardening)

- [ ] **Verify a Resend domain** + set `EMAIL_FROM` — only hard requirement (else Subscribe
      silently fails — emails only reach own inbox on the free tier). Fallback: label Subscribe
      "Newsletter — coming soon."
- [ ] Set `NEXT_PUBLIC_APP_URL` to the promotion URL (share + email links).
- [ ] Seed 3–5 strong posts (one each: Article / Tutorial / Benchmark) using AI-native blocks.
- [ ] Logged-out sanity pass: Explore / Home / a model page / a seed article all show real
      content, no empty states.
- Knowingly skipped for now: custom domain, prod Clerk, Vercel Blob (images may not persist).

---

## The list

20–30 people, biased toward those who **write/build in AI** and could publish (not just lurk).

| Tier | ~Count | The ask |
|---|---|---|
| Seed writers | 5–8 | Publish one post (offer to help port an existing piece) — they are the flywheel |
| First readers | ~15 | Read a couple of posts, follow a writer, leave a comment, tell me what felt off |

Stagger outreach over a few days so breakage gets fixed before the next batch.

---

## Outreach message templates

**Seed writer (personal DM/email):**

> Hey [name] — I built Openpaper, a publishing platform made specifically for AI builders.
> The thing that makes it different: you can drop real **prompt blocks, model-output blocks,
> and model mentions** right into a post — so writing about what you built with a model
> actually looks native, not like a screenshot.
>
> I'm opening it to a small first group and I'd love for you to be one of the first writers.
> Would you publish one post? Happy to help port something you've already written.
> Here it is: [URL]. And tell me anything that feels off — that's half the reason I'm asking.

**First reader (personal DM/email):**

> Hey [name] — just opened up Openpaper, a home for AI writing (built for builders, not a
> generic blog host). Would you take 5 min to read a couple of posts and tell me your honest
> first impression? [URL] — feedback link's right here: [form]. No pressure to share publicly yet.

---

## Feedback (the actual point)

One channel — short form (Tally/Google Form) or a dedicated DM thread. 4–5 questions:
1. First impression in one line?
2. What confused you / where did you get stuck?
3. (Writers) Did you publish? If not, what stopped you?
4. Would you come back? Why / why not?
5. What's the one thing missing?

**Silent signals to watch:** unprompted publishes, return visits, drop-off point in the
publish flow. Log findings here as they arrive.

---

## Trigger → hard launch

Go public only once: **≥3 unprompted publishes · no critical loop breakage · signs of return
visits.** Then production hardening (custom domain · prod Clerk + own OAuth · Vercel Blob ·
Resend verified at volume), then the public push (X/LinkedIn · Show HN · subreddits ·
Product Hunt). Wedge = **AI-native blocks**.

---

*Tags: `#launch` `#GTM` `#soft-launch`*
*Created: 2026-06-03*
