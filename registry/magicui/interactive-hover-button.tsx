"use client";

import Link from "next/link";
import { clsx } from "clsx";

type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** When set, renders as `next/link` (for CTAs that navigate). */
  href?: string;
};

/** Inline arrow — avoids lucide-react SSR/client className drift (hydration warnings). */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  ...props
}: InteractiveHoverButtonProps) {
  // Use clsx only (no tailwind-merge). twMerge can reorder classes differently across SSR/client
  // bundles in dev and trigger hydration mismatches on deeply merged CTAs.
  const classes = clsx(
    "group relative inline-flex w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold no-underline transition-colors duration-300",
    className,
  );

  const inner = (
    <>
      {/* Idle row — color comes from root link/button only */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full bg-current opacity-50 transition-all duration-300 group-hover:scale-[100.8] group-hover:opacity-90" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute inset-0 z-20 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <span
          className="h-2 w-2 shrink-0 rounded-full border-2 border-current bg-transparent opacity-90"
          aria-hidden
        />
        <span className="whitespace-nowrap">{children}</span>
        <ArrowRightIcon className="h-4 w-4 shrink-0" />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  );
}
