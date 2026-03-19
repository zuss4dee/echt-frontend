import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "development") {
    const g = globalThis as typeof globalThis & { __echtSupabaseEnvWarned?: boolean };
    if (!g.__echtSupabaseEnvWarned) {
      g.__echtSupabaseEnvWarned = true;
      // eslint-disable-next-line no-console -- one-time dev hint; optional for landing-only
      console.warn(
        "[Echt] Supabase: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local when using the main app.",
      );
    }
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

