/**
 * Client-side call to reconcile Whop access (same as onboarding / payment-pending polls).
 */
export async function postWhopVerifyAccess(): Promise<{
  hasAccess: boolean;
  reason?: string;
}> {
  const res = await fetch("/api/whop/verify-access", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    return { hasAccess: false, reason: "request_failed" };
  }
  const body = (await res.json()) as { has_access?: boolean; reason?: string };
  return {
    hasAccess: body.has_access === true,
    reason: body.reason,
  };
}

/** Reasons that mean the user is not a Whop member for this product (no subscription). */
export function isNoSubscriptionReason(reason: string | undefined): boolean {
  return (
    reason === "no_whop_member_for_email" ||
    reason === "member_lookup_failed" ||
    reason === "no_email"
  );
}
