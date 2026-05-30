import type { UserProfileMetadata } from "@/lib/user-metadata";
import { isOnboardingComplete } from "@/lib/user-metadata";

export const AUTH_LOGIN_PATH = "/login";
export const AUTH_SIGNUP_PATH = "/signup";
export const AUTH_ONBOARDING_PATH = "/onboarding";
export const AUTH_RESET_PASSWORD_PATH = "/reset-password";
export const APP_ANALYZE_PATH = "/analyze";

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
): typeof AUTH_ONBOARDING_PATH | typeof APP_ANALYZE_PATH {
  return isOnboardingComplete(metadata) ? APP_ANALYZE_PATH : AUTH_ONBOARDING_PATH;
}
