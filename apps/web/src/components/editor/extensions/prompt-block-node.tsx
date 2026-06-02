import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { AutoTextarea } from "../auto-textarea";
import { estimateTokens } from "../blocks";

/** Tiptap node: an editable Prompt Block. Content lives in node attributes. */
export const PromptBlockNode = Node.create({
  name: "promptBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      prompt: { default: "" },
      model: { default: "Claude Opus 4.8" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="prompt-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "prompt-block" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PromptBlockView);
  },
});

function PromptBlockView({ node, updateAttributes, editor }: NodeViewProps) {
  const editable = editor.isEditable;
  const prompt = node.attrs.prompt as string;
  const model = node.attrs.model as string;

  return (
    <NodeViewWrapper
      className="not-prose my-7 rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden"
      data-drag-handle
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] uppercase tracking-widest font-medium text-[#6366f1]">
          Prompt
        </span>
        <input
          value={model}
          readOnly={!editable}
          onChange={(e) => updateAttributes({ model: e.target.value })}
          placeholder="Model"
          className="bg-white/[0.04] rounded px-2 py-0.5 text-[11px] text-[#888] outline-none focus:text-[#f5f3ee] w-40 text-right read-only:bg-transparent"
        />
      </div>
      {editable ? (
        <AutoTextarea
          value={prompt}
          onChange={(v) => updateAttributes({ prompt: v })}
          placeholder={"You are a {{role}} helping with {{topic}}…"}
          className="px-4 py-4 font-mono text-[13px] leading-relaxed text-[#bbb]"
        />
      ) : (
        <pre className="px-4 py-4 font-mono text-[13px] leading-relaxed text-[#bbb] whitespace-pre-wrap">
          {renderVariables(prompt)}
        </pre>
      )}
      <div className="px-4 py-2 border-t border-white/[0.04] text-[11px] text-[#858585]">
        {estimateTokens(prompt)} tokens · use {"{{variables}}"} for placeholders
      </div>
    </NodeViewWrapper>
  );
}

function renderVariables(text: string) {
  return text.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span key={i} className="text-[#a78bfa] bg-[#a78bfa]/10 px-1 rounded">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
