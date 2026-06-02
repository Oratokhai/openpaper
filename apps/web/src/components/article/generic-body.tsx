import type { TocSection } from "./table-of-contents";
import { PromptBlock } from "./blocks/prompt-block";
import { ModelOutputBlock } from "./blocks/model-output-block";
import { ModelMention } from "./blocks/model-mention";

/** Anchors for the fallback article body. */
export const genericSections: TocSection[] = [
  { id: "the-core-problem", label: "The core problem" },
  { id: "what-the-data-shows", label: "What the data shows" },
  { id: "conclusions", label: "Conclusions" },
];

export function GenericBody() {
  return (
    <>
      <p>
        This is where the full article body lives. The reading experience is
        clean, serif, and built for long-form technical writing — with
        first-class blocks for the things AI people actually share.
      </p>

      <h2 id="the-core-problem">The core problem</h2>
      <p>
        After months of running this in production, one thing became clear: most
        of the conventional wisdom you&apos;ll find in blog posts is wrong, or at
        least vastly oversimplified. The real constraints are not where people
        think they are. The prompt below is the one that finally worked:
      </p>

      <PromptBlock
        model="Claude Sonnet 4.6"
        tokens={47}
        prompt={`You are a {{role}} helping a user understand {{topic}}.
Be concise. Cite sources.
User: {{input}}`}
      />

      <h2 id="what-the-data-shows">What the data shows</h2>
      <p>
        We ran 200 experiments across six configurations. The results challenge
        some widely-held assumptions about how these systems should be built.
        Here&apos;s a representative response from{" "}
        <ModelMention slug="claude-sonnet-4-6" />:
      </p>

      <ModelOutputBlock model="Claude Sonnet 4.6" date="May 2026" meta="temp 0.3">
        <p>
          The key insight here is that retrieval quality matters more than
          generation quality in most RAG systems. Focus your attention on the
          chunking strategy and embedding model before reaching for a larger
          model — that&apos;s where the real wins are hiding.
        </p>
      </ModelOutputBlock>

      <blockquote>
        The most important thing I learned: the problem is almost never the
        model. It&apos;s the retrieval.
      </blockquote>

      <h2 id="conclusions">Conclusions</h2>
      <p>
        Building production AI systems is harder than the demos suggest and
        easier than the pessimists claim. The key is measuring the right things
        from day one.
      </p>
    </>
  );
}
