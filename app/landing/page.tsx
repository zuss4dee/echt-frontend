 "use client";

import { motion } from "framer-motion";

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
        className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-6 sm:px-10 lg:px-20"
      >
        {/* Top nav */}
        <header className="flex items-center justify-between text-sm font-medium">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10">
              <span className="text-[11px] font-semibold tracking-tight">E</span>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">Echt</span>
          </div>

          {/* Center nav */}
          <nav className="hidden gap-8 text-[13px] text-white/70 sm:flex">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Technology</button>
            <button className="hover:text-white transition-colors">Developers</button>
            <button className="hover:text-white transition-colors">Blog</button>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-white/25 px-4 py-1.5 text-[12px] font-medium text-white/90 backdrop-blur-sm hover:bg-white/10 sm:inline-flex">
              Sign up
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[12px] font-medium text-black hover:bg-white/90">
              <span>Sign up</span>
              <span aria-hidden className="text-[11px]">
                ↗
              </span>
            </button>
          </div>
        </header>

        {/* Hero grid */}
        <div className="mt-16 flex flex-1 flex-col gap-10 lg:mt-24 lg:flex-row">
          {/* Left: main heading */}
          <div className="flex flex-1 items-center">
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight leading-[0.95] sm:text-7xl lg:text-[4.8rem]">
              Prove{" "}
              <span className="underline decoration-[1.5px] underline-offset-[0.18em]">
                who
              </span>{" "}
              and
              <br />
              <span className="underline decoration-[1.5px] underline-offset-[0.18em]">
                what
              </span>{" "}
              is real.
            </h1>
          </div>

          {/* Right: subcopy + buttons column (starts midway down) */}
          <div className="flex w-full flex-col justify-center gap-6 lg:w-[360px] lg:pt-32">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">
              Introducing proof of tenancy
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Echt combines deep document forensics with AI fraud detection so tenant
              referencing agencies and property managers can verify people and paperwork
              online before they get the keys.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-white/90">
                <span>Sign up</span>
                <span aria-hidden className="text-[12px]">
                  ↗
                </span>
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-transparent px-5 py-2 text-[13px] font-medium text-white hover:bg-white/5">
                <span>Integrate Echt</span>
                <span aria-hidden className="text-[12px]">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Local animation keyframes */}
      <style jsx>{`
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

