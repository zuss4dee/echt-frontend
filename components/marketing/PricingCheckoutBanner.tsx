"use client";

import { useSearchParams } from "next/navigation";

/**
 * Banners when users land on `/pricing` after checkout or while access is still syncing.
 */
export function PricingCheckoutBanner() {
  const searchParams = useSearchParams();
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const accessPending = searchParams.get("access_pending") === "1";

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

  if (accessPending) {
    return (
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
        <p className="mx-auto max-w-2xl leading-relaxed">
          <span className="font-semibold">We&apos;re still confirming your subscription.</span> Wait a
          minute, refresh this page, or sign out and sign in again with the same email you used on Whop.
          If it persists, use Contact us on the marketing site.
        </p>
      </div>
    );
  }

  return null;
}
