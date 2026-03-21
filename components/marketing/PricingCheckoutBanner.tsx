"use client";

import { useSearchParams } from "next/navigation";

/**
 * Optional banner when users land on `/pricing` after Whop checkout (`?checkout=success`).
 */
export function PricingCheckoutBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("checkout") !== "success") return null;

  return (
    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-950">
      <p className="mx-auto max-w-2xl leading-relaxed">
        <span className="font-semibold">You&apos;re almost there.</span> Sign in with the{" "}
        <strong>same email</strong> you used at checkout, then open <strong>Analyze</strong> from your
        account.
      </p>
    </div>
  );
}
