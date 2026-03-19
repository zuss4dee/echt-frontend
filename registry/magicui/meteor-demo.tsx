"use client";

import { Meteors } from "@/registry/magicui/meteors";

/** Bordered demo block — same composition as Magic UI example (optional embed). */
export function MeteorDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-neutral-950">
      <Meteors number={30} />
      <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent whitespace-pre-wrap dark:from-white dark:to-slate-900/10">
        Meteors
      </span>
    </div>
  );
}
