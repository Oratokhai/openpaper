import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

/** Inline atom node: a numbered footnote reference carrying its note text. */
export const FootnoteNode = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return { text: { default: "" } };
  },

  parseHTML() {
    return [{ tag: 'sup[data-type="footnote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(HTMLAttributes, { "data-type": "footnote" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FootnoteView);
  },
});

function FootnoteView({ node, editor, getPos, updateAttributes }: NodeViewProps) {
  // Number this footnote by its order in the document.
  let index = 0;
  let counter = 0;
  const myPos = typeof getPos === "function" ? getPos() : -1;
  editor.state.doc.descendants((n, pos) => {
    if (n.type.name === "footnote") {
      counter += 1;
      if (pos === myPos) index = counter;
    }
  });

  const handleClick = () => {
    if (!editor.isEditable) return;
    const next = window.prompt("Footnote text", node.attrs.text as string);
    if (next !== null) updateAttributes({ text: next });
  };

  return (
    <NodeViewWrapper as="sup" className="inline">
      <button
        type="button"
        onClick={handleClick}
        title={node.attrs.text as string}
        className="text-[#ff6b5c] text-[0.7em] font-semibold align-super hover:underline"
      >
        [{index || "?"}]
      </button>
    </NodeViewWrapper>
  );
}
