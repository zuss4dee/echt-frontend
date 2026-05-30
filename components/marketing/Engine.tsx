"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FILE_DNA = [
  { k: "MIME", v: "application/pdf" },
  { k: "PRODUCER", v: "Adobe Acrobat 23.0" },
  { k: "CREATED", v: "2024-03-04 09:14:22Z" },
  { k: "MODIFIED", v: "2024-03-04 14:38:51Z" },
  { k: "FONTS", v: "Helvetica, Courier (embedded)" },
  { k: "HASH (SHA-256)", v: "a91f…0c2e" },
  { k: "DEVICE", v: "MacBook Pro 14, macOS 14.3" },
];

const HISTORY = [
  { t: "09:14", a: "CREATED", src: "payroll@verdantco.com", flag: "ok" },
  { t: "11:02", a: "EXPORTED", src: "Chrome 121, GB", flag: "ok" },
  { t: "14:38", a: "RE-SAVED", src: "Preview.app — pages re-rendered", flag: "warn" },
  { t: "14:41", a: "FIELD EDIT", src: "Net Pay £3,200 → £4,400", flag: "alert" },
  { t: "15:02", a: "SUBMITTED", src: "applicant@—.io", flag: "ok" },
];

export function Engine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const heatY = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const docY = useTransform(scrollYProgress, [0, 1], [40, -60]);

  return (
    <section id="engine" ref={ref} className="relative border-t border-hairline py-20 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-3">
            <span className="label-micro text-muted-foreground">03 / 05 — THE ENGINE</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif max-w-[16ch] text-[clamp(36px,7vw,108px)] text-foreground"
            >
              Every file carries a <span className="italic">past</span>.
            </motion.h2>
            <p className="mt-10 max-w-[44ch] text-lg text-muted-foreground">
              ECHT reconstructs the lifecycle of every document — from the device it was first printed on, to the second it was tampered with. No heuristics. Just provenance.
            </p>
          </div>
        </div>

        <div className="relative mt-16 grid grid-cols-12 gap-6 sm:mt-24">
          {/* LEFT: payslip with heatmap */}
          <motion.div style={{ y: docY }} className="col-span-12 lg:col-span-5">
            <div className="border border-hairline">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
                <span className="label-micro text-muted-foreground">PAYSLIP_MARCH.PDF</span>
                <span className="label-micro text-verdict-red">● TAMPER DETECTED</span>
              </div>
              <div className="relative aspect-[1/1.25] bg-card p-6">
                <div className="space-y-2">
                  <div className="h-3 w-1/2 bg-foreground/70" />
                  <div className="h-2 w-1/3 bg-foreground/20" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                  {["Employer","PAYE Ref","Employee","NI Number","Period","Tax Code","Gross Pay","Net Pay"].map((l,i)=>(
                    <div key={l} className="space-y-1">
                      <div className="label-micro text-muted-foreground">{l}</div>
                      <div className={`h-2.5 ${i===7?"w-2/3 bg-verdict-red":"w-3/4 bg-foreground/60"}`} />
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-foreground/10" />
                      <div className={`h-2 w-12 ${i===3?"bg-verdict-red":"bg-foreground/40"}`} />
                    </div>
                  ))}
                </div>

                {/* parallax heatmap blob over Net Pay */}
                <motion.div
                  style={{ y: heatY }}
                  className="pointer-events-none absolute right-6 top-[58%] h-24 w-40 border border-verdict-red/50"
                >
                  <div className="absolute inset-0 bg-verdict-red/10" />
                  <div className="absolute -top-5 left-0 label-micro text-verdict-red">ANOMALY · 97%</div>
                  <div className="absolute -bottom-5 right-0 label-micro text-verdict-red">+£1,200 EDIT</div>
                </motion.div>
              </div>
            </div>
            <div className="mt-4 flex justify-between label-micro text-muted-foreground">
              <span>SOURCE FILE</span>
              <span>HEATMAP · LIVE</span>
            </div>
          </motion.div>

          {/* MIDDLE: file DNA */}
          <div className="col-span-12 lg:col-span-4">
            <div className="border border-hairline bg-card">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
                <span className="label-micro text-muted-foreground">FILE DNA</span>
                <span className="label-micro text-muted-foreground">METADATA</span>
              </div>
              <ul>
                {FILE_DNA.map((row, i) => (
                  <motion.li
                    key={row.k}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                    className="flex items-center justify-between border-b border-hairline px-5 py-4 last:border-b-0"
                  >
                    <span className="label-micro text-muted-foreground">{row.k}</span>
                    <span className="font-mono text-[13px] text-foreground">{row.v}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: export history + verdict */}
          <div className="col-span-12 lg:col-span-3">
            <div className="border border-hairline bg-card">
              <div className="border-b border-hairline px-5 py-3">
                <span className="label-micro text-muted-foreground">EXPORT HISTORY</span>
              </div>
              <ul className="px-5 py-4">
                {HISTORY.map((h, i) => (
                  <motion.li
                    key={h.t}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="relative grid grid-cols-[40px_1fr] gap-3 pb-5 last:pb-0"
                  >
                    <div className="label-micro text-muted-foreground">{h.t}</div>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 ${h.flag === "alert" ? "bg-verdict-red" : h.flag === "warn" ? "bg-foreground" : "bg-verdict-green"}`} />
                        <span className="label-micro text-foreground">{h.a}</span>
                      </div>
                      <p className="mt-1 text-[12px] text-muted-foreground">{h.src}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border border-verdict-red bg-card p-5">
              <span className="label-micro text-verdict-red">VERDICT</span>
              <div className="mt-3 display-serif text-3xl text-verdict-red">Forgery</div>
              <p className="mt-2 text-[12px] text-muted-foreground">Net Pay field modified post-export. Re-saved through unauthorised renderer.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
