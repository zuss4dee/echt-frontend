"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";

const POLAR_PHASE_ONE_CHECKOUT_URL =
  "https://buy.polar.sh/polar_cl_hR1DhJgacIxSK3pBVpIdie0gApFHyiAZ97FTO028dVK";

const WAITLIST_SUBMIT_URL = "https://echt-backend.onrender.com/api/waitlist/submit";

const CTA_BASE_CLASS =
  "group inline-flex w-full items-center gap-4 border border-background/30 px-7 py-5 transition hover:border-background";

const TIERS = [
  { k: "FOUNDING PARTNER", v: "£200 / mo", note: "LOCKED. FOR LIFE.", cta: "checkout" as const },
  { k: "STANDARD ENTERPRISE", v: "API ACCESS", note: "COMING LATER.", cta: "waitlist" as const },
  { k: "DELTA", v: "INDEPENDENT AGENCIES", note: "PHASE ONE ONLY.", cta: null },
];

export function Partners() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistPending, setWaitlistPending] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    if (!waitlistOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !waitlistPending) {
        setWaitlistOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [waitlistOpen, waitlistPending]);

  function openWaitlistModal() {
    if (waitlistSuccess) return;
    setWaitlistError(null);
    setWaitlistOpen(true);
  }

  function closeWaitlistModal() {
    if (waitlistPending) return;
    setWaitlistOpen(false);
  }

  async function handleWaitlistSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (waitlistPending || waitlistSuccess) return;

    setWaitlistError(null);
    setWaitlistPending(true);

    try {
      const res = await fetch(WAITLIST_SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail }),
      });

      if (res.status === 200 || res.status === 201) {
        setWaitlistEmail("");
        setWaitlistSuccess(true);
        return;
      }

      setWaitlistError("Could not join waitlist. Please try again.");
    } catch {
      setWaitlistError("Could not join waitlist. Please try again.");
    } finally {
      setWaitlistPending(false);
    }
  }

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
                      onClick={openWaitlistModal}
                      disabled={waitlistSuccess}
                      className={`${CTA_BASE_CLASS} mt-10 disabled:cursor-default disabled:opacity-50 disabled:hover:border-background/30`}
                    >
                      <span className="label-micro">
                        {waitlistSuccess ? "ON WAITLIST" : "JOIN WAITLIST"}
                      </span>
                      {!waitlistSuccess ? (
                        <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                      ) : (
                        <span className="h-2 w-2 bg-verdict-green" aria-hidden />
                      )}
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

      <AnimatePresence>
        {waitlistOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close waitlist dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-[2px]"
              onClick={closeWaitlistModal}
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="waitlist-dialog-title"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto w-full max-w-md border border-hairline bg-background text-foreground shadow-[0_40px_80px_-30px_rgba(20,20,30,0.35)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 bg-verdict-green" />
                    <span className="label-micro text-muted-foreground">STANDARD ENTERPRISE · WAITLIST</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeWaitlistModal}
                    disabled={waitlistPending}
                    className="label-micro text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    CLOSE
                  </button>
                </div>

                {waitlistSuccess ? (
                  <div className="px-6 py-10" role="status" aria-live="polite">
                    <p className="label-micro text-muted-foreground">CONFIRMED</p>
                    <p
                      id="waitlist-dialog-title"
                      className="mt-4 display-serif text-[clamp(28px,4vw,36px)] leading-[1.15]"
                    >
                      Added to the waitlist.
                    </p>
                    <p className="mt-4 label-micro text-muted-foreground">
                      We will notify you when Standard Enterprise API access opens.
                    </p>
                    <button
                      type="button"
                      onClick={closeWaitlistModal}
                      className="mt-8 inline-flex items-center gap-4 bg-foreground px-7 py-4 text-background label-micro transition-colors hover:bg-foreground/90"
                    >
                      DONE
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-hairline px-6 py-6">
                      <h3 id="waitlist-dialog-title" className="display-serif text-3xl leading-[1.1]">
                        Join the waitlist.
                      </h3>
                      <p className="mt-3 label-micro text-muted-foreground">
                        Enter your work email. We will reach out when API access is available.
                      </p>
                    </div>

                    <form onSubmit={handleWaitlistSubmit} className="px-6 py-6">
                      <label className="block">
                        <span className="label-micro text-muted-foreground">EMAIL</span>
                        <input
                          type="email"
                          required
                          name="email"
                          autoFocus
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          disabled={waitlistPending}
                          placeholder="you@agency.com"
                          className="mt-4 w-full border-b border-hairline bg-transparent pb-3 font-sans text-xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground disabled:opacity-60"
                        />
                      </label>

                      {waitlistError ? (
                        <p className="mt-4 text-sm text-verdict-red" role="alert">
                          {waitlistError}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={waitlistPending}
                        className="group mt-8 inline-flex w-full items-center justify-center gap-4 bg-foreground px-7 py-5 text-background label-micro transition-colors hover:bg-foreground/90 disabled:cursor-default disabled:opacity-70"
                      >
                        <span>{waitlistPending ? "JOINING..." : "JOIN WAITLIST"}</span>
                        <span className="block h-px w-10 bg-background transition-all group-hover:w-16 group-disabled:w-10" />
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
