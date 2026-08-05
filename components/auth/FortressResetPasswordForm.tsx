"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthComplianceFooter, AuthShell } from "@/components/auth/AuthShell";
import { AUTH_LOGIN_PATH, getPostAuthPath } from "@/lib/auth-routing";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const MIN_PASSWORD_LENGTH = 12;

type FortressResetPasswordFormProps = {
  invalidLink?: boolean;
};

export function FortressResetPasswordForm({ invalidLink = false }: FortressResetPasswordFormProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    invalidLink ? "This recovery link is invalid or expired. Request a new one from the login page." : null,
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setReady(true);
      }
    });

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      setHasSession(Boolean(session));
      setReady(true);
    })();

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message || "Could not update password.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setMessage("Password updated. Redirecting…");
      router.replace(getPostAuthPath(session?.user.user_metadata));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell
      badge="RECOVERY · CREDENTIAL ROTATION"
      editorial={
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-foreground" />
            <span className="label-micro text-muted-foreground">SECURE ROTATION · 2026</span>
          </div>
          <h1 className="display-serif text-[clamp(32px,3.2vw,52px)] leading-[1.05]">
            Issue a new <span className="italic text-foreground/70">key</span>.
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Choose a new password to complete recovery. This step is required before you can sign in
            with your updated credentials.
          </p>
        </div>
      }
    >
      {/*
        CSS animation, not framer-motion: motion's `initial` renders as an
        inline opacity:0 that only clears on hydration, so a blocked client
        bundle left this whole panel invisible with no error shown.
      */}
      <div className="animate-panel-in relative border border-foreground bg-background">
        <div className="flex items-center justify-between border-b border-foreground px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-verdict-green" />
            <span className="label-micro">RECOVERY TERMINAL</span>
          </div>
          <span className="label-micro text-muted-foreground">NEW PASSWORD</span>
        </div>

        {!ready ? (
          <p className="bg-background px-6 py-8 text-sm text-muted-foreground">Verifying recovery session…</p>
        ) : !hasSession ? (
          <div className="space-y-4 bg-background px-6 py-8 text-sm text-muted-foreground">
            <p role="alert">
              {error ??
                "Open the link from your recovery email, or request a new one from the login page."}
            </p>
            <Link href={AUTH_LOGIN_PATH} className="label-micro text-foreground underline underline-offset-2">
              BACK TO SIGN IN →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-px bg-hairline">
            {[
              { k: "NEW PASSWORD", name: "password", auto: "new-password" },
              { k: "CONFIRM PASSWORD", name: "confirm", auto: "new-password" },
            ].map((f, i) => (
              <label
                key={f.name}
                className="block bg-background px-6 py-7 transition-colors focus-within:bg-foreground/[0.03]"
              >
                <span className="label-micro text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {f.k}
                </span>
                <input
                  required
                  type="password"
                  name={f.name}
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete={f.auto}
                  placeholder="Min. 12 characters"
                  className="mt-3 w-full bg-transparent text-lg text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                />
              </label>
            ))}

            {error ? (
              <p className="bg-background px-6 py-4 text-sm text-verdict-red" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="bg-background px-6 py-4 text-sm text-muted-foreground" role="status">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="group flex items-center justify-between bg-foreground px-6 py-6 text-primary-foreground transition-colors hover:bg-foreground/90 disabled:opacity-60"
            >
              <span className="label-micro">{pending ? "UPDATING…" : "SET NEW PASSWORD"}</span>
              <span className="label-micro text-primary-foreground/60 transition-colors group-hover:text-primary-foreground">
                →
              </span>
            </button>
          </form>
        )}

        <div className="flex items-center justify-between border-t border-foreground px-6 py-5">
          <span className="label-micro text-muted-foreground">REMEMBERED IT?</span>
          <Link href={AUTH_LOGIN_PATH} className="label-micro text-foreground hover:underline">
            SIGN IN →
          </Link>
        </div>
      </div>

      <AuthComplianceFooter />
    </AuthShell>
  );
}
