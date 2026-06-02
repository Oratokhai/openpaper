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
  Img,
  Hr,
  Button,
} from "@react-email/components";
import { mockModels } from "@/lib/mock-data";
import { safeHref, safeImageSrc } from "@/lib/safe-url";

/* ── palette (dark, matches brand) ─────────────────────────────────────────── */
const C = {
  bg: "#0a0a0a",
  panel: "#141414",
  border: "#262626",
  text: "#dcd9d2",
  heading: "#f5f3ee",
  muted: "#8a8a8a",
  accent: "#606c38",
  accentSoft: "#a3b18a",
};

type PMMark = { type: string; attrs?: Record<string, unknown> };
type PMNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: PMMark[];
};

function applyMarks(text: React.ReactNode, marks: PMMark[] | undefined, key: string): React.ReactNode {
  if (!marks?.length) return text;
  return marks.reduce<React.ReactNode>((acc, m, i) => {
    const k = `${key}m${i}`;
    switch (m.type) {
      case "bold":
        return <strong key={k}>{acc}</strong>;
      case "italic":
        return <em key={k}>{acc}</em>;
      case "strike":
        return <s key={k}>{acc}</s>;
      case "code":
        return (
          <code key={k} style={{ background: C.panel, color: C.accentSoft, padding: "1px 5px", borderRadius: 4, fontFamily: "monospace", fontSize: 14 }}>
            {acc}
          </code>
        );
      case "link":
        return (
          <Link key={k} href={safeHref(m.attrs?.href)} style={{ color: C.accent, textDecoration: "underline" }}>
            {acc}
          </Link>
        );
      default:
        return acc;
    }
  }, text);
}

function nodeText(n: PMNode): string {
  if (n.text) return n.text;
  return (n.content ?? []).map(nodeText).join("");
}

const pStyle: React.CSSProperties = { color: C.text, fontSize: 16, lineHeight: "1.7", margin: "0 0 18px", fontFamily: "Georgia, 'Times New Roman', serif" };

