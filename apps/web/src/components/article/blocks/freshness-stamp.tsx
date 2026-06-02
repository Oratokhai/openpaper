import { Zap, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type FreshnessStatus = "current" | "aging" | "outdated";

const config: Record<
  FreshnessStatus,
  { icon: React.ReactNode; label: string; text: string }
> = {
  current:  { icon: <Zap className="w-3.5 h-3.5" />,           label: "Current",          text: "text-emerald-400" },
  aging:    { icon: <Clock className="w-3.5 h-3.5" />,          label: "May be outdated",  text: "text-amber-400"   },
  outdated: { icon: <AlertTriangle className="w-3.5 h-3.5" />,  label: "Outdated",         text: "text-rose-400"    },
};

export function FreshnessStamp({
  status = "current",
  verified,
  className,
}: {
  status?: FreshnessStatus;
  verified?: string;
  className?: string;
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[13px]",
        className
      )}
    >
      <span className={cn("flex items-center gap-1.5 font-medium", c.text)}>
        {c.icon}
        {c.label}
      </span>
      {verified && (
        <span className="text-[#858585]">· Verified {verified}</span>
      )}
    </span>
  );
}
