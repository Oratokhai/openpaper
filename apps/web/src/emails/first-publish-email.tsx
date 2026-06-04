import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Button,
  Hr,
} from "@react-email/components";
import { safeHref } from "@/lib/safe-url";

/* ── palette (dark, matches brand) ─────────────────────────────────────────── */
const C = {
  bg: "#0a0a0a",
  panel: "#141414",
  border: "#262626",
  text: "#dcd9d2",
  heading: "#f5f3ee",
  muted: "#8a8a8a",
  accent: "#ff6b5c",
  accentSoft: "#ff9a8f",
};

/**
 * One-time congratulations email sent to a writer when their very first article
 * goes live on Openpaper. Nudges them to share it.
 */
export function FirstPublishEmail({
  authorName,
  title,
  url,
}: {
  authorName: string | null;
  title: string;
  url: string;
}) {
  const firstName = (authorName ?? "").trim().split(/\s+/)[0] || "there";
  const shareText = `I just published my first piece on Openpaper: "${title}"`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <Html>
      <Head />
      <Preview>Your first article is live on Openpaper 🎉</Preview>
      <Body style={{ background: C.bg, margin: 0, padding: "32px 0", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <Container style={{ maxWidth: 520, margin: "0 auto", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 36px" }}>
          <Text style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: C.accent, margin: "0 0 16px" }}>
            🎉 You did it
          </Text>

          <Heading as="h1" style={{ fontSize: 28, lineHeight: "34px", color: C.heading, margin: "0 0 16px", fontWeight: 600 }}>
            Your first article is live, {firstName}.
          </Heading>

          <Text style={{ fontSize: 15, lineHeight: "24px", color: C.text, margin: "0 0 8px" }}>
            “{title}” is now published on Openpaper. That blank page is behind you — this is the start of your body of work.
          </Text>

          <Text style={{ fontSize: 15, lineHeight: "24px", color: C.text, margin: "0 0 28px" }}>
            The fastest way to find your first readers is to share it where your people already are.
          </Text>

          <Button
            href={safeHref(url)}
            style={{ display: "block", textAlign: "center", background: C.accent, color: "#ffffff", fontSize: 15, fontWeight: 600, padding: "13px 20px", borderRadius: 10, textDecoration: "none", marginBottom: 12 }}
          >
            View your article
          </Button>

          <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 8 }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: 6, width: "50%" }}>
                  <Link href={xUrl} style={{ display: "block", textAlign: "center", border: `1px solid ${C.border}`, color: C.text, fontSize: 14, padding: "11px", borderRadius: 10, textDecoration: "none" }}>
                    Share on X
                  </Link>
                </td>
                <td style={{ paddingLeft: 6, width: "50%" }}>
                  <Link href={liUrl} style={{ display: "block", textAlign: "center", border: `1px solid ${C.border}`, color: C.text, fontSize: 14, padding: "11px", borderRadius: 10, textDecoration: "none" }}>
                    Share on LinkedIn
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>

          <Hr style={{ borderColor: C.border, margin: "28px 0 16px" }} />

          <Text style={{ fontSize: 13, lineHeight: "20px", color: C.muted, margin: 0 }}>
            Keep going — writers who publish a second piece within a week are the ones readers come back for. We can’t wait to read what’s next.
          </Text>
          <Text style={{ fontSize: 13, color: C.muted, margin: "16px 0 0" }}>
            — The Openpaper team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
