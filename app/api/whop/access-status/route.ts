import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getWhopHasAccessFromDb } from "@/lib/whop-entitlements";

export const runtime = "nodejs";

/**
 * Returns whether the signed-in user has Whop access (same logic as proxy).
 * Used by onboarding to wait for webhook sync before navigating to Analyze.
 */
export async function GET() {
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
    return NextResponse.json({ hasAccess: false }, { status: 401 });
  }

  const hasAccess = await getWhopHasAccessFromDb(supabase, user.email);
  return NextResponse.json({ hasAccess });
}
