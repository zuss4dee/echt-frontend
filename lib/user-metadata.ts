/**
 * Supabase Auth `user.user_metadata` keys for onboarding and profile.
 * Keep in sync across onboarding, auth callback, and analyze.
 */
export type UserProfileMetadata = {
  full_name?: string;
  phone?: string;
  company_name?: string;
  role_in_company?: string;
  /** Stored value from onboarding select, e.g. "1-100" */
  monthly_references?: string;
  onboarding_complete?: boolean;
};

export function getProfileLetter(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0];
  if (!first) return "?";
  const ch = first[0];
  return ch ? ch.toUpperCase() : "?";
}

export function isOnboardingComplete(
  metadata: UserProfileMetadata | null | undefined,
): boolean {
  return Boolean(metadata?.onboarding_complete);
}
