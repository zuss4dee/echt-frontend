/**
 * Hosted Whop checkout links: append post-purchase return URL.
 *
 * Whop has used both `redirect_url` and `onSuccess` in docs over time. We append **both**
 * with the same destination so either the link param or the dashboard “success URL”
 * wiring picks it up. Override the primary name with `NEXT_PUBLIC_WHOP_CHECKOUT_SUCCESS_PARAM`
 * (single param only) if you need to match a specific integration.
 *
 * **Also set** Whop Dashboard → Settings → Checkout → success / redirect URL to your
 * site if purchases still land on the community page (dashboard can override links).
 *
 * **Phase 2 (optional):** embedded checkout uses `returnUrl` / `onComplete` instead — not handled here.
 */

import { getPostCheckoutLoginPath } from "@/lib/whop-post-checkout-path";

function getPrimaryRedirectParamName(): string {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_SUCCESS_PARAM?.trim() || "redirect_url";
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

  const encoded = encodeURIComponent(returnUrl);
  const primary = getPrimaryRedirectParamName();

  const parts: string[] = [`${primary}=${encoded}`];
  // Secondary alias so older Whop flows that only read `onSuccess` still return to Echt.
  if (primary !== "onSuccess") {
    parts.push(`onSuccess=${encoded}`);
  }
  if (primary !== "redirect_url") {
    parts.push(`redirect_url=${encoded}`);
  }

  const sep = checkoutUrl.includes("?") ? "&" : "?";
  return `${checkoutUrl}${sep}${parts.join("&")}`;
}
