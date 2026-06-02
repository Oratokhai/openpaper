import { cn } from "@/lib/utils";

export function AnthropicLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Anthropic's starburst / asterisk mark — warm cream on dark */}
      <g transform="translate(50, 50)">
        {/* 8 rays of the asterisk */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 8;
          const y1 = Math.sin(angle) * 8;
          const x2 = Math.cos(angle) * 38;
          const y2 = Math.sin(angle) * 38;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e8d5b0"
              strokeWidth="7"
              strokeLinecap="round"
            />
          );
        })}
        {/* Center dot */}
        <circle cx="0" cy="0" r="6" fill="#e8d5b0" />
      </g>
    </svg>
  );
}
