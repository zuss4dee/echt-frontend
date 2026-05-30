import type { AuthResponse } from "@supabase/supabase-js";

export type SignUpOutcome =
  | { kind: "session" }
  | { kind: "confirm_email" }
  /** Supabase hides duplicate signups; resolve via /api/auth/email-status */
  | { kind: "duplicate_signup" };

/**
 * Supabase signUp quirks:
 * - Session present → email confirmation disabled (or user already confirmed).
 * - Empty identities → duplicate signup (obfuscated; no new email). Check server for real status.
 * - Otherwise → new user; confirmation email was sent.
 */
export function interpretSignUpResponse(data: AuthResponse["data"]): SignUpOutcome {
  if (data.session) {
    return { kind: "session" };
  }

  const user = data.user;
  if (!user) {
    return { kind: "confirm_email" };
  }

  const identities = user.identities ?? [];
  if (identities.length === 0) {
    return { kind: "duplicate_signup" };
  }

  return { kind: "confirm_email" };
}
