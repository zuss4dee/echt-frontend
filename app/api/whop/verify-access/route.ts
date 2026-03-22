import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { reconcileWhopEntitlementForEmail } from "@/lib/whop-reconcile";

export const runtime = "nodejs";

/**
 * Reconciles `whop_entitlements` with Whop's API (webhook delay / missing row).
 * Looks up the member by email when `whop_user_id` is not in the DB yet.
 */
export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Missing Supabase env" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options as CookieOptions),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { hasAccess, reason } = await reconcileWhopEntitlementForEmail(user.email);
    return NextResponse.json({ has_access: hasAccess, reason });
  } catch (e) {
    console.error("[whop verify-access]", e);
    return NextResponse.json({ error: "Whop reconcile failed" }, { status: 502 });
  }
}
