"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Partners() {
  return (
    <section id="partners" className="relative border-t border-hairline bg-foreground py-32 text-background">
      <div className="mx-auto max-w-[1600px] px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <span className="label-micro text-background/50">04 / 05 — SCARCITY</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-verdict-green" />
              <span className="label-micro text-background/70">FOUNDING PARTNER PROGRAMME · COHORT II</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif mt-10 text-[clamp(56px,9vw,140px)]"
            >
              Twelve seats.<br />
              <span className="italic text-background/60">Three remain.</span>
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 gap-px bg-background/15 md:grid-cols-3">
              {[
                { k: "FOUNDING PARTNER", v: "£2,400 / mo", note: "Locked. For life." },
                { k: "STANDARD ENTERPRISE", v: "£6,800 / mo", note: "From Q3 2026." },
                { k: "DELTA", v: "−65%", note: "Founders only." },
              ].map((r) => (
                <div key={r.k} className="bg-foreground p-8">
                  <span className="label-micro text-background/50">{r.k}</span>
                  <div className="mt-6 display-serif text-4xl">{r.v}</div>
                  <p className="mt-3 label-micro text-background/60">{r.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-4 border border-background/30 px-7 py-5 transition hover:border-background"
              >
                <span className="label-micro">REQUEST FOUNDING SEAT</span>
                <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
              </Link>
              <span className="label-micro text-background/50">SEATS REMAINING · 03</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
