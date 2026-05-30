"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthComplianceFooter, AuthShell } from "@/components/auth/AuthShell";
import { AUTH_LOGIN_PATH, getPostAuthPath } from "@/lib/auth-routing";
import { getAuthCallbackUrl } from "@/lib/supabase/auth-callback";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { interpretSignUpResponse } from "@/lib/supabase/signup";

const FIELDS = [
  { k: "FULL LEGAL NAME", ph: "Director / signatory", type: "text", name: "name", auto: "name" },
  { k: "WORK EMAIL", ph: "name@firm.com", type: "email", name: "email", auto: "email" },
  { k: "AGENCY", ph: "Registered entity", type: "text", name: "agency", auto: "organization" },
  { k: "PASSWORD", ph: "Min. 12 characters", type: "password", name: "password", auto: "new-password" },
] as const;

type SignupNotice = "confirm" | "already_registered" | "resent";

export function FortressSignupForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<SignupNotice | null>(null);
  const [noticeEmail, setNoticeEmail] = useState<string | null>(null);

  async function resendConfirmation(email: string) {
    setError(null);
    setResending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (resendError) {
        setError(resendError.message || "Could not resend confirmation email.");
        return;
      }

      setNotice("resent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setNoticeEmail(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const agency = String(form.get("agency") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
          data: {
            full_name: name,
            company_name: agency,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Could not create account.");
        return;
      }

      const outcome = interpretSignUpResponse(data);

      if (outcome.kind === "session") {
        router.replace(getPostAuthPath(data.user?.user_metadata));
        return;
      }

      setNoticeEmail(email);

      if (outcome.kind === "duplicate_signup") {
        const statusRes = await fetch("/api/auth/email-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const statusBody = (await statusRes.json().catch(() => ({}))) as {
          status?: string;
        };

        if (statusBody.status === "confirmed") {
          setError("An account with this email already exists.");
          return;
        }
        if (statusBody.status === "unconfirmed") {
          setNotice("already_registered");
          return;
        }
        setNotice("confirm");
        return;
      }

      setNotice("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      badge="PROVISIONING · TIER I"
      editorial={
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-foreground" />
            <span className="label-micro text-muted-foreground">FOUNDING PARTNERS · LIMITED</span>
          </div>
          <h1 className="display-serif text-[clamp(32px,3.2vw,52px)] leading-[1.05]">
            Provision your <span className="italic text-foreground/70">vault</span>.
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Workspaces are issued under chain-of-custody. Each agency receives a sealed key set, an
            isolated forensic engine, and a private audit ledger.
          </p>
          <ol className="grid grid-cols-1 gap-px border border-hairline bg-hairline">
            {[
              { n: "01", t: "REQUEST CLEARANCE", s: "Submit your credentials for verification." },
              { n: "02", t: "AGENCY INITIALIZATION", s: "Workspace, keys, and audit ledger issued." },
              { n: "03", t: "RUN YOUR FIRST SCAN", s: "Drop one suspicious file. Watch it break." },
            ].map((it) => (
              <li key={it.n} className="flex items-start gap-6 bg-background p-6">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center border border-hairline label-micro text-muted-foreground">
                  {it.n}
                </span>
                <div>
                  <p className="label-micro text-foreground">{it.t}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{it.s}</p>
                </div>
              </li>
            ))}
          </ol>
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
            <span className="label-micro">PROVISIONING TERMINAL</span>
          </div>
          <span className="label-micro text-muted-foreground">REQUEST ACCESS</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-px bg-hairline">
          {FIELDS.map((f, i) => (
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
                autoComplete={f.auto}
                className="mt-3 w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </label>
          ))}

          <label className="flex items-start gap-3 bg-background px-6 py-5 label-micro text-muted-foreground">
            <input required type="checkbox" className="mt-[2px] h-3 w-3 accent-foreground" />
            <span>
              I ACCEPT THE FORENSIC HANDLING TERMS, DATA PROCESSING ADDENDUM, AND CHAIN-OF-CUSTODY
              PROTOCOL.
            </span>
          </label>

          {error ? (
            <div className="bg-background px-6 py-4 text-sm text-verdict-red" role="alert">
              <p>{error}</p>
              {error.includes("already exists") ? (
                <p className="mt-2 text-muted-foreground">
                  Active accounts do not receive another confirmation email.{" "}
                  <Link href={AUTH_LOGIN_PATH} className="text-foreground underline underline-offset-2">
                    Sign in
                  </Link>{" "}
                  or use password recovery on the login page.
                </p>
              ) : null}
            </div>
          ) : null}

          {notice && noticeEmail ? (
            <div className="space-y-3 bg-background px-6 py-4 text-sm text-muted-foreground" role="status">
              {notice === "resent" ? (
                <p>Confirmation email sent again to {noticeEmail}. Check your inbox and spam folder.</p>
              ) : notice === "already_registered" ? (
                <p>
                  An account for {noticeEmail} exists but is not confirmed yet. Use the button below
                  to send a new confirmation link, then{" "}
                  <Link href={AUTH_LOGIN_PATH} className="text-foreground underline underline-offset-2">
                    sign in
                  </Link>{" "}
                  after confirming.
                </p>
              ) : (
                <p>
                  We sent a confirmation link to <span className="text-foreground">{noticeEmail}</span>.
                  Open it to activate your clearance, then{" "}
                  <Link href={AUTH_LOGIN_PATH} className="text-foreground underline underline-offset-2">
                    sign in
                  </Link>
                  . Check spam if it does not arrive within a few minutes.
                </p>
              )}
              <button
                type="button"
                disabled={resending}
                onClick={() => void resendConfirmation(noticeEmail)}
                className="label-micro text-foreground underline underline-offset-2 disabled:opacity-60"
              >
                {resending ? "SENDING…" : "RESEND CONFIRMATION EMAIL →"}
              </button>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="group flex items-center justify-between bg-foreground px-6 py-6 text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            <span className="label-micro">{pending ? "ISSUING KEYS…" : "REQUEST CLEARANCE"}</span>
            <span className="label-micro text-primary-foreground/60 transition-colors group-hover:text-primary-foreground">
              →
            </span>
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-foreground px-6 py-5">
          <span className="label-micro text-muted-foreground">ALREADY CLEARED?</span>
          <Link href={AUTH_LOGIN_PATH} className="label-micro text-foreground hover:underline">
            SIGN IN →
          </Link>
        </div>
      </motion.div>

      <AuthComplianceFooter />
    </AuthShell>
  );
}
