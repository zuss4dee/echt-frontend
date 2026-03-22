"use client";

import { useSearchParams } from "next/navigation";

/**
 * Banner on the marketing home after Whop checkout (`checkout=success`). Payment-pending UX uses
 * `MarketingPaymentPendingGate` + `PaymentPendingModal` when `access_pending=1`.
 */
export function PricingCheckoutBanner() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";

  if (checkoutSuccess) {
    return (
      <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-950">
        <p className="mx-auto max-w-2xl leading-relaxed">
          <span className="font-semibold">You&apos;re almost there.</span> Sign in with the{" "}
          <strong>same email</strong> you used at checkout, then open <strong>Echt AI</strong> from your
          account.
        </p>
      </div>
    );
  }

  return null;
}
