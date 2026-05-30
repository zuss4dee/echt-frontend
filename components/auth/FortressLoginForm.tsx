"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthComplianceFooter, AuthShell } from "@/components/auth/AuthShell";
import { AUTH_SIGNUP_PATH, getPostAuthPath } from "@/lib/auth-routing";
import { getAuthCallbackUrl, getPasswordRecoveryCallbackUrl } from "@/lib/supabase/auth-callback";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function isEmailNotConfirmedError(message: string | undefined): boolean {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes("email not confirmed") || lower.includes("email_not_confirmed");
}

type FortressLoginFormProps = {
  callbackError?: boolean;
};

export function FortressLoginForm({ callbackError = false }: FortressLoginFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError ? "That sign-in link is invalid or expired. Try again below." : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setUnconfirmedEmail(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        if (isEmailNotConfirmedError(authError.message)) {
          setUnconfirmedEmail(email);
          setMessage(
            "Confirm your email before signing in. Use the link we sent, or resend confirmation below.",
          );
          return;
        }
        setError(authError.message || "Authentication failed.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      router.replace(getPostAuthPath(session?.user.user_metadata));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function handleResendConfirmation(email: string) {
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError("Enter your work email first.");
      return;
    }

    setResending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (resendError) {
        setError(resendError.message || "Could not resend confirmation email.");
        return;
      }

      setMessage("Confirmation email sent. Check your inbox and spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setResending(false);
    }
  }

  async function handleRecoverAccess(email: string) {
    setError(null);
    setMessage(null);
    setUnconfirmedEmail(null);
    if (!email.trim()) {
      setError("Enter your work email first.");
      return;
    }

    setRecovering(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getPasswordRecoveryCallbackUrl(origin),
      });

      if (resetError) {
        setError(resetError.message || "Could not send recovery email.");
        return;
      }

      setMessage(
        "Check your email for a recovery link. After opening it, you will set a new password before signing in.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setRecovering(false);
    }
  }

  return (
    <AuthShell
      badge="ACCESS · TIER I CLEARANCE"
      editorial={
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-foreground" />
            <span className="label-micro text-muted-foreground">SECURE ACCESS · 2026</span>
          </div>
          <h1 className="display-serif text-[clamp(32px,3.2vw,52px)] leading-[1.05]">
            Re-enter the <span className="italic text-foreground/70">vault</span>.
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Every session is signed, sealed, and auditable. No passwords stored in plaintext, no
            telemetry, zero retention beyond the scan window.
          </p>
          <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline">
            {[
              { k: "PROTOCOL", v: "TLS 1.3 / mTLS" },
              { k: "SESSION", v: "HARDWARE BOUND" },
              { k: "AUDIT", v: "SOC 2 TYPE II" },
              { k: "REGION", v: "LON · EU-WEST" },
            ].map((m) => (
              <div key={m.k} className="bg-background p-5">
                <p className="label-micro text-muted-foreground">{m.k}</p>
                <p className="mt-2 label-micro text-foreground">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative border border-foreground bg-background"
      >
        <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-verdict-green" />
            <span className="label-micro">CLEARANCE TERMINAL</span>
          </div>
          <span className="label-micro text-muted-foreground">SIGN IN</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-px bg-hairline">
          {[
            { k: "WORK EMAIL", ph: "name@firm.com", type: "email", name: "email" },
            { k: "PASSWORD", ph: "Min. 12 characters", type: "password", name: "password" },
          ].map((f, i) => (
            <label
              key={f.k}
              className="block bg-background px-6 py-7 transition-colors focus-within:bg-foreground/[0.03]"
            >
              <span className="label-micro text-muted-foreground">
                {String(i + 1).padStart(2, "0")} · {f.k}
              </span>
              <input
                required
                type={f.type}
                name={f.name}
                placeholder={f.ph}
                autoComplete={f.type === "password" ? "current-password" : "email"}
                className="mt-3 w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </label>
          ))}

          <div className="flex items-center justify-between bg-background px-6 py-5">
            <label className="flex items-center gap-3 label-micro text-muted-foreground">
              <input type="checkbox" className="h-3 w-3 accent-foreground" />
              REMEMBER DEVICE
            </label>
            <button
              type="button"
              disabled={recovering}
              onClick={() => {
                const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
                void handleRecoverAccess(emailInput?.value ?? "");
              }}
              className="label-micro text-muted-foreground transition hover:text-foreground disabled:opacity-60"
            >
              {recovering ? "SENDING…" : "RECOVER ACCESS →"}
            </button>
          </div>

          {error ? (
            <p className="bg-background px-6 py-4 text-sm text-verdict-red" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <div className="space-y-3 bg-background px-6 py-4 text-sm text-muted-foreground" role="status">
              <p>{message}</p>
              {unconfirmedEmail ? (
                <button
                  type="button"
                  disabled={resending}
                  onClick={() => void handleResendConfirmation(unconfirmedEmail)}
                  className="label-micro text-foreground underline underline-offset-2 disabled:opacity-60"
                >
                  {resending ? "SENDING…" : "RESEND CONFIRMATION EMAIL →"}
                </button>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="group flex items-center justify-between bg-foreground px-6 py-6 text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            <span className="label-micro">{pending ? "VERIFYING…" : "AUTHENTICATE"}</span>
            <span className="label-micro text-primary-foreground/60 transition-colors group-hover:text-primary-foreground">
              →
            </span>
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-foreground px-6 py-5">
          <span className="label-micro text-muted-foreground">NO CLEARANCE YET?</span>
          <Link href={AUTH_SIGNUP_PATH} className="label-micro text-foreground hover:underline">
            REQUEST ACCESS →
          </Link>
        </div>
      </motion.div>

      <AuthComplianceFooter />
    </AuthShell>
  );
}
