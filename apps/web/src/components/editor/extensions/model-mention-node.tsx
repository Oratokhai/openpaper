import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import { mockModels } from "@/lib/mock-data";

/** Inline atom node: an @model mention chip that links to the model page. */
export const ModelMentionNode = Node.create({
  name: "modelMention",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return { slug: { default: "" } };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="model-mention"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-type": "model-mention" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ModelMentionView);
  },
});

function ModelMentionView({ node }: NodeViewProps) {
  const slug = node.attrs.slug as string;
  const model = mockModels.find((m) => m.slug === slug);
  const label = model ? model.name : slug;

  return (
    <NodeViewWrapper as="span" className="whitespace-nowrap">
      <span className="text-[#a3b18a] bg-[#a3b18a]/10 px-1.5 py-0.5 rounded text-[0.95em] font-medium">
        @{label}
      </span>
    </NodeViewWrapper>
  );
}
