/** PKCE redirect for email confirmation (must be allow-listed in Supabase Auth → URL Configuration). */
export function getAuthCallbackUrl(origin: string): string {
  return `${origin}/auth/callback`;
}

/** PKCE redirect for password recovery (allow-list `/auth/recovery-callback` per host). */
export function getPasswordRecoveryCallbackUrl(origin: string): string {
  return `${origin}/auth/recovery-callback`;
}
