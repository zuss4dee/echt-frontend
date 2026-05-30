/** PKCE / magic-link redirect target (must be allow-listed in Supabase Auth → URL Configuration). */
export function getAuthCallbackUrl(origin: string): string {
  return `${origin}/auth/callback`;
}
