import type { AuthResponse } from "@supabase/supabase-js";

export type SignUpOutcome =
  | { kind: "session" }
  | { kind: "confirm_email" }
  | { kind: "already_registered"; confirmed: boolean };

/**
 * Supabase signUp quirks:
 * - Session present → email confirmation disabled (or user already confirmed).
 * - Empty identities → email already registered (no new confirmation email sent).
 * - Otherwise → confirmation required; check inbox (if SMTP is configured).
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
    const confirmed =
      Boolean(user.email_confirmed_at) ||
      Boolean((user as { confirmed_at?: string | null }).confirmed_at);
    return { kind: "already_registered", confirmed };
  }

  return { kind: "confirm_email" };
}
