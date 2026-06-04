# First-Publish Celebration & Share Nudges

> **Return to:** [[Home]] · [[Roadmap]] · related: [[Social Features]]
> **Status:** ✅ Shipped 2026-06-04

The gap: a writer (e.g. eyitemi) publishes their first article and gets **nothing** — no congrats, no email, no nudge to share. This closes the loop with a celebration moment + share-to-publicize prompts.

## What ships

1. **Always-on share nudge** — every publish-success state now shows **Share on X** + **Share on LinkedIn** (web intent URLs) alongside Copy link / View article. The "publicize it" prompt the platform was missing.
2. **First-article milestone** — when it's the author's *first-ever* published article:
   - 🎉 confetti burst + celebratory copy ("It's live 🎉 / Your first article") in the publish drawer success state.
   - One-time **congrats email** to the author (delivers on Resend free tier — recipient is the author, no verified domain needed).
   - Share text is pre-filled ("I just published my first piece on Openpaper: …").

## Implementation (file paths)

- **Detection:** `apps/web/src/app/(app)/write/actions.ts` — `isAuthorsFirstPublished(authorId)` (count of `status='published'` articles === 1). Runs in both create + update-goes-live paths. `PublishResult` now carries `firstPublish?: boolean`.
- **Email:** `src/lib/email.tsx` → `sendFirstPublishCongrats(articleId)`; template `src/emails/first-publish-email.tsx` (dark/coral, View + X/LinkedIn buttons). No-ops without `RESEND_API_KEY`; never throws.
- **UI:** `src/app/(app)/write/page.tsx` → `PublishedState` rebuilt; inline `XIcon`/`LinkedInIcon` SVGs (lucide brand icons removed), self-contained CSS `Confetti` (no new dep, coral/cream palette).

## Gotchas / known edges

- Self-edge: publish → delete → publish again re-counts to 1 and re-fires congrats. Acceptable at soft-launch scale.
- No persistent in-app **notification** for the milestone yet — the `notifications` table is actor-based and skips self-actions, so a system→author milestone would need an enum + nullable-actor migration. Deferred; email + the celebration moment cover the ask. ⬜ revisit if we want it in the bell feed.
- Congrats email needs `RESEND_API_KEY` set to actually deliver (same dependency as subscriber email).
