import type { UserProfileMetadata } from "@/lib/user-metadata";
import { isOnboardingComplete } from "@/lib/user-metadata";

export const AUTH_LOGIN_PATH = "/login";
export const AUTH_SIGNUP_PATH = "/signup";
export const AUTH_ONBOARDING_PATH = "/onboarding";
export const APP_ANALYZE_PATH = "/analyze";

export function getPostAuthPath(
  metadata: UserProfileMetadata | null | undefined,
): typeof AUTH_ONBOARDING_PATH | typeof APP_ANALYZE_PATH {
  return isOnboardingComplete(metadata) ? APP_ANALYZE_PATH : AUTH_ONBOARDING_PATH;
}
