import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { AutoTextarea } from "../auto-textarea";

/** Tiptap node: an editable Model Output block with provenance. */
export const ModelOutputNode = Node.create({
  name: "modelOutput",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      model: { default: "Claude Opus 4.8" },
      date: { default: "" },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="model-output"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "model-output" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ModelOutputView);
  },
});

function ModelOutputView({ node, updateAttributes, editor }: NodeViewProps) {
  const editable = editor.isEditable;
  const { model, date, text } = node.attrs as {
    model: string;
    date: string;
    text: string;
  };

  return (
    <NodeViewWrapper
      className="not-prose my-7 rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden"
      data-drag-handle
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] uppercase tracking-widest font-medium text-[#606c38]">
          Model Output
        </span>
        <div className="flex items-center gap-2">
          <input
            value={model}
            readOnly={!editable}
            onChange={(e) => updateAttributes({ model: e.target.value })}
            placeholder="Model"
            className="bg-white/[0.04] rounded px-2 py-0.5 text-[11px] text-[#888] outline-none focus:text-[#f5f3ee] w-36 text-right read-only:bg-transparent"
          />
          <input
            value={date}
            readOnly={!editable}
            onChange={(e) => updateAttributes({ date: e.target.value })}
            placeholder="Date"
            className="bg-white/[0.04] rounded px-2 py-0.5 text-[11px] text-[#888] outline-none focus:text-[#f5f3ee] w-24 text-right read-only:bg-transparent"
          />
        </div>
      </div>
      {editable ? (
        <AutoTextarea
          value={text}
          onChange={(v) => updateAttributes({ text: v })}
          placeholder="Paste the model's response…"
          className="px-4 py-3 text-[14px] leading-relaxed text-[#bbb]"
        />
      ) : (
        <p className="px-4 py-3 text-[14px] leading-relaxed text-[#bbb] whitespace-pre-wrap">
          {text}
        </p>
      )}
    </NodeViewWrapper>
  );
}
