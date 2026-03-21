/** Use `currentColor` so `className="text-slate-900"` (or `text-white`) controls visibility. */
const logoStroke = {
  stroke: "currentColor",
  strokeWidth: 8,
  strokeLinecap: "round" as const,
};

export function EchtLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M 32 32 L 68 32" {...logoStroke} />
      <path d="M 32 50 L 56 50" {...logoStroke} />
      <path d="M 32 68 L 68 68" {...logoStroke} />
      <path d="M 36 32 L 36 68" {...logoStroke} />
      <circle cx="72" cy="50" r="5" fill="#10B981" />
    </svg>
  );
}

/** Wordmark: "ECHT". Set `className` with e.g. `text-slate-900` (light bg) or `text-white` (dark). */
export function EchtWordmark({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* E */}
      <path d="M 14 32 L 42 32" {...logoStroke} />
      <path d="M 14 50 L 30 50" {...logoStroke} />
      <path d="M 14 68 L 42 68" {...logoStroke} />
      <path d="M 14 32 L 14 68" {...logoStroke} />
      {/* C */}
      <path d="M 64 32 L 92 32" {...logoStroke} />
      <path d="M 64 68 L 92 68" {...logoStroke} />
      <path d="M 64 32 L 64 68" {...logoStroke} />
      {/* H */}
      <path d="M 114 32 L 114 68" {...logoStroke} />
      <path d="M 142 32 L 142 68" {...logoStroke} />
      <path d="M 114 50 L 142 50" {...logoStroke} />
      {/* T */}
      <path d="M 154 32 L 192 32" {...logoStroke} />
      <path d="M 173 32 L 173 68" {...logoStroke} />
      {/* Accent dot */}
      <circle cx="208" cy="50" r="5" fill="#10B981" />
    </svg>
  );
}