function renderNode(node: PMNode, key: string, ctx: { footnotes: string[] }): React.ReactNode {
  const kids = (node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`, ctx));

  switch (node.type) {
    case "doc":
      return <React.Fragment key={key}>{kids}</React.Fragment>;
    case "paragraph":
      return <p key={key} style={pStyle}>{kids}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      return (
        <Heading
          key={key}
          as={level === 3 ? "h3" : "h2"}
          style={{ color: C.heading, fontSize: level === 3 ? 19 : 24, margin: "28px 0 12px", fontFamily: "Georgia, serif" }}
        >
          {kids}
        </Heading>
      );
    }
    case "text":
      return <React.Fragment key={key}>{applyMarks(node.text, node.marks, key)}</React.Fragment>;
    case "bulletList":
      return <ul key={key} style={{ ...pStyle, paddingLeft: 22 }}>{kids}</ul>;
    case "orderedList":
      return <ol key={key} style={{ ...pStyle, paddingLeft: 22 }}>{kids}</ol>;
    case "listItem":
      return <li key={key} style={{ marginBottom: 6 }}>{kids}</li>;
    case "blockquote":
      return (
        <blockquote key={key} style={{ borderLeft: `3px solid ${C.accent}`, margin: "0 0 18px", padding: "4px 0 4px 16px", color: C.muted, fontStyle: "italic" }}>
          {kids}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, overflowX: "auto", margin: "0 0 18px" }}>
          <code style={{ color: C.text, fontFamily: "monospace", fontSize: 13, lineHeight: "1.6" }}>{nodeText(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <Hr key={key} style={{ borderColor: C.border, margin: "28px 0" }} />;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = safeImageSrc(node.attrs?.src);
      if (!src) return null;
      return <Img key={key} src={src} alt={String(node.attrs?.alt ?? "")} style={{ maxWidth: "100%", borderRadius: 8, margin: "0 0 18px" }} />;
    }
    case "promptBlock":
      return (
        <div key={key} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, margin: "0 0 18px" }}>
          <Text style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>
            Prompt · {String(node.attrs?.model ?? "")}
          </Text>
          <Text style={{ color: C.text, fontFamily: "monospace", fontSize: 13, lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
            {String(node.attrs?.prompt ?? "")}
          </Text>
        </div>
      );
    case "modelOutput":
      return (
        <div key={key} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, margin: "0 0 18px" }}>
          <Text style={{ color: C.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>
            Model Output · {String(node.attrs?.model ?? "")}
          </Text>
          <Text style={{ color: C.text, fontSize: 14, lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
            {String(node.attrs?.text ?? "")}
          </Text>
        </div>
      );
    case "modelMention": {
      const slug = String(node.attrs?.slug ?? "");
      if (!slug) return null;
      const model = mockModels.find((m) => m.slug === slug);
      return (
        <span key={key} style={{ color: C.accentSoft, fontWeight: 600 }}>
          @{model ? model.name : slug}
        </span>
      );
    }
    case "footnote": {
      const idx = ctx.footnotes.push(String(node.attrs?.text ?? ""));
      return <sup key={key} style={{ color: C.accent, fontWeight: 600 }}>[{idx}]</sup>;
    }
    case "inlineMath":
    case "blockMath":
    case "math":
      return <code key={key} style={{ color: C.accentSoft, fontFamily: "monospace" }}>{String(node.attrs?.latex ?? node.attrs?.value ?? "")}</code>;
    default:
      return kids.length ? <React.Fragment key={key}>{kids}</React.Fragment> : null;
  }
}

function coverStyle(cover: string): React.CSSProperties {
  const hexes = cover.match(/#[0-9a-fA-F]{6}/g) ?? ["#606c38", "#283618"];
  return {
    height: 10,
    borderRadius: 6,
    backgroundColor: hexes[0],
    backgroundImage: `linear-gradient(90deg, ${hexes.join(", ")})`,
    margin: "0 0 28px",
  };
}

export type ArticleEmailProps = {
  title: string;
  subtitle: string | null;
  authorName: string;
  readingTime: string;
  cover: string;
  url: string;
  content: unknown;
};

export function ArticleEmail({ title, subtitle, authorName, readingTime, cover, url, content }: ArticleEmailProps) {
  const ctx = { footnotes: [] as string[] };
  const body = content && typeof content === "object" ? renderNode(content as PMNode, "n", ctx) : null;

  return (
    <Html>
      <Head />
      <Preview>{subtitle || title}</Preview>
      <Body style={{ backgroundColor: C.bg, margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
          <Text style={{ color: C.accent, fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: "0 0 20px" }}>
            ❦ OPENPAPER
          </Text>

          <div style={coverStyle(cover)} />

          <Heading as="h1" style={{ color: C.heading, fontSize: 32, lineHeight: "1.15", margin: "0 0 12px", fontFamily: "Georgia, serif" }}>
            {title}
          </Heading>
          {subtitle && (
            <Text style={{ color: C.muted, fontSize: 18, lineHeight: "1.5", margin: "0 0 16px", fontFamily: "Georgia, serif" }}>{subtitle}</Text>
          )}
          <Text style={{ color: C.muted, fontSize: 14, margin: "0 0 24px" }}>
            {authorName} · {readingTime}
          </Text>

          <Button href={url} style={{ background: C.accent, color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 10, textDecoration: "none" }}>
            Read on Openpaper →
          </Button>

          <Hr style={{ borderColor: C.border, margin: "28px 0" }} />

          {body}

          {ctx.footnotes.length > 0 && (
            <>
              <Hr style={{ borderColor: C.border, margin: "28px 0" }} />
              <Text style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>Footnotes</Text>
              {ctx.footnotes.map((f, i) => (
                <Text key={i} style={{ color: C.muted, fontSize: 13, lineHeight: "1.5", margin: "0 0 6px" }}>
                  <span style={{ color: C.accent }}>[{i + 1}]</span> {f}
                </Text>
              ))}
            </>
          )}

          <Hr style={{ borderColor: C.border, margin: "32px 0 16px" }} />
          <Text style={{ color: C.muted, fontSize: 12, lineHeight: "1.5", margin: 0 }}>
            You&apos;re receiving this because you subscribed to {authorName} on Openpaper.{" "}
            <Link href={url} style={{ color: C.accent }}>View online</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ArticleEmail;
