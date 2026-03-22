import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { UserProfileMetadata } from "@/lib/user-metadata";

/**
 * Upserts `public.profiles` so Supabase Table Editor shows name, phone, company, etc.
 * RLS: authenticated users may only write their own row (`id` = `auth.uid()`).
 */
export async function upsertPublicProfile(
  user: Pick<User, "id" | "email">,
  meta: UserProfileMetadata,
): Promise<{ error: Error | null }> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: meta.full_name ?? null,
      phone: meta.phone ?? null,
      company_name: meta.company_name ?? null,
      role_in_company: meta.role_in_company ?? null,
      monthly_references: meta.monthly_references ?? null,
      onboarding_complete: meta.onboarding_complete ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  return { error: error ? new Error(error.message) : null };
}
