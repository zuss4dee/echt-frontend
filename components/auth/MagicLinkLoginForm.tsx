"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { EchtWordmark } from "@/components/EchtLogo";

type MagicLinkLoginFormProps = {
  /** Set when redirected from `/auth/callback` with `?error=true`. */
  callbackError?: boolean;
  /** After Whop checkout, user lands on `/login?checkout=success`. */
  checkoutSuccess?: boolean;
};

export function MagicLinkLoginForm({
  callbackError = false,
  checkoutSuccess = false,
}: MagicLinkLoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    callbackError ? "That sign-in link is invalid or expired. Request a new one below." : null,
  );
  const [success, setSuccess] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message || "Something went wrong. Try again.");
        return;
      }

      setSentTo(trimmed);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="inline-block rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-900/20" aria-label="Echt home">
            <EchtWordmark className="block h-9 w-auto text-neutral-900 sm:h-10" />
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-[2rem] sm:leading-tight">
          Create an account
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">
          {checkoutSuccess
            ? "Enter the same email you used at Whop checkout below, then request your magic link."
            : "Enter your email below to create your account"}
        </p>
      </div>

      {checkoutSuccess ? (
        <div
          className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-[13px] leading-relaxed text-emerald-950"
          role="status"
        >
          <p className="font-medium text-emerald-950">Payment received</p>
        </div>
      ) : null}

      {success ? (
        <div
          className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-10 text-center"
          role="status"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
            <Mail className="h-6 w-6" aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-neutral-600">
            <span className="font-medium text-neutral-900">Check your email.</span>{" "}
            We sent a secure link to{" "}
            <span className="font-medium text-neutral-900">{sentTo}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setSentTo(null);
              setEmail("");
            }}
            className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            {checkoutSuccess ? (
              <p
                id="checkout-email-hint"
                className="mb-2 text-left text-[13px] font-medium text-neutral-600"
              >
                Email (same as Whop checkout)
              </p>
            ) : null}
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={checkoutSuccess ? "Same email you paid with" : "name@example.com"}
              aria-describedby={checkoutSuccess ? "checkout-email-hint" : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-[15px] text-neutral-900 shadow-sm placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
            />
            {error ? (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-neutral-900 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Sign In with Email"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-[13px] leading-relaxed text-neutral-500">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-6 text-center text-sm text-neutral-400">
        <Link href="/" className="underline-offset-4 hover:text-neutral-600 hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
