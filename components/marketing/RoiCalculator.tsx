"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiLock } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";

const TARGET_TEXT = "Protect your portfolio ->";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

function ProtectPortfolioEncryptButton() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(TARGET_TEXT);

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) clearInterval(intervalRef.current);
    };
  }, []);

  const stopScramble = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setText(TARGET_TEXT);
  };

  const scramble = () => {
    stopScramble();
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          return CHARS[randomCharIndex] ?? "?";
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className="group relative inline-flex overflow-hidden rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-[12px] font-mono font-semibold uppercase tracking-wide text-slate-800 transition-colors hover:border-purple-500/50 hover:text-purple-700"
    >
      <div className="relative z-10 flex items-center gap-2">
        <FiLock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{text}</span>
      </div>
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="pointer-events-none absolute inset-0 z-0 scale-125 bg-gradient-to-t from-purple-400/0 from-40% via-purple-400/40 to-purple-400/0 to-60% opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.button>
  );
}

/** No opacity in variants; fading the whole card made it vanish on white / with scroll-in. */
const cardVariants: Variants = {
  offscreen: {
    y: 48,
    rotate: -2,
  },
  onscreen: {
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.35,
      duration: 1.15,
    },
  },
};

const FRAUD_CASES_PER_1000_APPLICATIONS = 2.9;
const FRAUD_RATE = FRAUD_CASES_PER_1000_APPLICATIONS / 1000;
const COST_PER_COMPROMISED_TENANCY_GBP = 31_886;

const SLIDER_MIN = 5;
const SLIDER_MAX = 1000;

export function RoiCalculator() {
  const [tenanciesPerMonth, setTenanciesPerMonth] = useState<number>(250);

  const annualExposure = useMemo(() => {
    return tenanciesPerMonth * 12 * FRAUD_RATE * COST_PER_COMPROMISED_TENANCY_GBP;
  }, [tenanciesPerMonth]);

  const { projectedFraudulentDisplay } = useMemo(() => {
    const raw = tenanciesPerMonth * 12 * FRAUD_RATE;
    const rounded = Math.round(raw);
    const projectedFraudulentDisplay =
      raw > 0 && rounded === 0
        ? "< 1"
        : rounded.toLocaleString("en-GB");
    return { projectedFraudulentDisplay };
  }, [tenanciesPerMonth]);

  return (
    <section className="bg-slate-50 py-16 sm:py-20 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-0">
        <div className="relative z-10 mb-6">
          <p className="text-sm font-medium uppercase tracking-widest text-purple-600">
            COST OF INACTION
          </p>
          <h2 className="mb-8 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:mb-10 sm:text-4xl">
            The math you can’t afford to ignore.
          </h2>
        </div>

        <motion.div
          className="relative z-10 rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 sm:p-10 md:p-12"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
        >
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Left column: input */}
            <div className="space-y-6">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Calculate your annual exposure.
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">Use the slider</span> to match
                  how many tenant applications your team references in an average month (small
                  letting desks to large platforms).
                </p>

                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-slate-600">
                  <span>
                    Monthly referencing volume:{" "}
                    <span className="font-semibold text-slate-900">
                      {tenanciesPerMonth.toLocaleString("en-GB")}
                    </span>{" "}
                    applications
                  </span>
                  <span className="text-xs text-slate-500">
                    {SLIDER_MIN.toLocaleString("en-GB")} to {SLIDER_MAX.toLocaleString("en-GB")} / month
                  </span>
                </div>

                <input
                  type="range"
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={1}
                  value={tenanciesPerMonth}
                  onChange={(e) => setTenanciesPerMonth(Number(e.target.value))}
                  aria-label="Monthly tenancy applications"
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#a855f7]"
                />
              </div>
            </div>

            {/* Right column: output */}
            <div className="flex flex-col md:items-end">
              <div className="flex w-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
                <div className="w-full min-w-0">
                  <div className="flex flex-col gap-1 text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="max-w-none text-sm leading-snug sm:max-w-[min(100%,14rem)] md:max-w-none">
                      Applications flagged as fraudulent / year (
                      {FRAUD_CASES_PER_1000_APPLICATIONS} per 1,000)
                    </span>
                    <span className="shrink-0 text-left tabular-nums sm:text-right">
                      {projectedFraudulentDisplay} / yr
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="text-sm">Avg. cost per problem tenancy (eviction band)</span>
                    <span className="shrink-0 text-left tabular-nums sm:text-right">
                      £{COST_PER_COMPROMISED_TENANCY_GBP.toLocaleString("en-GB")}
                    </span>
                  </div>

                  <div className="my-6 border-t border-slate-200" />

                  <div className="space-y-4">
                    <div className="text-[12px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      Estimated Annual Fraud Exposure
                    </div>
                    <div className="relative inline-block max-w-full overflow-x-auto">
                      {/* Solid fallback if gradient clip is unsupported */}
                      <span
                        className="text-4xl font-bold tabular-nums tracking-tight text-violet-700 sm:text-5xl md:text-6xl"
                        aria-hidden
                      >
                        £{Math.round(annualExposure).toLocaleString("en-GB")}
                      </span>
                      <span className="absolute left-0 top-0 text-4xl font-bold tabular-nums tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] sm:text-5xl md:text-6xl">
                        £{Math.round(annualExposure).toLocaleString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <ProtectPortfolioEncryptButton />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
