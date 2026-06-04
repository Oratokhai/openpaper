"use client";

import { Check } from "lucide-react";

/**
 * Live password guidance for the auth forms. Shows a 4-segment strength bar plus
 * a requirements checklist that ticks off as the user types — so they learn what
 * "strong enough" means *before* Clerk rejects a weak password on submit.
 */

type Rule = { label: string; test: (pw: string) => boolean };

const RULES: Rule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Upper & lowercase letters", test: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: "A number", test: (pw) => /\d/.test(pw) },
  { label: "A symbol (!?@#…)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const LEVELS = [
  { label: "Too weak", color: "#f43f5e", text: "text-rose-400" },   // 0–1
  { label: "Weak", color: "#fb923c", text: "text-orange-400" },     // 2
  { label: "Good", color: "#fbbf24", text: "text-amber-400" },      // 3
  { label: "Strong", color: "#34d399", text: "text-emerald-400" },  // 4
];

/** 0–4 score: one point per satisfied rule, +1 bonus for length ≥ 12. */
export function passwordScore(pw: string): number {
  if (!pw) return 0;
  const met = RULES.filter((r) => r.test(pw)).length;
  const score = met + (pw.length >= 12 ? 1 : 0);
  return Math.min(4, score);
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const met = RULES.map((r) => r.test(password));
  const score = passwordScore(password);
  const level = LEVELS[Math.min(LEVELS.length - 1, Math.max(0, score - 1))];

  return (
    <div className="mt-3 space-y-3">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i < score ? level.color : "rgba(255,255,255,0.08)" }}
            />
          ))}
        </div>
        <span className={`text-[11px] font-medium ${level.text}`}>{level.label}</span>
      </div>

      {/* Requirements checklist */}
      <ul className="grid grid-cols-1 gap-1.5">
        {RULES.map((r, i) => (
          <li key={r.label} className="flex items-center gap-2 text-[12px]">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                met[i] ? "bg-emerald-500/20 text-emerald-400" : "bg-white/[0.05] text-[#5e5e5e]"
              }`}
            >
              {met[i] ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <span className="h-1 w-1 rounded-full bg-current" />}
            </span>
            <span className={met[i] ? "text-[#bdbdbd]" : "text-[#6e6e6e]"}>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
