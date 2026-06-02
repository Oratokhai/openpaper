"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Splits a prompt string into plain text and {{variable}} chips so variables
 * can be highlighted the way the landing-page mockup shows them.
 */
function renderWithVariables(text: string) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part) ? (
      <span
        key={i}
        className="text-[#a3b18a] bg-[#a3b18a]/10 px-1 rounded"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function PromptBlock({
  prompt,
  model,
  tokens,
}: {
  prompt: string;
  model?: string;
  tokens?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="not-prose my-7 rounded-xl bg-[#0a0a0a] border border-white/[0.08] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <span className="text-[10px] text-[#606c38] font-medium uppercase tracking-widest">
          Prompt
        </span>
        {model && (
          <span className="text-[11px] text-[#888] bg-white/[0.04] px-2 py-0.5 rounded">
            {model}
          </span>
        )}
      </div>
      <pre className="px-4 py-4 font-mono text-[13px] leading-relaxed text-[#bbb] whitespace-pre-wrap">
        {renderWithVariables(prompt)}
      </pre>
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04]">
        <span className="text-[11px] text-[#858585]">
          {tokens ? `${tokens} tokens` : " "}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[#606c38] font-medium hover:text-[#818cf8] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
}
