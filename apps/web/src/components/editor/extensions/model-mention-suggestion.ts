import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { mockModels } from "@/lib/mock-data";
import {
  ModelSuggestionList,
  type ModelItem,
  type ModelListRef,
} from "../model-suggestion-list";

/** Inline "@" autocomplete that inserts a `modelMention` node. */
export const ModelMentionSuggestion = Extension.create({
  name: "modelMentionSuggestion",

  addProseMirrorPlugins() {
    return [
      Suggestion<ModelItem>({
        editor: this.editor,
        char: "@",
        allowSpaces: false,
        startOfLine: false,

        items: ({ query }) => {
          const q = query.toLowerCase();
          return mockModels
            .filter(
              (m) =>
                m.name.toLowerCase().includes(q) ||
                m.slug.toLowerCase().includes(q) ||
                m.company.toLowerCase().includes(q),
            )
            .slice(0, 8)
            .map((m) => ({ slug: m.slug, name: m.name, company: m.company }));
        },

        command: ({ editor, range, props }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent([
              { type: "modelMention", attrs: { slug: props.slug } },
              { type: "text", text: " " },
            ])
            .run();
        },

        render: () => {
          let component: ReactRenderer<ModelListRef> | null = null;
          let popup: HTMLDivElement | null = null;

          const place = (rect: DOMRect | null | undefined) => {
            if (!popup || !rect) return;
            const margin = 6;
            // Flip above if not enough room below.
            const below = window.innerHeight - rect.bottom;
            popup.style.left = `${Math.min(rect.left, window.innerWidth - 300)}px`;
            if (below < 300) {
              popup.style.top = "";
              popup.style.bottom = `${window.innerHeight - rect.top + margin}px`;
            } else {
              popup.style.bottom = "";
              popup.style.top = `${rect.bottom + margin}px`;
            }
          };

          return {
            onStart: (props) => {
              component = new ReactRenderer(ModelSuggestionList, {
                props: { items: props.items, query: props.query, command: props.command },
                editor: props.editor,
              });
              popup = document.createElement("div");
              popup.style.position = "fixed";
              popup.style.zIndex = "60";
              popup.appendChild(component.element);
              document.body.appendChild(popup);
              place(props.clientRect?.());
            },

            onUpdate: (props) => {
              component?.updateProps({
                items: props.items,
                query: props.query,
                command: props.command,
              });
              place(props.clientRect?.());
            },

            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                popup?.remove();
                return true;
              }
              return component?.ref?.onKeyDown({ event: props.event }) ?? false;
            },

            onExit: () => {
              popup?.remove();
              popup = null;
              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});
