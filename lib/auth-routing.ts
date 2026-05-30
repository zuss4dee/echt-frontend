import type { UserProfileMetadata } from "@/lib/user-metadata";
import { isOnboardingComplete } from "@/lib/user-metadata";

export const AUTH_LOGIN_PATH = "/login";
export const AUTH_SIGNUP_PATH = "/signup";
/** Post-Polar checkout account creation (requires `session_id`). */
export const POST_PAYMENT_ONBOARDING_PATH = "/onboarding";
/** Signed-in workspace clearance after auth (agency + first scan). */
export const AUTH_SETUP_PATH = "/setup";
/** @deprecated Use AUTH_SETUP_PATH for auth guards; POST_PAYMENT_ONBOARDING_PATH for checkout. */
export const AUTH_ONBOARDING_PATH = AUTH_SETUP_PATH;
export const AUTH_RESET_PASSWORD_PATH = "/reset-password";
export const APP_ANALYZE_PATH = "/analyze";
export const PRICING_PATH = "/#partners";

/** Post-auth redirects allowed from `/auth/callback?next=…` */
export const AUTH_CALLBACK_NEXT_PATHS = [AUTH_RESET_PASSWORD_PATH] as const;

export function resolveAuthCallbackNext(
  next: string | null,
): (typeof AUTH_CALLBACK_NEXT_PATHS)[number] | null {
  if (!next) return null;
  return AUTH_CALLBACK_NEXT_PATHS.includes(next as (typeof AUTH_CALLBACK_NEXT_PATHS)[number])
    ? (next as (typeof AUTH_CALLBACK_NEXT_PATHS)[number])
    : null;
}

export function getPostAuthPath(
  metadata: UserProfileMetadata | null | undefined,
): typeof AUTH_SETUP_PATH | typeof APP_ANALYZE_PATH {
  return isOnboardingComplete(metadata) ? APP_ANALYZE_PATH : AUTH_SETUP_PATH;
}
