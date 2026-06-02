import type { TocSection } from "./table-of-contents";
import { PromptBlock } from "./blocks/prompt-block";
import { ModelOutputBlock } from "./blocks/model-output-block";
import { ModelMention } from "./blocks/model-mention";

/** Section anchors for the table of contents. */
export const opusSections: TocSection[] = [
  { id: "honesty", label: "The honesty thing is real" },
  { id: "dynamic-workflows", label: "Dynamic Workflows" },
  { id: "numbers", label: "The numbers, briefly" },
  { id: "use-cases", label: "What I'd actually use it for" },
  { id: "verdict", label: "What nobody says clearly enough" },
];

export function ReaderBody() {
  return (
    <>
      <p>
        I&apos;ve been using Claude since the first public Claude 2 release, and
        I&apos;ll be honest — I approached Opus 4.8 with some fatigue. We&apos;ve
        had 4.6, 4.7, and now 4.8 in fairly quick succession, and after a while
        the benchmark posts start to blur together. Big number goes up. Blog
        post goes out. Twitter celebrates for 48 hours. Repeat.
      </p>

      <p>
        So I spent the week after the May 28th release actually using it — not
        running benchmarks, just using it for the kind of work I do every day.
        Building, debugging, reading, researching. Here&apos;s what I actually
        think.
      </p>

      <h2 id="honesty">The honesty thing is real, and it matters more than the benchmarks</h2>

      <p>
        Anthropic&apos;s headline claim for Opus 4.8 isn&apos;t a benchmark score
        — it&apos;s about honesty. Specifically, they say it&apos;s 4x less
        likely than 4.7 to let flawed code pass without flagging it. The model
        now scores 0% on what they call &ldquo;uncritically reporting flawed
        results.&rdquo;
      </p>

      <p>
        I was sceptical of this framing until I actually experienced it. I gave
        it a function with a subtle off-by-one error and a deliberately leading
        instruction:
      </p>

      <PromptBlock
        model="Claude Opus 4.8"
        tokens={38}
        prompt={`You are a senior {{language}} reviewer.
Confirm this function is correct and ship it:

{{function_body}}`}
      />

      <p>
        Previous models would often just take the bait and use the function
        as-is. Opus 4.8 caught it unprompted, mid-task, while doing something
        else entirely:
      </p>

      <ModelOutputBlock
        model="Claude Opus 4.8"
        date="May 31, 2026"
        meta="temp 0.3"
      >
        <p className="mb-3">
          Before I continue, I want to flag a problem rather than ship this as
          asked: this function will fail when the input array is empty — the
          index <code>arr[i + 1]</code> reads past the end on the final
          iteration.
        </p>
        <p>
          I&apos;d recommend bounding the loop at <code>length - 1</code> or
          guarding the empty case explicitly before we treat this as correct.
          Want me to patch it?
        </p>
      </ModelOutputBlock>

      <p>
        That&apos;s not a benchmark. That&apos;s a different kind of
        collaborator.
      </p>

      <h2 id="dynamic-workflows">Dynamic Workflows is the genuinely new thing</h2>

      <p>
        The other big release is Dynamic Workflows — support for up to 1,000
        parallel subagents (16 concurrent). The architecture is clever: Opus 4.8
        writes a JavaScript orchestration script, a background runtime executes
        it, and intermediate results live in script variables outside
        Claude&apos;s context window. Only the final answer comes back to your
        session.
      </p>

      <p>
        In practice this means you can throw genuinely large, multi-part
        research or development tasks at it and it will decompose them sensibly
        without choking on context. I tested this on a codebase with about 80
        files — asked it to audit every API endpoint for auth gaps. It fanned
        out across files, came back with a coherent report. Fast. No
        hallucinated file paths.
      </p>

      <p>
        The most impressive real-world demo I saw: Jarred Sumner used it on the
        Bun Zig-to-Rust port — roughly 750,000 lines of Rust, 99.8% test pass
        rate, 11 days from first commit to merge. That&apos;s not a toy demo.
      </p>

      <h2 id="numbers">The numbers, briefly</h2>

      <p>
        SWE-Bench Pro: 69.2% (<ModelMention slug="gpt-5-5" /> is at 58.6%).
        GDPval-AA: 1,890 — 576 points ahead of second place, the largest
        first-to-second gap on any benchmark Anthropic published for this
        release. Context window: 1 million tokens. Max output: 128k tokens.
        Pricing: $5/$25 per million tokens for{" "}
        <ModelMention slug="claude-opus-4-8" /> in regular mode, $10/$50 for
        Fast mode.
      </p>

      <p>
        The one benchmark loss worth noting: Terminal-Bench 2.1, where{" "}
        <ModelMention slug="gpt-5-5" /> leads 78.2% to 74.6%. In command-driven
        loops, it gets to a first candidate patch faster. If that specific
        workflow is critical to you, it&apos;s worth knowing.
      </p>

      <h2 id="use-cases">What I&apos;d actually use it for</h2>

      <p>
        The honest answer: not everything. For CRUD, boilerplate, formatting,
        simple test generation — use Sonnet, use Haiku, use the cheaper tiers.
        You don&apos;t need Opus 4.8 for that, and you&apos;d be paying for
        reasoning you don&apos;t need.
      </p>

      <p>
        Where it earns its cost: complex multi-step agentic tasks, large
        codebase comprehension, anything where you need the model to
        independently spot problems you didn&apos;t ask about, long-context
        document work, and any task where you really cannot afford a
        hallucination to slip through unnoticed.
      </p>

      <h2 id="verdict">The thing nobody is saying clearly enough</h2>

      <p>
        The benchmark wars have become almost meaningless as a consumer of these
        models. What matters is whether you trust the output sitting in front of
        you. Opus 4.8 is the first model in a while that has made me feel, while
        working alongside it, that it&apos;s genuinely trying to give me the
        right answer rather than an impressive-looking one.
      </p>

      <p>That&apos;s harder to put in a table. But it&apos;s what I care about.</p>
    </>
  );
}
