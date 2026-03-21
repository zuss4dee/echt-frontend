"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, X } from "lucide-react";
import { EchtWordmark } from "@/components/EchtLogo";
import { LiquidEther } from "@/components/ui/liquid-ether";
import Silk from "@/components/ui/silk";
import { InteractiveHoverButton } from "@/registry/magicui/interactive-hover-button";
import { BouncyCardsFeatures } from "@/components/marketing/BouncyCardsFeatures";
import { PricingSection } from "@/components/marketing/PricingSection";
import { RoiCalculator } from "@/components/marketing/RoiCalculator";
import { ContactUsModal } from "@/components/marketing/ContactUsModal";
import { echtSocialLinks } from "@/lib/social-links";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col pb-12">
        {/* Hero: full-viewport silk + glass nav / center stack (reference layout) */}
        <div className="relative min-h-svh w-full overflow-hidden text-white">
          <Silk
            speed={5}
            scale={1}
            color="#453268"
            noiseIntensity={1.5}
            rotation={0}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0f2a]/40 via-transparent to-[#0f0618]/80"
            aria-hidden
          />

          <div className="relative z-10 flex min-h-svh flex-col">
            <div className="mx-auto w-full max-w-5xl px-3 pt-4 sm:px-6 sm:pt-6">
              <header className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 rounded-full border border-white/20 bg-white/10 px-3 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:gap-3 sm:px-6 sm:py-3">
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                  <Link
                    href="/"
                    className="shrink-0 rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-white/80"
                    aria-label="Echt home"
                  >
                    <EchtWordmark className="h-6 w-auto shrink-0 text-white sm:h-8" />
                  </Link>
                </div>
                <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-2 text-xs font-medium text-white/85 sm:flex-none sm:gap-6 sm:text-[13px] md:gap-8">
                  <Link
                    href="/login"
                    className="shrink-0 py-1 transition-colors hover:text-white sm:py-0"
                  >
                    Platform
                  </Link>
                  <button
                    type="button"
                    className="shrink-0 py-1 transition-colors hover:text-white sm:py-0"
                    onClick={() => scrollToId("security")}
                  >
                    Security
                  </button>
                  <button
                    type="button"
                    className="shrink-0 py-1 transition-colors hover:text-white sm:py-0"
                    onClick={() => setContactOpen(true)}
                  >
                    Contact us
                  </button>
                  <div className="hidden h-4 w-px shrink-0 bg-white/25 md:block" aria-hidden />
                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                    <a
                      href={echtSocialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
                      aria-label="X"
                    >
                      <X className="h-3.5 w-3.5 sm:h-3.5" />
                    </a>
                    <a
                      href={echtSocialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={echtSocialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:h-8 sm:w-8"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </nav>
              </header>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-3 pb-12 pt-8 sm:px-4 sm:pb-24 sm:pt-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 shadow-sm backdrop-blur-md">
                <span
                  className="h-1 w-8 rounded-full bg-gradient-to-r from-violet-400 via-white to-cyan-300 opacity-90"
                  aria-hidden
                />
                <span>Forensic pipeline</span>
              </div>

              <h1 className="mt-6 max-w-4xl text-balance px-1 text-center text-[clamp(1.85rem,6.5vw,2.5rem)] font-semibold leading-[1.08] tracking-tight text-white sm:mt-8 sm:px-0 sm:text-6xl md:text-7xl">
                Prove the truth
                <br />
                behind every document.
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-balance px-1 text-center text-[15px] leading-relaxed text-white/75 sm:mt-6 sm:px-0 sm:text-base">
                The forensic layer for tenant referencing. Deep scans on payslips, bank
                statements, and IDs so you catch tampering before approvals.
              </p>

              <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                {/* `!` beats hero ancestor `text-white`. Do not use CSS vars that force white foreground here. */}
                <InteractiveHoverButton
                  type="button"
                  onClick={() => scrollToId("pricing")}
                  className="w-full justify-center rounded-full border-0 !bg-white px-6 py-3 !text-slate-900 shadow-lg transition-colors hover:!bg-black hover:!text-white group-hover:!text-white hover:shadow-md sm:w-auto sm:min-w-[180px] sm:px-8"
                >
                  Run a Free Scan
                </InteractiveHoverButton>
                <button
                  type="button"
                  className="w-full min-h-[44px] rounded-full border border-white/35 bg-white/10 px-6 py-3 text-[14px] font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto sm:min-w-[180px] sm:px-8"
                  onClick={() => scrollToId("how-echt-works")}
                >
                  How Echt works
                </button>
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10 bg-black/20 px-3 py-6 backdrop-blur-md sm:px-8 sm:py-8">
              <p className="text-balance text-center text-[10px] font-medium uppercase leading-snug tracking-[0.18em] text-white/70 sm:text-[11px] sm:tracking-[0.2em]">
                The forensic standard for tier-1 referencing agencies and fraud operations.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-5 sm:gap-x-8 sm:gap-y-3 sm:justify-between">
                {[
                  "REFERENCING AGENCIES",
                  "LETTING PLATFORMS",
                  "BUILD-TO-RENT OPS",
                  "FRAUD INVESTIGATORS",
                  "COMPLIANCE TEAMS",
                ].map((label) => (
                  <div
                    key={label}
                    className="max-w-[11rem] text-center text-[9px] font-medium uppercase leading-tight tracking-[0.12em] text-white/80 sm:max-w-none sm:whitespace-nowrap sm:text-[11px] sm:tracking-[0.14em]"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* End hero */}

        {/* Cost of Fraud ROI section */}
        <RoiCalculator />

        <BouncyCardsFeatures onRunFreeScan={() => scrollToId("pricing")} />

        <PricingSection />

        {/* Final CTA */}
        <section className="w-full bg-black py-12 sm:py-24">
          <div className="w-full">
            <div className="relative min-h-[380px] h-[min(560px,calc(100svh-8rem))] overflow-hidden border-y border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:h-[560px] sm:min-h-0">
              <LiquidEther
                className="absolute inset-0 z-0 h-full w-full"
                colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                mouseForce={20}
                cursorSize={100}
                isViscous
                viscous={30}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo
                autoSpeed={0.5}
                autoIntensity={3.4}
                takeoverDuration={0.25}
                autoResumeDelay={3000}
                autoRampDuration={0.6}
                color0="#5227FF"
                color1="#FF9FFC"
                color2="#B19EEF"
              />
              {/* Lighter vignette so LiquidEther stays visible; text relies on shadow + slight edge darkening */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_130%_90%_at_50%_45%,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.22)_42%,rgba(0,0,0,0.58)_100%)]" />

              <div className="absolute inset-0 z-30 flex items-center justify-center px-4 py-10 text-center text-white sm:px-12 sm:py-0">
                <div className="w-full max-w-4xl">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:mb-6 sm:text-sm sm:tracking-[0.2em]">
                    Built for referencing teams
                  </p>
                  <h2 className="mx-auto max-w-3xl text-balance text-[clamp(1.65rem,5.5vw,2.25rem)] font-semibold leading-tight tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.82),0_1px_3px_rgba(0,0,0,0.95)] sm:text-6xl sm:leading-none">
                    Stop fraud before approvals are made.
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:mt-5 sm:text-base md:text-lg">
                    Run forensic checks on payslips, bank statements, and IDs in
                    seconds with audit-ready evidence.
                  </p>

                  <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mx-auto sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:items-center">
                    <InteractiveHoverButton
                      type="button"
                      onClick={() => scrollToId("pricing")}
                      className="w-full justify-center border-white/10 !bg-white !text-zinc-900 transition-colors hover:!bg-slate-900 hover:!text-white group-hover:!text-white sm:w-auto"
                    >
                      Run a Free Scan
                    </InteractiveHoverButton>
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                      className="group relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 p-2 px-6 py-3 text-center text-[14px] font-semibold text-white no-underline shadow-sm backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 sm:w-auto"
                    >
                      Contact us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="security"
          className="scroll-mt-24 w-full border-b border-zinc-200 bg-zinc-50 py-16 sm:py-24 md:py-32"
        >
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="mb-3 text-sm font-semibold tracking-widest text-purple-600 uppercase">
              At a glance
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-600 sm:mb-14">
              Hard numbers you can plan around, with no vanity metrics and no borrowed case studies.
            </p>
            <div className="grid gap-12 md:grid-cols-3 md:gap-10">
              <div className="flex flex-col items-center text-center">
                <p className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                  &lt;3s
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-800">
                  Per document
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
                  Target forensic pass time for a typical payslip, bank statement, or ID: metadata,
                  tamper signals, and anomaly flags in one run.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                  0
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-800">
                  Stored copies
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
                  Zero-retention processing: files analyzed in memory, not kept on disk or used
                  to train models.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                  1
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-zinc-800">
                  Workflow
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600">
                  Same queue for layered PDFs, exports, and edits. Evidence is surfaced as structured
                  output your team can sign off on.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black py-12 text-sm text-zinc-500 sm:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:gap-12 sm:px-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="inline-block rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-white/70" aria-label="Echt home">
                <EchtWordmark className="mb-4 h-8 w-auto text-white" />
              </Link>
              <p className="mb-4 text-zinc-500">
                The forensic standard for document integrity.
              </p>
              <p className="mb-6 text-zinc-600">© {new Date().getFullYear()} Echt Ltd.</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={echtSocialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
                  aria-label="Echt on X"
                >
                  <X className="h-4 w-4" />
                </a>
                <a
                  href={echtSocialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
                  aria-label="Echt on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={echtSocialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
                  aria-label="Echt on Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            <nav className="flex flex-col gap-3 sm:flex-row sm:gap-8" aria-label="Footer">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-left font-medium text-zinc-400 transition-colors hover:text-white sm:text-center"
              >
                Contact us
              </button>
              <Link
                href="/faq"
                className="font-medium text-zinc-400 transition-colors hover:text-white"
              >
                FAQ
              </Link>
            </nav>
          </div>
        </footer>
      </div>

      <ContactUsModal open={contactOpen} onOpenChange={setContactOpen} />

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
