"use client";

import { motion } from "framer-motion";

const POLAR_PHASE_ONE_CHECKOUT_URL =
  "https://buy.polar.sh/polar_cl_hR1DhJgacIxSK3pBVpIdie0gApFHyiAZ97FTO028dVK";

const CTA_BASE_CLASS =
  "group inline-flex w-full items-center gap-4 border border-background/30 px-7 py-5 transition hover:border-background";

const TIERS = [
  { k: "FOUNDING PARTNER", v: "£200 / mo", note: "LOCKED. FOR LIFE.", cta: "checkout" as const },
  { k: "STANDARD ENTERPRISE", v: "API ACCESS", note: "COMING LATER.", cta: "waitlist" as const },
  { k: "DELTA", v: "INDEPENDENT AGENCIES", note: "PHASE ONE ONLY.", cta: null },
];

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
              The Early Adopter Cohort.<br />
              <span className="italic text-background/60">Phase One Open.</span>
            </motion.h2>

            <div className="mt-16 grid grid-cols-1 gap-px bg-background/15 md:grid-cols-3">
              {TIERS.map((r) => (
                <div key={r.k} className="flex flex-col bg-foreground p-8">
                  <span className="label-micro text-background/50">{r.k}</span>
                  <div className="mt-6 display-serif text-4xl">{r.v}</div>
                  <p className="mt-3 label-micro text-background/60">{r.note}</p>

                  {r.cta === "checkout" ? (
                    <a
                      href={POLAR_PHASE_ONE_CHECKOUT_URL}
                      className={`${CTA_BASE_CLASS} mt-10`}
                    >
                      <span className="label-micro">SECURE PHASE ONE</span>
                      <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                    </a>
                  ) : null}

                  {r.cta === "waitlist" ? (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={`${CTA_BASE_CLASS} mt-10 cursor-not-allowed opacity-50 hover:border-background/30`}
                    >
                      <span className="label-micro">JOIN WAITLIST</span>
                      <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <span className="label-micro text-background/50">SEATS REMAINING · 50</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
