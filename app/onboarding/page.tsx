"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { EchtWordmark } from "@/components/EchtLogo";
import { PaymentPendingModal } from "@/components/marketing/PaymentPendingModal";
import { isOnboardingComplete, type UserProfileMetadata } from "@/lib/user-metadata";
import {
  isNoSubscriptionReason,
  postWhopVerifyAccess,
} from "@/lib/whop-verify-client";
import { upsertPublicProfile } from "@/lib/supabase/profiles";

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[15px] text-neutral-900 shadow-sm placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60";

const STEPS = [
  { key: "full_name" as const, title: "Your name", description: "How we’ll show you in the app." },
  { key: "email" as const, title: "Work email", description: "Tied to your sign-in." },
  { key: "phone" as const, title: "Phone", description: "For urgent follow-up if needed." },
  { key: "company_name" as const, title: "Company", description: "Your organisation." },
  { key: "role_in_company" as const, title: "Role", description: "Your role on the team." },
  { key: "monthly_references" as const, title: "Monthly volume", description: "References you process per month." },
] as const;

const MONTHLY_REFERENCE_OPTIONS: { value: string; label: string }[] = [
  { value: "1-50", label: "1 to 50" },
  { value: "51-200", label: "51 to 200" },
  { value: "201-500", label: "201 to 500" },
  { value: "501-1000", label: "501 to 1,000" },
  { value: "1000+", label: "Over 1,000" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [monthlyReferences, setMonthlyReferences] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Profile saved but Whop row not ready yet (same as after payment). */
  const [waitingForAccess, setWaitingForAccess] = useState(false);

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
          router.replace("/login");
          return;
        }
        const meta = session.user.user_metadata as UserProfileMetadata | undefined;
        if (isOnboardingComplete(meta)) {
          const { hasAccess, reason } = await postWhopVerifyAccess();
          if (cancelled) return;
          if (hasAccess) {
            router.replace("/analyze");
            return;
          }
          if (isNoSubscriptionReason(reason)) {
            router.replace("/?subscribe=1&needs_plan=1");
            return;
          }
          setWaitingForAccess(true);
          setReady(true);
          return;
        }
        const gate = await postWhopVerifyAccess();
        if (cancelled) return;
        if (!gate.hasAccess && isNoSubscriptionReason(gate.reason)) {
          router.replace("/?subscribe=1&needs_plan=1");
          return;
        }
        setEmail(session.user.email ?? "");
        const m = meta ?? {};
        if (m.full_name) setFullName(String(m.full_name));
        if (m.phone) setPhone(String(m.phone));
        if (m.company_name) setCompanyName(String(m.company_name));
        if (m.role_in_company) setRole(String(m.role_in_company));
        if (m.monthly_references) setMonthlyReferences(String(m.monthly_references));
        setReady(true);
      } catch {
        if (!cancelled) router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!waitingForAccess || !ready) return;
    let cancelled = false;
    const POLL_MS = 1500;
    const tick = async () => {
      if (cancelled) return;
      if ((await postWhopVerifyAccess()).hasAccess) {
        router.replace("/analyze");
      }
    };
    void tick();
    const id = setInterval(() => void tick(), POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [waitingForAccess, ready, router]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const canProceed = useCallback(() => {
    switch (current.key) {
      case "full_name":
        return fullName.trim().length >= 2;
      case "email":
        return email.includes("@");
      case "phone":
        return phone.trim().length >= 6;
      case "company_name":
        return companyName.trim().length >= 2;
      case "role_in_company":
        return role.trim().length >= 2;
      case "monthly_references":
        return monthlyReferences.length > 0;
      default:
        return false;
    }
  }, [current.key, fullName, email, phone, companyName, role, monthlyReferences]);

  const handleNext = () => {
    setError(null);
    if (!canProceed()) {
      setError("Please complete this step to continue.");
      return;
    }
    if (isLast) {
      void handleSubmit();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      setError("Please complete all fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const metaPayload = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        company_name: companyName.trim(),
        role_in_company: role.trim(),
        monthly_references: monthlyReferences,
        onboarding_complete: true,
      } satisfies UserProfileMetadata;

      const { error: updateError } = await supabase.auth.updateUser({
        data: metaPayload,
      });
      if (updateError) {
        setError(updateError.message ?? "Could not save. Try again.");
        return;
      }

      const {
        data: { session: afterSession },
      } = await supabase.auth.getSession();
      if (afterSession?.user) {
        const { error: profileErr } = await upsertPublicProfile(afterSession.user, metaPayload);
        if (profileErr) {
          console.error("[profiles] upsert after onboarding:", profileErr);
        }
      }

      const first = await postWhopVerifyAccess();
      if (first.hasAccess) {
        router.replace("/analyze");
        return;
      }
      if (isNoSubscriptionReason(first.reason)) {
        router.replace("/?subscribe=1&needs_plan=1");
        return;
      }

      const POLL_MS = 1500;
      const MAX_POLLS = 12;
      for (let i = 0; i < MAX_POLLS; i++) {
        const r = await postWhopVerifyAccess();
        if (r.hasAccess) {
          router.replace("/analyze");
          return;
        }
        if (isNoSubscriptionReason(r.reason)) {
          router.replace("/?subscribe=1&needs_plan=1");
          return;
        }
        if (i < MAX_POLLS - 1) {
          await new Promise((res) => setTimeout(res, POLL_MS));
        }
      }
      router.replace("/?subscribe=1&access_pending=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white px-4">
        <p className="text-sm text-neutral-500">Loading…</p>
      </main>
    );
  }

  if (waitingForAccess) {
    return (
      <main className="min-h-dvh bg-white">
        <PaymentPendingModal open />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="inline-block rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            aria-label="Echt home"
          >
            <EchtWordmark className="block h-9 w-auto text-neutral-900 sm:h-10" />
          </Link>
        </div>

        <p className="text-center text-[12px] text-neutral-400">
          Step {step + 1} of {STEPS.length}
        </p>

        <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight text-neutral-900 sm:text-[2rem] sm:leading-tight">
          {current.title}
        </h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-neutral-500">{current.description}</p>

        <div className="mt-10 space-y-4">
          {current.key === "full_name" && (
            <label className="block">
              <span className="sr-only">Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className={INPUT_CLASS}
              />
            </label>
          )}
          {current.key === "email" && (
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                readOnly
                value={email}
                className="h-11 w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 text-[15px] text-neutral-700"
              />
            </label>
          )}
          {current.key === "phone" && (
            <label className="block">
              <span className="sr-only">Phone</span>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className={INPUT_CLASS}
              />
            </label>
          )}
          {current.key === "company_name" && (
            <label className="block">
              <span className="sr-only">Company</span>
              <input
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Referencing Ltd"
                className={INPUT_CLASS}
              />
            </label>
          )}
          {current.key === "role_in_company" && (
            <label className="block">
              <span className="sr-only">Role</span>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Ops Analyst"
                className={INPUT_CLASS}
              />
            </label>
          )}
          {current.key === "monthly_references" && (
            <label className="block">
              <span className="sr-only">Monthly reference volume</span>
              <select
                value={monthlyReferences}
                onChange={(e) => setMonthlyReferences(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Select a range</option>
                {MONTHLY_REFERENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="h-11 w-full rounded-lg bg-neutral-900 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Finishing up…" : isLast ? "Finish" : "Continue"}
          </button>

          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((s) => Math.max(0, s - 1));
              }}
              disabled={submitting}
              className="w-full text-center text-sm font-medium text-neutral-500 underline-offset-4 transition hover:text-neutral-800 hover:underline disabled:opacity-50"
            >
              Back
            </button>
          ) : null}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-400">
          <Link href="/" className="underline-offset-4 hover:text-neutral-600 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
