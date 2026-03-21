"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";

type BouncyCardsFeaturesProps = {
  /** Scroll to pricing on the same page (e.g. home) instead of navigating away. */
  onRunFreeScan: () => void;
};

export function BouncyCardsFeatures({ onRunFreeScan }: BouncyCardsFeaturesProps) {
  return (
    <section id="how-echt-works" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-3 py-14 text-slate-800 sm:px-4 sm:py-20">
        <div className="mb-10 flex flex-col items-stretch justify-between gap-4 md:mb-12 md:flex-row md:items-end md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Forensic checks for every tenancy,{" "}
              <span className="text-slate-600">in one place</span>
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
              Echt is a document verification app for referencing teams: upload payslips, bank
              statements, or IDs and get structured evidence—metadata, tamper signals, and a clear
              outcome—so you can approve or challenge with confidence.
            </p>
          </div>
          <InteractiveHoverButton
            type="button"
            onClick={onRunFreeScan}
            className="w-full shrink-0 justify-center border-slate-900/15 bg-slate-900 !text-white shadow-xl transition-colors hover:bg-slate-800 hover:!text-white sm:w-auto sm:whitespace-nowrap"
          >
            Run a Free Scan
          </InteractiveHoverButton>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <BounceCard className="col-span-12 md:col-span-4">
            <CardTitle>File DNA &amp; metadata</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-indigo-50">
                See creation times, export history, and structure before you trust what&apos;s on
                screen—so edited or re-saved files don&apos;t slip through as originals.
              </span>
            </div>
          </BounceCard>
          <BounceCard className="col-span-12 md:col-span-8">
            <CardTitle>Pixel-level forgery detection</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-orange-50">
                Heatmaps highlight regions that may have been changed—so your team reviews
                tampering with context, not a vague “AI probability.”
              </span>
            </div>
          </BounceCard>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <BounceCard className="col-span-12 md:col-span-8">
            <CardTitle>Verdicts teams can defend</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-emerald-50">
                RED, AMBER, or GREEN with plain-English reasons—evidence you can stand behind in
                audits, disputes, and file notes.
              </span>
            </div>
          </BounceCard>
          <BounceCard className="col-span-12 md:col-span-4">
            <CardTitle>AI narrative signals</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-purple-500 to-[#4B00E0] p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-purple-50">
                Surfaces weak or inconsistent wording next to the forensic readout—so reviewers know
                what to ask before they sign off.
              </span>
            </div>
          </BounceCard>
        </div>
      </div>
    </section>
  );
}

function BounceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 0.97, rotate: "-1deg" }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 p-5 shadow-sm sm:min-h-[300px] sm:p-8",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="relative z-10 mx-auto max-w-[16ch] text-center text-xl font-semibold tracking-tight text-slate-900 sm:max-w-[14ch] sm:text-2xl md:text-3xl">
      {children}
    </h3>
  );
}
