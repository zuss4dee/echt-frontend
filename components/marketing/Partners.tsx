"use client";

import { motion } from "framer-motion";

const THREAT_AUDIT_MAILTO =
  "mailto:hello@useecht.com?subject=Free%20Threat%20Audit%20Request";

const CTA_BASE_CLASS =
  "group inline-flex w-full items-center gap-4 border border-background/30 px-7 py-5 transition hover:border-background";

const TIERS = [
  { k: "STANDARD ENTERPRISE", v: "API ACCESS", note: "FOR PBSA OPERATORS WITH 500+ BEDS." },
  { k: "DELTA", v: "INDEPENDENT AGENCIES", note: "LEASE-BREAK FRAUD REVIEW." },
];

export function Partners() {
  return (
    <section id="partners" className="relative border-t border-hairline bg-foreground py-20 text-background sm:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-3">
            <span className="label-micro text-background/50">ENTERPRISE</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center gap-4">
              <span className="h-2 w-2 bg-verdict-green" />
              <span className="label-micro text-background/70">STUDENT ACCOMMODATION FRAUD PREVENTION</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif mt-8 text-[clamp(40px,9vw,140px)] sm:mt-10"
            >
              Stop paying out on<br />
              <span className="italic text-background/60">forged cancellations.</span>
            </motion.h2>

            <div className="mt-12 grid grid-cols-1 gap-px bg-background/15 sm:mt-16 md:grid-cols-2">
              {TIERS.map((r) => (
                <div key={r.k} className="flex flex-col bg-foreground p-8">
                  <span className="label-micro text-background/50">{r.k}</span>
                  <div className="mt-6 display-serif text-4xl">{r.v}</div>
                  <p className="mt-3 label-micro text-background/60">{r.note}</p>

                  <a href={THREAT_AUDIT_MAILTO} className={`${CTA_BASE_CLASS} mt-10`}>
                    <span className="label-micro">BOOK A FREE THREAT AUDIT</span>
                    <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
