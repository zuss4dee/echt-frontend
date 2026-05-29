"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const FIELDS = [
  { k: "ORGANISATION", ph: "Legal entity" },
  { k: "PORTFOLIO SIZE", ph: "Units under management" },
  { k: "JURISDICTION", ph: "GB / EU / US" },
  { k: "CONTACT — SECURE", ph: "Encrypted channel" },
];

export function Clearance() {
  const [step, setStep] = useState(0);

  return (
    <section id="clearance" className="relative border-t border-hairline py-32">
      <div className="mx-auto max-w-[1600px] px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <span className="label-micro text-muted-foreground">05 / 05 — CLEARANCE</span>
          </div>

          <div className="col-span-12 md:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif max-w-[14ch] text-[clamp(56px,9vw,140px)] text-foreground"
            >
              Request <span className="italic">access</span>.
            </motion.h2>

            <div className="mt-16 border border-foreground bg-background">
              {/* clearance header */}
              <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-verdict-green" />
                  <span className="label-micro">SECURE INTAKE · TLS 1.3</span>
                </div>
                <span className="label-micro text-muted-foreground">CLEARANCE FORM · 01 / 01</span>
              </div>

              <div className="grid grid-cols-1 gap-px bg-hairline md:grid-cols-2">
                {FIELDS.map((f, i) => (
                  <motion.label
                    key={f.k}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    onFocus={() => setStep(i + 1)}
                    className="group block bg-background p-8 transition-colors focus-within:bg-foreground/[0.02]"
                  >
                    <span className="label-micro text-muted-foreground">{String(i + 1).padStart(2, "0")} · {f.k}</span>
                    <input
                      className="mt-6 w-full border-b border-hairline bg-transparent pb-2 font-sans text-2xl text-foreground outline-none transition-colors focus:border-foreground"
                      placeholder={f.ph}
                    />
                  </motion.label>
                ))}
              </div>

              {/* footer */}
              <div className="flex flex-col items-start justify-between gap-6 border-t border-foreground px-6 py-6 md:flex-row md:items-center">
                <div className="flex items-center gap-6">
                  <span className="label-micro text-muted-foreground">CLEARANCE LEVEL</span>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-2 w-8 transition-colors ${
                          i < step ? "bg-verdict-green" : "bg-hairline"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="label-micro text-foreground">{step}/4</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className="group inline-flex items-center gap-4 bg-foreground px-8 py-5 text-background"
                >
                  <span className="label-micro">SUBMIT FOR REVIEW</span>
                  <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                </motion.button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 label-micro text-muted-foreground">
              <span>SOC 2 TYPE II</span>
              <span>ISO 27001</span>
              <span>UK GDPR</span>
              <span>ZERO RETENTION OPT-IN</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-32 flex max-w-[1600px] items-center justify-between border-t border-hairline px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-foreground" />
          <span className="label-micro">ECHT — © 2026</span>
        </div>
        <span className="label-micro text-muted-foreground">FORENSIC INTEGRITY · LONDON</span>
      </footer>
    </section>
  );
}
