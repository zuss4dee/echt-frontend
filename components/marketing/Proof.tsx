"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
  staticDisplay,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
  staticDisplay?: string;
}) {
  if (staticDisplay) {
    return <span>{staticDisplay}</span>;
  }

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => {
    if (!compact) {
      return prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
    }

    const abs = Math.abs(v);
    if (abs >= 1000) {
      const k = Math.round(v / 1000);
      return `${prefix}${k}k${suffix}`;
    }

    return prefix + Math.round(v).toString() + suffix;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, mv]);

  useEffect(() => rounded.on("change", (v) => { if (ref.current) ref.current.textContent = v; }), [rounded]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const STATS = [
  {
    value: 100000,
    prefix: "£",
    label: "AVERAGE FRAUD PREVENTED / PORTFOLIO",
    compact: true,
    staticDisplay: "£100k",
  },
  { value: 82, suffix: "ms", label: "MEDIAN ANALYSIS LATENCY" },
];

export function Proof() {
  return (
    <section id="proof" className="relative border-t border-hairline py-20 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 md:col-span-3">
            <span className="label-micro text-muted-foreground">ENTERPRISE PROOF</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-serif max-w-[14ch] text-[clamp(36px,7vw,108px)] text-foreground"
            >
              Numbers <span className="italic">don't</span> lie. Documents sometimes do.
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 border border-hairline bg-background p-6 sm:mt-28 sm:p-10"
        >
          <p className="display-serif text-[clamp(24px,4vw,40px)] leading-[1.2] text-foreground">
            Proven to catch 99.4% of forged lease-break documents for top UK PBSA operators.
          </p>
        </motion.div>

        <div className="mt-px grid grid-cols-1 gap-px bg-hairline sm:grid-cols-2">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background p-6 sm:p-10"
            >
              <div className="display-serif text-[clamp(36px,5vw,80px)] text-foreground">
                <Counter
                  to={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  compact={s.compact}
                  staticDisplay={s.staticDisplay}
                />
              </div>
              <p className="mt-6 label-micro max-w-[18ch] text-muted-foreground sm:mt-8">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
