import Link from "next/link";
import { mockModels } from "@/lib/mock-data";

/**
 * Inline @model mention. Resolves the slug against mockModels and links to the
 * model page, styled like the landing-page @claude-sonnet-4 chip. Falls back to
 * plain "@slug" text if the model isn't known.
 */
export function ModelMention({ slug }: { slug: string }) {
  if (!slug) return null;
  const model = mockModels.find((m) => m.slug === slug);
  const label = model ? model.name : slug;

  const chip = (
    <span className="text-[#ff9a8f] bg-[#ff9a8f]/10 px-1.5 py-0.5 rounded text-[0.95em] font-medium whitespace-nowrap">
      @{label}
    </span>
  );

  if (!model) return chip;

  return (
    <Link
      href={`/models/${model.slug}`}
      className="no-underline hover:opacity-80 transition-opacity"
    >
      {chip}
    </Link>
  );
}
