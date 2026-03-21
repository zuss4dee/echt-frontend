/**
 * Hosted Whop checkout links: append post-purchase return URL.
 *
 * **Phase 1:** query param on the checkout URL (see Whop “Checkout links” docs).
 * Default param name is `onSuccess` (documented for hosted links). If Whop changes
 * this or your dashboard uses another name, set `NEXT_PUBLIC_WHOP_CHECKOUT_SUCCESS_PARAM`.
 *
 * **Phase 2 (optional):** embedded checkout uses `returnUrl` / `onComplete` instead — not handled here.
 */

import { getPostCheckoutLoginPath } from "@/lib/whop-post-checkout-path";

function getSuccessParamName(): string {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_SUCCESS_PARAM?.trim() || "onSuccess";
}

/**
 * Absolute URL users land on after successful hosted checkout (sign in with same email as Whop).
 */
export function getPostCheckoutLoginUrl(): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  if (!base) return "";
  return `${base}${getPostCheckoutLoginPath()}`;
}

/**
 * Append post-checkout redirect to a Whop hosted checkout URL. If `NEXT_PUBLIC_APP_URL`
 * is unset, returns `checkoutUrl` unchanged (no redirect param).
 */
export function withPostCheckoutRedirect(checkoutUrl: string): string {
  const returnUrl = getPostCheckoutLoginUrl();
  if (!returnUrl) return checkoutUrl;
  const param = getSuccessParamName();
  const sep = checkoutUrl.includes("?") ? "&" : "?";
  return `${checkoutUrl}${sep}${param}=${encodeURIComponent(returnUrl)}`;
}
