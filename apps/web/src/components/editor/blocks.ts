export type BlockType =
  | "heading"
  | "paragraph"
  | "quote"
  | "code"
  | "prompt"
  | "output";

interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: "heading" | "paragraph" | "quote" | "code";
  text: string;
}

export interface PromptBlockData extends BaseBlock {
  type: "prompt";
  prompt: string;
  model: string;
}

export interface OutputBlockData extends BaseBlock {
  type: "output";
  model: string;
  date: string;
  text: string;
}

export type Block = TextBlock | PromptBlockData | OutputBlockData;

export function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "prompt":
      return { id, type, prompt: "", model: "Claude Opus 4.8" };
    case "output":
      return { id, type, model: "Claude Opus 4.8", date: "", text: "" };
    default:
      return { id, type, text: "" };
  }
}

/** Rough token estimate (~4 chars/token) used for the prompt block footer. */
export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  return Math.max(1, Math.round(text.length / 4));
}

export interface SlashOption {
  type: BlockType;
  label: string;
  hint: string;
}

export const slashOptions: SlashOption[] = [
  { type: "paragraph", label: "Text", hint: "Plain paragraph" },
  { type: "heading", label: "Heading", hint: "Section title" },
  { type: "prompt", label: "Prompt Block", hint: "Shareable prompt with variables" },
  { type: "output", label: "Model Output", hint: "Response with provenance" },
  { type: "code", label: "Code", hint: "Monospace code block" },
  { type: "quote", label: "Quote", hint: "Pull quote" },
];
