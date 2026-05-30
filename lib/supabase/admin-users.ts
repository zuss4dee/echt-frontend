import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase-service-role";

/** Look up an auth user by email (small user bases; paginates admin list). */
export async function findAuthUserByEmail(email: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const supabase = createServiceRoleClient();
  let page = 1;
  const perPage = 200;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) return match;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}
