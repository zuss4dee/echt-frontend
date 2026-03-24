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
    <section
      id="how-echt-works"
      className="scroll-mt-24 bg-white"
      aria-labelledby="how-echt-works-heading"
    >
      <div className="mx-auto max-w-7xl px-3 py-14 text-slate-800 sm:px-4 sm:py-20">
        <div className="mb-10 flex flex-col items-stretch justify-end gap-4 md:mb-12 md:flex-row md:items-end md:px-8">
          <h2 id="how-echt-works-heading" className="sr-only">
            How Echt works
          </h2>
          <InteractiveHoverButton
            type="button"
            onClick={onRunFreeScan}
            className="w-full shrink-0 justify-center border-slate-900/15 bg-slate-900 !text-white shadow-xl transition-colors hover:bg-slate-800 hover:!text-white sm:ml-auto sm:w-auto sm:whitespace-nowrap"
          >
            Test a Suspicious Document Now
          </InteractiveHoverButton>
        </div>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <BounceCard className="col-span-12 md:col-span-4">
            <CardTitle>File DNA and Metadata</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-indigo-50">
                Never trust a screen again. We reveal the exact creation time, export history, and
                file structure. If an applicant edited or re saved a document to fake their income,
                you will know immediately.
              </span>
            </div>
          </BounceCard>
          <BounceCard className="col-span-12 md:col-span-8">
            <CardTitle>Pixel Level Forgery Detection</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-orange-50">
                No more vague AI probabilities. Our visual heatmaps highlight the exact pixels a
                fraudster altered. Your team sees the manipulation with perfect clarity.
              </span>
            </div>
          </BounceCard>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <BounceCard className="col-span-12 md:col-span-8">
            <CardTitle>Verdicts You Can Defend</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-emerald-50">
                Get an instant RED, AMBER, or GREEN result backed by plain English reasons. You get
                rock solid evidence to stand behind during disputes, audits, and landlord updates.
              </span>
            </div>
          </BounceCard>
          <BounceCard className="col-span-12 md:col-span-4">
            <CardTitle>AI Narrative Signals</CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-purple-500 to-[#4B00E0] p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-purple-50">
                We catch the subtle lies. Echt flags weak or inconsistent wording right next to the
                forensic readout. Your reviewers will know exactly what questions to ask before they
                ever sign a lease.
              </span>
            </div>
          </BounceCard>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <BounceCard className="col-span-12">
            <CardTitle className="max-w-[min(100%,22ch)] sm:max-w-[20ch]">
              Automate With Our API
            </CardTitle>
            <div className="absolute bottom-0 left-4 right-4 top-32 translate-y-3 rounded-t-2xl bg-gradient-to-br from-slate-600 to-sky-600 p-4 transition-transform duration-[250ms] group-hover:translate-y-1 group-hover:rotate-[2deg]">
              <span className="block text-center text-sm font-semibold leading-snug text-sky-50">
                Stop wasting time on manual data entry. Connect Echt directly to your CRM or custom
                software. Send an applicant file via our API and get a structured forensic verdict
                back instantly. Completely automated fraud defense.
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

function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "relative z-10 mx-auto max-w-[16ch] text-center text-xl font-semibold tracking-tight text-slate-900 sm:max-w-[14ch] sm:text-2xl md:text-3xl",
        className,
      )}
    >
      {children}
    </h3>
  );
}
