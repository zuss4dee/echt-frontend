"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthComplianceFooter } from "@/components/auth/AuthShell";
import { BackgroundField } from "@/components/marketing/BackgroundField";
import { useLenis } from "@/hooks/use-lenis";
import {
  APP_ANALYZE_PATH,
  AUTH_LOGIN_PATH,
} from "@/lib/auth-routing";
import { stashPendingUpload } from "@/lib/pending-upload";
import { upsertPublicProfile } from "@/lib/supabase/profiles";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isOnboardingComplete, type UserProfileMetadata } from "@/lib/user-metadata";

const SPRING = { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.7 };

const FIELDS_1 = [
  { k: "AGENCY NAME", ph: "Legal entity", type: "text", name: "agency" },
  { k: "DIRECTOR NAME", ph: "Full legal name", type: "text", name: "director" },
  { k: "WORK EMAIL", ph: "name@firm.com", type: "email", name: "email" },
] as const;

export function FortressOnboardingFlow() {
  useLenis();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [agency, setAgency] = useState("");
  const [director, setDirector] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!session?.user) {
          router.replace(AUTH_LOGIN_PATH);
          return;
        }
        const meta = session.user.user_metadata as UserProfileMetadata | undefined;
        if (isOnboardingComplete(meta)) {
          router.replace(APP_ANALYZE_PATH);
          return;
        }
        setEmail(session.user.email ?? "");
        if (meta?.company_name) setAgency(String(meta.company_name));
        if (meta?.full_name) setDirector(String(meta.full_name));
        setReady(true);
      } catch {
        if (!cancelled) router.replace(AUTH_LOGIN_PATH);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleStepOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const agencyName = String(form.get("agency") ?? "").trim();
    const directorName = String(form.get("director") ?? "").trim();

    if (agencyName.length < 2 || directorName.length < 2) {
      setError("Complete agency and director details to continue.");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace(AUTH_LOGIN_PATH);
        return;
      }

      const prev = (session.user.user_metadata ?? {}) as UserProfileMetadata;
      const patch = {
        ...prev,
        full_name: directorName,
        company_name: agencyName,
      } satisfies UserProfileMetadata;

      const { error: updateError } = await supabase.auth.updateUser({ data: patch });
      if (updateError) {
        setError(updateError.message ?? "Could not save workspace details.");
        return;
      }

      setAgency(agencyName);
      setDirector(directorName);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const completeOnboarding = async (file: File | null) => {
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace(AUTH_LOGIN_PATH);
        return;
      }

      const prev = (session.user.user_metadata ?? {}) as UserProfileMetadata;
      const metaPayload = {
        ...prev,
        full_name: director.trim() || prev.full_name,
        company_name: agency.trim() || prev.company_name,
        onboarding_complete: true,
      } satisfies UserProfileMetadata;

      const { error: updateError } = await supabase.auth.updateUser({ data: metaPayload });
      if (updateError) {
        setError(updateError.message ?? "Could not finish onboarding.");
        return;
      }

      const { error: profileErr } = await upsertPublicProfile(session.user, metaPayload);
      if (profileErr) {
        console.error("[profiles] upsert after onboarding:", profileErr);
      }

      if (file) {
        await stashPendingUpload(file);
      }

      router.replace(APP_ANALYZE_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="marketing-site flex min-h-dvh items-center justify-center bg-background text-foreground">
        <p className="label-micro text-muted-foreground">INITIALIZING CLEARANCE…</p>
      </div>
    );
  }

  return (
    <>
      <BackgroundField />
      <main className="relative z-10 min-h-screen text-foreground">
        <div className="border-b border-hairline">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-2 w-2 bg-verdict-green" />
              <span className="label-micro">ECHT — FORENSIC INTEGRITY</span>
            </Link>
            <span className="label-micro text-muted-foreground">
              ONBOARDING · STEP {String(step).padStart(2, "0")} / 02
            </span>
            <div className="flex items-center gap-6">
              <Link
                href={AUTH_LOGIN_PATH}
                className="label-micro text-muted-foreground transition hover:text-foreground"
              >
                SIGN IN
              </Link>
              <Link
                href="/"
                className="label-micro text-muted-foreground transition hover:text-foreground"
              >
                ← EXIT
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 py-20 md:py-28">
          <aside className="col-span-12 md:col-span-6 md:sticky md:top-28 md:self-start">
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-foreground" />
                <span className="label-micro text-muted-foreground">CLEARANCE PROTOCOL · 2026</span>
              </div>

              <h1 className="display-serif text-[clamp(32px,3.2vw,52px)] leading-[1.05] text-foreground">
                Secure your properties.
                <br />
                <span className="italic text-foreground/70">Prevent</span> the next £10,000 eviction.
              </h1>

              <div className="flex items-end justify-between gap-6 border-t border-hairline pt-6">
                <div>
                  <p className="label-micro text-muted-foreground">LOSSES PREVENTED — LIVE LEDGER</p>
                  <p className="display-serif mt-2 text-[clamp(28px,3vw,48px)] text-foreground">£5M+</p>
                </div>
                <span className="label-micro text-verdict-green">● SIGNAL ACTIVE</span>
              </div>

              <ol className="grid grid-cols-1 gap-px border border-hairline bg-hairline">
                {[
                  { n: "01", t: "AGENCY CLEARANCE", s: "Issue keys, scope your workspace." },
                  { n: "02", t: "THE FORENSIC TEST", s: "Upload one suspicious file. Watch it break." },
                ].map((it, i) => {
                  const active = i + 1 === step;
                  const done = i + 1 < step;
                  return (
                    <li
                      key={it.n}
                      className={`flex items-start gap-6 bg-background p-6 transition-colors ${
                        active ? "bg-foreground/[0.03]" : ""
                      }`}
                    >
                      <span
                        className={`mt-1 inline-flex h-6 w-6 items-center justify-center label-micro ${
                          done
                            ? "bg-verdict-green text-background"
                            : active
                              ? "bg-foreground text-background"
                              : "border border-hairline text-muted-foreground"
                        }`}
                      >
                        {done ? "✓" : it.n}
                      </span>
                      <div>
                        <p className="label-micro text-foreground">{it.t}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{it.s}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <section className="col-span-12 md:col-span-6">
            <div className="relative border border-foreground bg-background">
              <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-verdict-green" />
                  <span className="label-micro">SECURE INTAKE · TLS 1.3</span>
                </div>
                <span className="label-micro text-muted-foreground">
                  {step === 1 ? "01 · AGENCY CLEARANCE" : "02 · FORENSIC TEST"}
                </span>
              </div>

              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 ? (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={SPRING}
                    >
                      <StepOne
                        email={email}
                        agency={agency}
                        director={director}
                        error={error}
                        submitting={submitting}
                        onSubmit={handleStepOne}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={SPRING}
                    >
                      <StepTwo
                        error={error}
                        submitting={submitting}
                        onBack={() => setStep(1)}
                        onComplete={completeOnboarding}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between border-t border-foreground px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="label-micro text-muted-foreground">CLEARANCE</span>
                  <div className="flex items-center gap-2">
                    {[1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-2 w-12 transition-colors ${
                          i <= step ? "bg-verdict-green" : "bg-hairline"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="label-micro">{step}/2</span>
                </div>
                <span className="label-micro text-muted-foreground">ECHT v 4.21 / LON</span>
              </div>
            </div>

            <AuthComplianceFooter />
          </section>
        </div>
      </main>
    </>
  );
}

function StepOne({
  email,
  agency,
  director,
  error,
  submitting,
  onSubmit,
}: {
  email: string;
  agency: string;
  director: string;
  error: string | null;
  submitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-px bg-hairline">
      {FIELDS_1.map((f, i) => (
        <label
          key={f.k}
          className="block bg-background px-6 py-7 transition-colors focus-within:bg-foreground/[0.03]"
        >
          <span className="label-micro text-muted-foreground">
            {String(i + 1).padStart(2, "0")} · {f.k}
          </span>
          <input
            required
            readOnly={f.name === "email"}
            type={f.type}
            name={f.name}
            defaultValue={
              f.name === "email" ? email : f.name === "agency" ? agency : director
            }
            placeholder={f.ph}
            className={`mt-5 w-full border-b border-hairline bg-transparent pb-2 font-sans text-xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground ${
              f.name === "email" ? "cursor-not-allowed text-muted-foreground" : ""
            }`}
          />
        </label>
      ))}

      {error ? (
        <p className="bg-background px-6 py-4 text-sm text-verdict-red" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-6 bg-background px-6 py-6">
        <p className="label-micro max-w-[28ch] text-muted-foreground">
          By initializing, you accept ECHT&apos;s data covenant.
        </p>
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 480, damping: 26 }}
          className="group inline-flex items-center gap-4 bg-foreground px-8 py-5 text-background disabled:opacity-60"
        >
          <span className="label-micro">
            {submitting ? "INITIALIZING…" : "INITIALIZE WORKSPACE"}
          </span>
          <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
        </motion.button>
      </div>
    </form>
  );
}

function StepTwo({
  error,
  submitting,
  onBack,
  onComplete,
}: {
  error: string | null;
  submitting: boolean;
  onBack: () => void;
  onComplete: (file: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, []);

  return (
    <div className="px-6 py-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center border border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-foreground bg-foreground/[0.04]"
            : "border-foreground/40 hover:border-foreground/70"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff,.docx"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {[
          "left-2 top-2 border-l border-t",
          "right-2 top-2 border-r border-t",
          "left-2 bottom-2 border-l border-b",
          "right-2 bottom-2 border-r border-b",
        ].map((c) => (
          <span key={c} className={`absolute h-3 w-3 border-foreground ${c}`} />
        ))}

        <span className="label-micro text-muted-foreground">EVIDENCE INTAKE</span>
        <p className="display-serif mt-6 text-4xl text-foreground">
          {file ? file.name : "Drop the suspicious file."}
        </p>
        <p className="mt-4 max-w-md label-micro text-muted-foreground">
          {file
            ? `${(file.size / 1024).toFixed(1)} KB · READY FOR FORENSIC SCAN`
            : "PDF · PNG · JPG · TIFF · DOCX — UP TO 25MB"}
        </p>

        {file ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            className="mt-6 label-micro text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            REMOVE
          </button>
        ) : null}
      </div>

      <ul className="mt-8 grid grid-cols-3 gap-px bg-hairline">
        {[
          { k: "FILE DNA", v: "EXIF · HASH" },
          { k: "EXPORT TRAIL", v: "ORIGIN CHAIN" },
          { k: "PIXEL FORENSICS", v: "ELA · CFA" },
        ].map((c) => (
          <li key={c.k} className="bg-background p-5">
            <p className="label-micro text-muted-foreground">{c.k}</p>
            <p className="mt-2 label-micro text-foreground">{c.v}</p>
          </li>
        ))}
      </ul>

      {error ? (
        <p className="mt-6 text-sm text-verdict-red" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="label-micro text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          ← BACK
        </button>
        <motion.button
          type="button"
          disabled={!file || submitting}
          onClick={() => void onComplete(file)}
          whileHover={file ? { scale: 1.02 } : undefined}
          whileTap={file ? { scale: 0.97 } : undefined}
          transition={{ type: "spring", stiffness: 480, damping: 26 }}
          className="group inline-flex items-center gap-4 bg-foreground px-8 py-5 text-background disabled:cursor-not-allowed disabled:bg-foreground/30"
        >
          <span className="label-micro">
            {submitting ? "FINALIZING…" : "RUN FORENSIC SCAN"}
          </span>
          <span className="block h-px w-10 bg-background transition-all group-hover:w-16" />
        </motion.button>
      </div>
    </div>
  );
}
