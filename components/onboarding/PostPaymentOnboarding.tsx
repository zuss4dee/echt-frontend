"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthComplianceFooter, AuthShell } from "@/components/auth/AuthShell";
import { getApiBase, parseApiError } from "@/lib/api-base";
import { AUTH_LOGIN_PATH, AUTH_SETUP_PATH, PRICING_PATH } from "@/lib/auth-routing";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MIN_PASSWORD_LENGTH = 12;

const FIELDS = [
  { k: "AGENCY NAME", name: "agency_name", type: "text", auto: "organization" },
  { k: "DIRECTOR NAME", name: "director_name", type: "text", auto: "name" },
  { k: "EMAIL ADDRESS", name: "email", type: "email", auto: "email" },
  { k: "SECURE PASSWORD", name: "password", type: "password", auto: "new-password" },
] as const;

function PostPaymentOnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("session_id") ??
    searchParams.get("checkout_id") ??
    searchParams.get("checkoutId");

  const [checked, setChecked] = useState(false);
  const [emailHint, setEmailHint] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.replace(PRICING_PATH);
      return;
    }

    const apiBase = getApiBase();
    let cancelled = false;
    (async () => {
      try {
        if (apiBase) {
          const res = await fetch(
            `${apiBase}/api/auth/register?session_id=${encodeURIComponent(sessionId)}`,
          );
          const body = (await res.json().catch(() => ({}))) as { email?: string | null };
          if (!cancelled && body.email) {
            setEmailHint(body.email);
          }
        }
      } catch {
        /* optional prefill */
      } finally {
        if (!cancelled) setChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sessionId) return;

    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const agency_name = String(form.get("agency_name") ?? "").trim();
    const director_name = String(form.get("director_name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      setPending(false);
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setError("API is not configured. Set NEXT_PUBLIC_API_URL in the environment.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          agency_name,
          director_name,
          email,
          password,
        }),
      });

      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        detail?: string;
        redirect?: string;
      };

      if (!res.ok) {
        setError(parseApiError(body, res.status));
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(
          "Account created. Sign in with your new password to continue.",
        );
        router.replace(AUTH_LOGIN_PATH);
        return;
      }

      router.replace(body.redirect ?? AUTH_SETUP_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  if (!sessionId || !checked) {
    return (
      <AuthShell
        badge="PROVISIONING · PHASE ONE"
        editorial={
          <p className="text-sm text-muted-foreground">Verifying checkout session…</p>
        }
      >
        <p className="label-micro text-muted-foreground">INITIALIZING</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="PROVISIONING · PHASE ONE"
      editorial={
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-foreground" />
            <span className="label-micro text-muted-foreground">PAYMENT CONFIRMED</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="display-serif text-[clamp(32px,3.2vw,52px)] leading-[1.05]"
          >
            Payment Confirmed.
            <br />
            <span className="italic text-foreground/70">Initialize Workspace.</span>
          </motion.h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Your £200/mo Early Adopter rate is locked.
          </p>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="border border-foreground bg-background"
      >
        <div className="border-b border-foreground px-6 py-4">
          <span className="label-micro text-muted-foreground">ACCOUNT TERMINAL</span>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8">
          <div className="flex flex-col gap-10">
            {FIELDS.map((f) => (
              <label key={f.name} className="block">
                <span className="label-micro text-muted-foreground">{f.k}</span>
                <input
                  required
                  type={f.type}
                  name={f.name}
                  autoComplete={f.auto}
                  defaultValue={f.name === "email" ? emailHint : undefined}
                  className="mt-3 w-full border-0 border-b border-foreground bg-transparent pb-3 text-lg text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none focus:ring-0"
                  placeholder={f.type === "email" ? "name@firm.com" : undefined}
                />
              </label>
            ))}
          </div>

          {error ? (
            <p className="mt-8 text-sm text-verdict-red" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="group mt-12 flex w-full items-center justify-between bg-foreground px-6 py-6 text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            <span className="label-micro">{pending ? "AUTHENTICATING…" : "ENTER THE VAULT"}</span>
            <span className="label-micro text-primary-foreground/60 transition-colors group-hover:text-primary-foreground">
              →
            </span>
          </button>
        </form>

        <div className="border-t border-foreground px-6 py-5">
          <span className="label-micro text-muted-foreground">
            ALREADY HAVE CLEARANCE?{" "}
            <Link href={AUTH_LOGIN_PATH} className="text-foreground underline underline-offset-2">
              SIGN IN
            </Link>
          </span>
        </div>
      </motion.div>

      <AuthComplianceFooter />
    </AuthShell>
  );
}

export function PostPaymentOnboarding() {
  return (
    <Suspense
      fallback={
        <div className="marketing-site flex min-h-dvh items-center justify-center bg-background">
          <span className="label-micro text-muted-foreground">INITIALIZING…</span>
        </div>
      }
    >
      <PostPaymentOnboardingInner />
    </Suspense>
  );
}
