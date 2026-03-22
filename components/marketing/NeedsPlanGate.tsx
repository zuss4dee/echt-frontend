"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function scrollToPricing() {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Shown when the user needs an active Whop plan (`needs_plan=1` on the marketing URL).
 */
export function NeedsPlanGate() {
  const searchParams = useSearchParams();
  const needsPlan = searchParams.get("needs_plan") === "1";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (needsPlan) {
      setOpen(true);
      const t = window.setTimeout(() => scrollToPricing(), 200);
      return () => window.clearTimeout(t);
    }
  }, [needsPlan]);

  if (!needsPlan || !open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Close"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="needs-plan-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-2xl"
      >
        <h2
          id="needs-plan-title"
          className="text-center text-lg font-semibold tracking-tight text-zinc-900"
        >
          Subscription required
        </h2>
        <p className="mt-3 text-center text-[15px] leading-relaxed text-zinc-600">
          Choose a plan below to use <span className="font-medium text-zinc-800">Echt AI</span>. If
          you already paid, make sure you sign in with the <strong>same email</strong> you used at
          checkout.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              scrollToPricing();
              setOpen(false);
            }}
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            View plans
          </button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
