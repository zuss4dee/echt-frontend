"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const META = [
  { k: "STATUS", v: "INTAKE / SCAN ACTIVE" },
  { k: "DOC.ID", v: "ECHT-9F2-A71B" },
  { k: "ENGINE", v: "FORENSIC v4.21" },
  { k: "LATENCY", v: "82ms" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scanY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* top hairline meta bar */}
      <div className="absolute inset-x-0 top-0 z-20 border-b border-hairline">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-verdict-green" />
            <span className="label-micro text-foreground">ECHT — FORENSIC INTEGRITY</span>
          </div>
          <nav className="hidden items-center gap-10 md:flex">
            <a className="label-micro text-muted-foreground hover:text-foreground transition" href="#proof">Proof</a>
            <a className="label-micro text-muted-foreground hover:text-foreground transition" href="#engine">Engine</a>
            <a className="label-micro text-muted-foreground hover:text-foreground transition" href="#partners">Partners</a>
            <a className="label-micro text-muted-foreground hover:text-foreground transition" href="#clearance">Contact</a>
            <Link className="label-micro text-muted-foreground hover:text-foreground transition" href="/login">Sign in</Link>
          </nav>
          <span className="label-micro text-muted-foreground">v 4.21 / LON</span>
        </div>
      </div>

      {/* corner indices */}
      <div className="pointer-events-none absolute left-8 top-1/2 z-10 -translate-y-1/2">
        <div className="flex flex-col gap-6 label-micro text-muted-foreground">
          <span>01 / 05</span>
          <span className="h-24 w-px bg-foreground/30" />
          <span>HERO</span>
        </div>
      </div>
      <div className="pointer-events-none absolute right-8 top-1/2 z-10 -translate-y-1/2">
        <div className="flex flex-col items-end gap-3 label-micro text-muted-foreground">
          {META.map((m) => (
            <div key={m.k} className="flex items-center gap-3">
              <span>{m.k}</span>
              <span className="text-foreground">{m.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* center stage */}
      <div className="relative z-0 flex min-h-screen items-center justify-center px-8 pt-24">
        <motion.div style={{ y }} className="relative w-full max-w-[1100px]">
          {/* headline */}
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif text-[clamp(72px,14vw,220px)] text-foreground"
            >
              Absolute<br />
              <span className="italic">truth</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mx-auto mt-10 max-w-md label-micro text-muted-foreground"
            >
              FORENSIC VERIFICATION FOR ENTERPRISE TENANT REFERENCING
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 flex items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center bg-foreground px-8 py-4 text-primary-foreground label-micro transition-colors hover:bg-foreground/90"
              >
                <span className="relative z-10">Request Access</span>
                <span className="absolute inset-y-0 right-0 w-px bg-primary-foreground/20" />
                <span className="ml-3 text-primary-foreground/60 transition-colors group-hover:text-primary-foreground">→</span>
              </Link>
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center border border-hairline px-8 py-4 text-foreground label-micro transition-colors hover:border-foreground/30 hover:bg-foreground/[0.02]"
              >
                <span>Open Echt AI</span>
                <span className="ml-3 text-muted-foreground">→</span>
              </Link>
            </motion.div>
          </div>

          {/* suspended document */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-20 w-full max-w-[640px]"
          >
            {/* shadow plate */}
            <div className="absolute -inset-x-12 -bottom-10 h-24 bg-foreground/5 blur-2xl" />
            <div className="relative aspect-[1/1.34] border border-foreground/15 bg-card shadow-[0_40px_80px_-30px_rgba(20,20,30,0.25),0_8px_24px_-12px_rgba(20,20,30,0.15)]">
              {/* doc header */}
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <span className="label-micro text-muted-foreground">PAYSLIP_MARCH.PDF</span>
                <span className="label-micro text-muted-foreground">2.3 MB</span>
              </div>
              {/* doc body */}
              <div className="space-y-3 px-6 py-6">
                <div className="h-3 w-2/3 bg-foreground/80" />
                <div className="h-2 w-1/2 bg-foreground/20" />
                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-1.5 w-1/2 bg-foreground/15" />
                      <div className="h-2.5 w-3/4 bg-foreground/60" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-foreground/10" />
                      <div className="h-2 w-12 bg-foreground/40" />
                    </div>
                  ))}
                </div>
              </div>

              {/* scan line */}
              <motion.div
                style={{ top: scanY }}
                className="pointer-events-none absolute inset-x-0 h-px bg-verdict-green shadow-[0_0_18px_2px_var(--verdict-green)]"
              />
              {/* scan glow band */}
              <motion.div
                style={{ top: scanY }}
                className="pointer-events-none absolute inset-x-0 -mt-16 h-32 bg-gradient-to-b from-transparent via-verdict-green/5 to-transparent"
              />

              {/* corner brackets */}
              {[
                "left-2 top-2 border-l border-t",
                "right-2 top-2 border-r border-t",
                "left-2 bottom-2 border-l border-b",
                "right-2 bottom-2 border-r border-b",
              ].map((c) => (
                <span key={c} className={`absolute h-3 w-3 border-foreground ${c}`} />
              ))}
            </div>

            {/* annotation */}
            <div className="mt-6 flex items-center justify-between label-micro text-muted-foreground">
              <span>SCAN — PIXEL LEVEL</span>
              <span className="text-verdict-green">● INTEGRITY 99.4%</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
