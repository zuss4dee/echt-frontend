"use client";

import { Meteors } from "@/registry/magicui/meteors";

/**
 * Full-viewport background: soft light gradient (Magic UI MeteorDemo-style field)
 * + meteor shower. Sits under all content; pointer-events none.
 */
export function GlobalMeteorBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base wash — blends with white UI (demo used bordered box; this is the full-page equivalent) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50/90 to-slate-100/50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900/80"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,255,255,0.95),transparent_55%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute inset-0 opacity-90 dark:opacity-70">
        <Meteors number={30} />
      </div>
    </div>
  );
}
