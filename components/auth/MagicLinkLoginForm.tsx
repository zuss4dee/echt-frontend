"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { EchtWordmark } from "@/components/EchtLogo";

type MagicLinkLoginFormProps = {
  /** Set when redirected from `/auth/callback` with `?error=true`. */
  callbackError?: boolean;
};

export function MagicLinkLoginForm({ callbackError = false }: MagicLinkLoginFormProps) {
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
      setError("Enter your work email.");
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
    <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl shadow-black/50">
      <div className="flex flex-col items-center text-center">
        <EchtWordmark className="h-8 w-auto text-white" aria-label="Echt" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          Sign in to your dashboard
        </h1>
        <p className="mt-2 mb-8 text-sm text-zinc-400">
          Enter your work email to receive a secure login link.
        </p>
      </div>

      {success ? (
        <div
          className="flex flex-col items-center gap-4 rounded-lg border border-white/10 bg-zinc-950/50 px-4 py-8 text-center"
          role="status"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
            <Mail className="h-6 w-6" aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            <span className="font-medium text-white">Check your email.</span>{" "}
            We sent a secure link to{" "}
            <span className="font-medium text-white">{sentTo}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setSentTo(null);
              setEmail("");
            }}
            className="text-sm font-medium text-purple-400 underline-offset-4 hover:text-purple-300 hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-1" noValidate>
          <label htmlFor="email" className="sr-only">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 transition-all focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-60"
          />
          {error ? (
            <p className="pt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-white py-3 font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending…" : "Send Magic Link"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-xs text-zinc-500">
        <Link href="/" className="underline-offset-4 hover:text-zinc-400 hover:underline">
          ← Back to marketing site
        </Link>
      </p>
    </div>
  );
}
