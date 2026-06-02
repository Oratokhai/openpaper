"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Mathematics } from "@tiptap/extension-mathematics";
import "katex/dist/katex.min.css";

import {
  Undo2, Redo2, Bold, Italic, Strikethrough, Code, Link as LinkIcon,
  Image as ImageIcon, List, ListOrdered, Minus, ChevronDown, Quote,
  Heading2, Heading3, Pilcrow, Terminal, Bot, Sigma, Asterisk, AtSign,
} from "lucide-react";

import { lowlight } from "./lowlight";
import { PromptBlockNode } from "./extensions/prompt-block-node";
import { ModelOutputNode } from "./extensions/model-output-node";
import { ModelMentionNode } from "./extensions/model-mention-node";
import { ModelMentionSuggestion } from "./extensions/model-mention-suggestion";
import { FootnoteNode } from "./extensions/footnote-node";
import { mockModels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function RichEditor({
  editable,
  onReady,
}: {
  editable: boolean;
  onReady?: (editor: Editor) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // replaced by lowlight
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image,
      Mathematics,
      Placeholder.configure({
        placeholder: "Write your article. Use the toolbar to add blocks…",
      }),
      PromptBlockNode,
      ModelOutputNode,
      ModelMentionNode,
      ModelMentionSuggestion,
      FootnoteNode,
    ],
    content: "",
    editorProps: {
      attributes: { class: "tiptap focus:outline-none min-h-[320px]" },
    },
  });

  useEffect(() => {
    if (editor) onReady?.(editor);
  }, [editor, onReady]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return <div className="min-h-[320px] text-[#787878]">Loading editor…</div>;
  }

  return (
    <div>
      {editable && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <Footnotes editor={editor} />
    </div>
  );
}

/* ─────────────────────────── Toolbar ─────────────────────────── */

function Toolbar({ editor }: { editor: Editor }) {
  // Re-render on every transaction so active states stay in sync.
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    const f = () => force();
    editor.on("transaction", f);
    return () => {
      editor.off("transaction", f);
    };
  }, [editor]);

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addFootnote = () => {
    const text = window.prompt("Footnote text");
    if (text)
      editor.chain().focus().insertContent({ type: "footnote", attrs: { text } }).run();
  };

  return (
    <div className="sticky top-16 z-30 mb-8 flex flex-wrap items-center gap-1 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-md py-2">
      <IconBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="w-4 h-4" />
      </IconBtn>

      <Divider />

      <StyleMenu editor={editor} />

      <Divider />

      <IconBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Link" active={editor.isActive("link")} onClick={setLink}>
        <LinkIcon className="w-4 h-4" />
      </IconBtn>

      <Divider />

      <IconBtn title="Image" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="w-4 h-4" />
      </IconBtn>
      <IconBtn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="w-4 h-4" />
      </IconBtn>

      <Divider />

      <MentionMenu editor={editor} />

      <Menu label="More">
        <MenuItem icon={Terminal} label="Prompt Block" onClick={() => editor.chain().focus().insertContent({ type: "promptBlock" }).run()} />
        <MenuItem icon={Bot} label="Model Output" onClick={() => editor.chain().focus().insertContent({ type: "modelOutput" }).run()} />
        <MenuItem icon={Code} label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <MenuItem icon={Sigma} label="LaTeX" onClick={() => editor.chain().focus().insertInlineMath({ latex: "a^2 + b^2 = c^2" }).run()} />
        <MenuItem icon={Asterisk} label="Footnote" onClick={addFootnote} />
      </Menu>
    </div>
  );
}

function StyleMenu({ editor }: { editor: Editor }) {
  return (
    <Menu label="Style">
      <MenuItem icon={Pilcrow} label="Text" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} />
      <MenuItem icon={Heading2} label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <MenuItem icon={Heading3} label="Subheading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
      <MenuItem icon={Quote} label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
    </Menu>
  );
}

function MentionMenu({ editor }: { editor: Editor }) {
  return (
    <Menu label="@Model" icon={AtSign}>
      {mockModels.map((m) => (
        <MenuItem
          key={m.slug}
          label={m.name}
          onClick={() =>
            editor.chain().focus().insertContent([
              { type: "modelMention", attrs: { slug: m.slug } },
              { type: "text", text: " " },
            ]).run()
          }
        />
      ))}
    </Menu>
  );
}

/* ─────────────────────────── Footnotes list ─────────────────────────── */

function Footnotes({ editor }: { editor: Editor }) {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    const f = () => force();
    editor.on("transaction", f);
    return () => {
      editor.off("transaction", f);
    };
  }, [editor]);

  const notes: string[] = [];
  editor.state.doc.descendants((n) => {
    if (n.type.name === "footnote") notes.push(n.attrs.text as string);
  });
  if (notes.length === 0) return null;

  return (
    <div className="mt-12 pt-6 border-t border-white/[0.08]">
      <p className="text-[11px] uppercase tracking-widest text-[#858585] mb-3">Footnotes</p>
      <ol className="space-y-2">
        {notes.map((note, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-[#888] leading-relaxed">
            <span className="text-[#6366f1] font-medium shrink-0">[{i + 1}]</span>
            <span>{note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────── UI primitives ─────────────────────────── */

function IconBtn({
  children, title, onClick, active,
}: {
  children: React.ReactNode; title: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        active ? "bg-white/[0.1] text-[#f5f3ee]" : "text-[#888] hover:text-[#f5f3ee] hover:bg-white/[0.05]"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-white/[0.08]" />;
}

function Menu({
  label, icon: Icon, children,
}: {
  label: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2.5 h-8 text-sm text-[#888] hover:text-[#f5f3ee] hover:bg-white/[0.05] transition-colors"
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-50 w-56 rounded-xl border border-white/[0.1] bg-[#161616] p-1.5 shadow-2xl max-h-72 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon, label, onClick, active,
}: {
  icon?: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
        active ? "text-[#f5f3ee] bg-white/[0.06]" : "text-[#aaa] hover:text-[#f5f3ee] hover:bg-white/[0.05]"
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-[#888]" />}
      {label}
    </button>
  );
}
