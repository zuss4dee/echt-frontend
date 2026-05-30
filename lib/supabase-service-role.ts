import { createClient } from "@supabase/supabase-js";
import { readEnv } from "@/lib/env";

/**
 * Server-only Supabase client with the service role key. Bypasses RLS.
 * Use only in Route Handlers / server code — never import from Client Components.
 */
export function createServiceRoleClient() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
