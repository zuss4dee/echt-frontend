 "use client";

import { motion } from "framer-motion";
import Image from "next/image";
import UnicornScene from "unicornstudio-react/next";
import { EchtWordmark } from "@/components/EchtLogo";
import { Highlighter } from "@/components/ui/highlighter";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Safari } from "@/components/ui/safari";

export default function LandingHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background video + mesh gradient aura */}
      <div className="pointer-events-none absolute inset-0">
        {/* Video base – make sure /public/flow-gradient.webm exists */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/flow-gradient.webm"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Soft color blobs on top of video */}
        <div className="absolute -top-1/3 -left-1/4 h-[70vh] w-[70vh] rounded-full bg-[#4B00E0] opacity-35 blur-3xl animate-blob-slow" />
        <div className="absolute top-1/2 -right-1/4 h-[60vh] w-[60vh] rounded-full bg-[#2D0066] opacity-45 blur-3xl animate-blob-slower" />
        <div className="absolute -bottom-1/3 left-1/3 h-[65vh] w-[65vh] rounded-full bg-[#000000] opacity-60 blur-3xl animate-blob-slowest" />

        {/* Grain / noise overlay via SVG filter */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='noStitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="relative z-10 flex min-h-screen flex-col px-4 pb-12 pt-6 sm:px-8 lg:px-14"
      >
        {/* Light/airy foreground shell */}
        <div className="mx-auto w-full max-w-6xl">
          {/* Top nav (Zest-style) */}
          <header className="flex items-center justify-between gap-4 rounded-full bg-white/10 px-4 py-3 text-[13px] text-white shadow-[0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl ring-1 ring-white/15 sm:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <EchtWordmark className="h-8 w-auto" />
            </div>

            {/* Center nav */}
            <nav className="hidden items-center gap-6 text-white/80 md:flex">
              <button className="hover:text-white transition-colors">Platform</button>
              <button className="hover:text-white transition-colors">Security</button>
              <button className="hover:text-white transition-colors">Enterprise</button>
              <button className="hover:text-white transition-colors">&nbsp;</button>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="hidden text-white/80 hover:text-white transition-colors sm:inline-flex drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                Login
              </button>
              <div className="[--primary:oklch(0.205_0_0)] [--primary-foreground:oklch(0.985_0_0)]">
                <InteractiveHoverButton className="border-white/20 bg-white text-slate-950 shadow-sm">
                  Start Scanning
                </InteractiveHoverButton>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="mt-10 rounded-[32px] bg-white/10 px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-white/15 sm:px-10 sm:py-14">
            {/* Small badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-xl ring-1 ring-white/10">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white text-[10px]">
                  ⚡
                </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.95), rgba(255,255,255,0.4))",
                    backgroundSize: "200% 100%",
                    animation: "shiny-text 3s linear infinite",
                  }}
                >
                  Catch forged documents before they become tenancy fraud
                </span>
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-white/80 text-[10px] ring-1 ring-white/10">
                  i
                </span>
              </div>
            </div>

            {/* Heading + subcopy */}
            <div className="mt-8 text-center">
              <h1 className="mx-auto max-w-3xl font-sans text-4xl leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:text-6xl">
                Prove the truth behind
                <br />
                every{" "}
                <Highlighter
                  action="highlight"
                  color="#87CEFA"
                  animationDuration={900}
                >
                  <span className="font-bold">document</span>
                </Highlighter>
                .
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-white/85 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:text-[14px]">
                Echt is the forensic layer for modern referencing. We automate the deep-scan of payslips, bank statements, and IDs to identify pixel-level manipulations and AI-generated fraud before they reach your desk.
              </p>
            </div>

            {/* Media row */}
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
              {/* Left box: two stacked cards */}
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-white/10 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-xl">
                <div className="absolute inset-0 opacity-[0.55]">
                  <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#4B00E0]/10 blur-3xl" />
                  <div className="absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-[#2D0066]/10 blur-3xl" />
                </div>

                {/* Card 1: portrait + Pixel-Level Forensics */}
                <div className="relative flex-1 min-h-0">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-inner">
                    <Image
                      src="/ai-model.png"
                      alt="AI model portrait"
                      fill
                      priority
                      sizes="(min-width: 1024px) 26vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl bg-black/30 px-4 py-3 text-[12px] text-white/85 shadow-sm backdrop-blur-xl ring-1 ring-white/15">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-white">Pixel-Level Forensics</div>
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
                        <div className="mt-0.5 text-[11px] text-white/70">Surfaces splice and recompress artifacts</div>
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

              {/* Right media card: Safari mockup with placeholder image */}
              <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-xl">
                <div className="absolute inset-0">
                  <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#4B00E0]/15 blur-3xl" />
                  <div className="absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-[#2D0066]/15 blur-3xl" />
                </div>

                <div className="relative rounded-2xl border border-white/20 bg-black/20 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[12px] font-semibold text-white">
                        Echt Forensic Viewer
                      </div>
                      <div className="mt-1 text-[11px] text-white/70">
                        Live document inspection in browser
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <Safari
                      url="app.useecht.com/dashboard"
                      frameSrc="/dashboard"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trusted logos */}
            <div className="mt-10 border-t border-white/5 pt-6">
              <div className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                The forensic standard for tier-1 referencing agencies and fraud operations.
              </div>

              <div className="mt-5 flex items-center justify-between gap-6 opacity-30">
                {[
                  "REFERENCING AGENCIES",
                  "LETTING PLATFORMS",
                  "BUILD-TO-RENT OPS",
                  "FRAUD INVESTIGATORS",
                  "COMPLIANCE TEAMS",
                ].map((label) => (
                  <div
                    key={label}
                    className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-white"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </motion.div>

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

