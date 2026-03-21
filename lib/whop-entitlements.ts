import type { SupabaseClient } from "@supabase/supabase-js";

const TABLE = "whop_entitlements";

/**
 * Whether subscription gating should be skipped (e.g. local dev).
 * Set WHOP_SKIP_SUBSCRIPTION_GATE=true in .env.local only when needed.
 */
export function shouldSkipWhopGate(): boolean {
  return process.env.WHOP_SKIP_SUBSCRIPTION_GATE === "true";
}

/**
 * Read entitlement for the signed-in user (anon + RLS: own email only).
 */
export async function getWhopHasAccessFromDb(
  supabase: SupabaseClient,
  email: string | undefined,
): Promise<boolean> {
  if (shouldSkipWhopGate()) return true;
  if (!email) return false;

  const { data, error } = await supabase
    .from(TABLE)
    .select("has_access")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("[whop] whop_entitlements select error:", error.message);
    return false;
  }

  return data?.has_access === true;
}
