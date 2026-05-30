"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/marketing/Footer";

const CONTACT_SUBMIT_URL = "https://echt-backend.onrender.com/api/contact/submit";

const FIELDS = [
  { k: "CORPORATE ENTITY", ph: "Corporate Entity", name: "corporate_entity" },
  { k: "PORTFOLIO VOLUME", ph: "Portfolio Volume", name: "portfolio_volume" },
  { k: "OPERATIONAL REGION", ph: "Operational Region", name: "operational_region" },
  { k: "PREFERRED CONTACT", ph: "Preferred Contact", name: "preferred_contact" },
] as const;

const EMPTY_FORM = {
  corporate_entity: "",
  portfolio_volume: "",
  operational_region: "",
  preferred_contact: "",
  inquiry_details: "",
};

export function Clearance() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!success || !successRef.current) return;
    successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [success]);

  function updateField(name: keyof typeof EMPTY_FORM, value: string) {
    setSuccess(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);

    const payload = {
      corporate_entity: form.corporate_entity,
      portfolio_volume: form.portfolio_volume,
      operational_region: form.operational_region,
      preferred_contact: form.preferred_contact,
      inquiry_details: form.inquiry_details,
    };

    try {
      const res = await fetch(CONTACT_SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 200 || res.status === 201) {
        setForm(EMPTY_FORM);
        setStep(0);
        setSuccess(true);
        return;
      }

      setError("Could not send inquiry. Please try again.");
    } catch {
      /* network error — button reverts via pending=false */
    } finally {
      setPending(false);
    }
  }

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
              Initialize <span className="italic">contact</span>.
            </motion.h2>

            <form onSubmit={handleSubmit} className="mt-16 border border-foreground bg-background">
              <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-verdict-green" />
                  <span className="label-micro">SECURE INTAKE · TLS 1.3</span>
                </div>
                <span className="label-micro text-muted-foreground">CONTACT FORM · 01 / 01</span>
              </div>

              <div
                className={`grid grid-cols-1 gap-px bg-hairline transition-opacity duration-500 md:grid-cols-2 ${
                  success ? "pointer-events-none opacity-35" : ""
                }`}
              >
                {FIELDS.map((f, i) => (
                  <motion.label
                    key={f.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    onFocus={() => setStep(i + 1)}
                    className="group block bg-background p-8 transition-colors focus-within:bg-foreground/[0.02]"
                  >
                    <span className="label-micro text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {f.k}
                    </span>
                    <input
                      required={f.name === "corporate_entity" || f.name === "preferred_contact"}
                      name={f.name}
                      value={form[f.name]}
                      onChange={(e) => updateField(f.name, e.target.value)}
                      className="mt-6 w-full border-b border-hairline bg-transparent pb-2 font-sans text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground"
                      placeholder={f.ph}
                    />
                  </motion.label>
                ))}

                <motion.label
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32, duration: 0.6 }}
                  onFocus={() => setStep(5)}
                  className="group block bg-background p-8 transition-colors focus-within:bg-foreground/[0.02] md:col-span-2"
                >
                  <span className="label-micro text-muted-foreground">05 · INQUIRY DETAILS</span>
                  <textarea
                    required
                    name="inquiry_details"
                    rows={4}
                    value={form.inquiry_details}
                    onChange={(e) => updateField("inquiry_details", e.target.value)}
                    className="mt-6 w-full resize-none border-b border-hairline bg-transparent pb-2 font-sans text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground"
                    placeholder="Outline your specific requirement or fraud challenge..."
                  />
                </motion.label>
              </div>

              {error ? (
                <p className="border-t border-hairline bg-background px-6 py-4 text-sm text-verdict-red" role="alert">
                  {error}
                </p>
              ) : null}

              <AnimatePresence>
                {success ? (
                  <motion.div
                    ref={successRef}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-t-2 border-verdict-green bg-foreground text-background"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
                      <div className="flex items-start gap-5">
                        <span className="mt-2 h-2 w-2 shrink-0 bg-verdict-green" aria-hidden />
                        <div>
                          <p className="label-micro text-background/70">TRANSMISSION CONFIRMED</p>
                          <p className="mt-4 max-w-xl display-serif text-[clamp(28px,4vw,44px)] leading-[1.15]">
                            Inquiry received. Our team will be in touch.
                          </p>
                        </div>
                      </div>
                      <span className="label-micro text-background/50 md:text-right">
                        REF · {new Date().getFullYear()}
                        <br />
                        CHANNEL SECURED
                      </span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex flex-col items-start justify-between gap-6 border-t border-foreground px-6 py-6 md:flex-row md:items-center">
                <div className="flex items-center gap-6">
                  <span className="label-micro text-muted-foreground">CLEARANCE LEVEL</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`h-2 w-8 transition-colors ${
                          i <= step ? "bg-verdict-green" : "bg-hairline"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="label-micro text-foreground">{Math.min(step, 5)}/5</span>
                </div>

                <button
                  type="submit"
                  disabled={pending || success}
                  className="group inline-flex items-center gap-4 bg-foreground px-8 py-5 text-background transition-colors hover:bg-foreground/90 disabled:cursor-default disabled:opacity-100"
                >
                  <span className="label-micro">
                    {success
                      ? "INQUIRY LOGGED"
                      : pending
                        ? "TRANSMITTING..."
                        : "COMMENCE DIALOGUE"}
                  </span>
                  {!success ? (
                    <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
                  ) : (
                    <span className="h-2 w-2 bg-verdict-green" aria-hidden />
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 label-micro text-muted-foreground">
              <span>SOC 2 TYPE II</span>
              <span>ISO 27001</span>
              <span>UK GDPR</span>
              <span>ZERO RETENTION OPT-IN</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
