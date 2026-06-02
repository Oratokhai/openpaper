import React from "react";
import { PromptBlock } from "./blocks/prompt-block";
import { ModelOutputBlock } from "./blocks/model-output-block";
import { ModelMention } from "./blocks/model-mention";
import { safeHref, safeImageSrc } from "@/lib/safe-url";

/* Renders a stored Tiptap/ProseMirror JSON document to React, including the
   custom AI-native nodes (prompt block, model output, model mention, footnote). */

type PMMark = { type: string; attrs?: Record<string, unknown> };
type PMNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: PMMark[];
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function nodeText(node: PMNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(nodeText).join("");
}

function applyMarks(text: React.ReactNode, marks: PMMark[] | undefined, key: string): React.ReactNode {
  if (!marks?.length) return text;
  return marks.reduce<React.ReactNode>((acc, mark, i) => {
    const k = `${key}m${i}`;
    switch (mark.type) {
      case "bold":
        return <strong key={k}>{acc}</strong>;
      case "italic":
        return <em key={k}>{acc}</em>;
      case "strike":
        return <s key={k}>{acc}</s>;
      case "code":
        return <code key={k}>{acc}</code>;
      case "link":
        return (
          <a key={k} href={safeHref(mark.attrs?.href)} target="_blank" rel="noopener noreferrer">
            {acc}
          </a>
        );
      default:
        return acc;
    }
  }, text);
}

function renderNode(node: PMNode, key: string, ctx: { footnotes: string[] }): React.ReactNode {
  const kids = (node.content ?? []).map((c, i) => renderNode(c, `${key}.${i}`, ctx));

  switch (node.type) {
    case "doc":
      return <React.Fragment key={key}>{kids}</React.Fragment>;
    case "paragraph":
      return <p key={key}>{kids}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const id = slugifyHeading(nodeText(node));
      return level === 3 ? <h3 key={key} id={id}>{kids}</h3> : <h2 key={key} id={id}>{kids}</h2>;
    }
    case "text":
      return <React.Fragment key={key}>{applyMarks(node.text, node.marks, key)}</React.Fragment>;
    case "bulletList":
      return <ul key={key}>{kids}</ul>;
    case "orderedList":
      return <ol key={key}>{kids}</ol>;
    case "listItem":
      return <li key={key}>{kids}</li>;
    case "blockquote":
      return <blockquote key={key}>{kids}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{nodeText(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = safeImageSrc(node.attrs?.src);
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={src} alt={String(node.attrs?.alt ?? "")} />
      );
    }
    case "promptBlock":
      return (
        <PromptBlock
          key={key}
          prompt={String(node.attrs?.prompt ?? "")}
          model={String(node.attrs?.model ?? "Claude Opus 4.8")}
        />
      );
    case "modelOutput":
      return (
        <ModelOutputBlock
          key={key}
          model={String(node.attrs?.model ?? "Claude")}
          date={node.attrs?.date ? String(node.attrs.date) : undefined}
        >
          <p>{String(node.attrs?.text ?? "")}</p>
        </ModelOutputBlock>
      );
    case "modelMention":
      return <ModelMention key={key} slug={String(node.attrs?.slug ?? "")} />;
    case "footnote": {
      const idx = ctx.footnotes.push(String(node.attrs?.text ?? ""));
      return (
        <sup key={key} className="text-[#6366f1] font-medium">
          [{idx}]
        </sup>
      );
    }
    case "inlineMath":
    case "blockMath":
    case "math":
      return (
        <code key={key} className="text-[#a78bfa]">
          {String(node.attrs?.latex ?? node.attrs?.value ?? "")}
        </code>
      );
    default:
      return kids.length ? <React.Fragment key={key}>{kids}</React.Fragment> : null;
  }
}

export function TiptapRenderer({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") return null;
  const ctx = { footnotes: [] as string[] };
  const body = renderNode(content as PMNode, "n", ctx);

  return (
    <>
      {body}
      {ctx.footnotes.length > 0 && (
        <div className="mt-12 pt-6 border-t border-white/[0.08] not-prose">
          <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Footnotes</p>
          <ol className="space-y-2">
            {ctx.footnotes.map((n, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-[#888] leading-relaxed">
                <span className="text-[#6366f1] font-medium shrink-0">[{i + 1}]</span>
                <span>{n}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

export function extractToc(content: unknown): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const walk = (node: PMNode) => {
    if (node.type === "heading") {
      const t = nodeText(node);
      if (t) out.push({ id: slugifyHeading(t), label: t });
    }
    (node.content ?? []).forEach(walk);
  };
  if (content && typeof content === "object") walk(content as PMNode);
  return out;
}
