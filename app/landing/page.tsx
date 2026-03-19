"use client";

import Image from "next/image";
import UnicornScene from "unicornstudio-react/next";
import { X, Linkedin } from "lucide-react";
import { EchtWordmark } from "@/components/EchtLogo";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";
import { BouncyCardsFeatures } from "@/components/marketing/BouncyCardsFeatures";
import { RoiCalculator } from "@/components/marketing/RoiCalculator";
import { Safari } from "@/components/ui/safari";

export default function LandingHero() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col pb-12">
        {/* Hero shell with background tied to hero height */}
        <div className="relative">
          {/* Hero background — solid white (video / blobs disabled for testing) */}
          <div className="pointer-events-none absolute inset-x-0 inset-y-0 bg-white" aria-hidden>
            {/* Restore video + blobs later:
            <video className="h-full w-full object-cover" src="/flow-gradient.webm" autoPlay muted loop playsInline />
            */}
          </div>

          {/* Light/airy foreground shell — z-10 so it paints above the hero white fill layer */}
          <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* Top nav – original glassy bar */}
          <header className="relative flex items-center justify-between gap-4 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 text-[13px] text-slate-700 shadow-sm backdrop-blur-xl sm:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <EchtWordmark className="h-8 w-auto text-slate-900" />
            </div>

            {/* Center nav */}
            <nav className="hidden items-center gap-6 text-slate-600 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
              <button className="transition-colors hover:text-slate-900">Platform</button>
              <button className="transition-colors hover:text-slate-900">Security</button>
              <button className="transition-colors hover:text-slate-900">Enterprise</button>
            </nav>

            {/* Right – social icons + primary CTA */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 text-slate-600 sm:flex">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <X className="h-3.5 w-3.5" />
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                  <Linkedin className="h-3.5 w-3.5" />
                </span>
              </div>
              <InteractiveHoverButton className="border-slate-900/15 bg-slate-900 text-white transition-colors hover:bg-slate-800 [--primary:#ffffff] [--primary-foreground:#0f172a]">
                Run a Free Scan
              </InteractiveHoverButton>
            </div>
          </header>

          {/* Hero */}
          <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-slate-50/80 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-10 sm:py-14">
            {/* Small badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-100">
                <span
                  className="bg-clip-text text-slate-800 [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] [background-image:linear-gradient(90deg,#475569,#0f172a,#475569)] [background-size:200%_100%]"
                  style={{ animation: "shiny-text 3s linear infinite" }}
                >
                  ✦ The forensic standard for letting agencies.
                </span>
              </div>
            </div>

            {/* Heading + subcopy */}
            <div className="mt-8 text-center">
              <h1 className="mx-auto max-w-3xl font-sans text-5xl leading-[1.03] tracking-tight text-slate-900 sm:text-7xl">
                Prove the{" "}
                <Highlighter
                  action="highlight"
                  color="#87CEFA"
                  animationDuration={900}
                >
                  <span className="font-bold text-slate-900">truth</span>
                </Highlighter>{" "}
                behind
                <br />
                every document.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                The forensic layer for modern tenant referencing. We automate the deep-scan of payslips, bank statements, and IDs, catching pixel-level manipulation and AI-generated forgeries so you only approve genuine tenants.
              </p>
            </div>

            {/* Media row */}
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
              {/* Left box: two stacked cards */}
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="absolute inset-0 opacity-[0.55]">
                  <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#4B00E0]/10 blur-3xl" />
                  <div className="absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-[#2D0066]/10 blur-3xl" />
                </div>

                {/* Card 1: dark-mode bank statement + heatmap */}
                <div className="relative flex-1 min-h-0">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
                    <div className="absolute inset-0 bg-slate-900">
                      <div className="absolute inset-x-6 top-6 h-6 rounded-md bg-slate-800/80" />
                      <div className="absolute inset-x-6 top-16 h-40 rounded-md bg-slate-800/80" />
                      <div className="absolute inset-x-6 bottom-10 h-24 rounded-md bg-gradient-to-t from-red-500/60 via-red-500/20 to-transparent" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl bg-black/30 px-4 py-3 text-[12px] text-white/85 shadow-sm backdrop-blur-xl ring-1 ring-white/15">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-white">Invisible Forgery Detection</div>
                      <div className="text-white/70">92% flagged</div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white/20">
                      <div className="h-2 w-[72%] rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Card 2: second pixel-level card (overlayed on the portrait) */}
                  <div className="absolute bottom-20 left-4 right-4 z-10 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 backdrop-blur-xl ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[12px] font-medium text-white">Edit &amp; compression detection</div>
                        <div className="mt-0.5 text-[11px] text-white/70">
                          Instantly flag altered fonts, spliced numbers, and hidden digital edits.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-medium text-white">87%</div>
                        <div className="text-[10px] text-white/60">accuracy</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/15">
                      <div className="h-1.5 w-[87%] rounded-full bg-white/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right media card: interactive forensic audit placeholder */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="absolute inset-0">
                  <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#4B00E0]/15 blur-3xl" />
                  <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-[#2D0066]/15 blur-3xl" />
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[12px] font-semibold text-slate-900">
                        Interactive Forensic Audit
                      </div>
                      <div className="mt-1 text-[11px] text-slate-600">
                        Review AI-flagged anomalies directly in your browser with exact coordinates of the manipulation.
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900/90 ring-1 ring-white/10">
                      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10 bg-slate-900/80">
                        <span className="h-2 w-2 rounded-full bg-red-500/80" />
                        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                        <span className="ml-3 text-[10px] text-white/60">
                          Live forensic audit · 128 scans today
                        </span>
                      </div>
                      <div className="grid h-full grid-cols-12 gap-4 px-4 py-3 text-[10px] text-white/70">
                        <div className="col-span-4 space-y-2">
                          <div className="rounded-lg bg-slate-800/80 p-2">
                            <div className="text-[10px] font-medium text-white">Anomaly feed</div>
                            <div className="mt-1 h-16 rounded bg-slate-900/80" />
                          </div>
                          <div className="rounded-lg bg-slate-800/80 p-2">
                            <div className="text-[10px] font-medium text-white">Risk summary</div>
                            <div className="mt-1 h-10 rounded bg-slate-900/80" />
                          </div>
                        </div>
                        <div className="col-span-8">
                          <div className="h-full rounded-lg bg-slate-900/80 relative overflow-hidden">
                            <div className="absolute inset-6 rounded-lg border border-red-500/60" />
                            <div className="absolute bottom-4 left-4 rounded-md bg-black/70 px-2 py-1 text-[10px] text-red-200">
                              Highlighting tampered region · x: 482, y: 219
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted logos */}
            <div className="mt-10 border-t border-slate-200 pt-6">
              <div className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                The forensic standard for tier-1 referencing agencies and fraud operations.
              </div>

              <div className="mt-5 flex items-center justify-between gap-6">
                {[
                  "REFERENCING AGENCIES",
                  "LETTING PLATFORMS",
                  "BUILD-TO-RENT OPS",
                  "FRAUD INVESTIGATORS",
                  "COMPLIANCE TEAMS",
                ].map((label) => (
                  <div
                    key={label}
                    className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        {/* End hero shell — ROI + features must sit OUTSIDE this wrapper or the absolute bg-white
            layer stretches to full wrapper height and paints over in-flow sections below. */}

        {/* Cost of Fraud ROI section */}
        <RoiCalculator />

        <BouncyCardsFeatures />
      </div>

      {/* Local animation keyframes */}
      <style jsx>{`
        @keyframes shiny-text {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes blob-slow {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(15px, -25px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes blob-slower {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-30px, 20px, 0) scale(1.08);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes blob-slowest {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, 35px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .animate-blob-slow {
          animation: blob-slow 22s ease-in-out infinite alternate;
        }
        .animate-blob-slower {
          animation: blob-slower 28s ease-in-out infinite alternate;
        }
        .animate-blob-slowest {
          animation: blob-slowest 32s ease-in-out infinite alternate;
        }
      `}</style>
    </main>
  );
}

