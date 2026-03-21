import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getWhopProductId } from "@/lib/whop-config";
import { createServiceRoleClient } from "@/lib/supabase-service-role";
import { getWhopClient } from "@/lib/whop-server";

export const runtime = "nodejs";

/**
 * Optional: after login, call this to reconcile `whop_entitlements` with Whop's API
 * when the webhook was delayed. Requires a stored `whop_user_id` for the user.
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

  const admin = createServiceRoleClient();
  const { data: row } = await admin
    .from("whop_entitlements")
    .select("whop_user_id")
    .eq("email", user.email.trim().toLowerCase())
    .maybeSingle();

  const whopUserId = row?.whop_user_id as string | undefined;
  if (!whopUserId) {
    return NextResponse.json({
      has_access: false,
      reason: "no_whop_user_id_yet",
    });
  }

  try {
    const whop = getWhopClient();
    const productId = getWhopProductId();
    const access = await whop.users.checkAccess(productId, { id: whopUserId });

    await admin
      .from("whop_entitlements")
      .update({
        has_access: access.has_access,
        whop_product_id: productId,
        updated_at: new Date().toISOString(),
      })
      .eq("email", user.email.trim().toLowerCase());

    return NextResponse.json({ has_access: access.has_access });
  } catch (e) {
    console.error("[whop verify-access]", e);
    return NextResponse.json({ error: "Whop API error" }, { status: 502 });
  }
}
