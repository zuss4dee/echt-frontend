"use client";

import { Loader2 } from "lucide-react";

type PaymentPendingModalProps = {
  open: boolean;
  /** Extra line when user should sign in first (e.g. no session). */
  hint?: string | null;
};

/**
 * Blocking dialog while Whop subscription is confirmed; user is then sent to Echt AI (Analyze).
 */
export function PaymentPendingModal({ open, hint }: PaymentPendingModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-pending-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-2xl"
      >
        <div className="flex justify-center">
          <Loader2
            className="h-9 w-9 animate-spin text-violet-600"
            aria-hidden
          />
        </div>
        <h2
          id="payment-pending-title"
          className="mt-5 text-center text-lg font-semibold tracking-tight text-zinc-900"
        >
          Confirming your payment
        </h2>
        <p className="mt-3 text-center text-[15px] leading-relaxed text-zinc-600">
          Please hold on while we confirm your payment. You&apos;ll be redirected to{" "}
          <span className="font-medium text-zinc-800">Echt AI</span> shortly.
        </p>
        {hint ? (
          <p className="mt-4 text-center text-sm text-zinc-500">{hint}</p>
        ) : null}
        <p className="mt-6 text-center text-xs text-zinc-400">Checking access…</p>
      </div>
    </div>
  );
}
