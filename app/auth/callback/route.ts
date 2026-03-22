import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getWhopHasAccessFromDb } from "@/lib/whop-entitlements";
import { reconcileWhopEntitlementForEmail } from "@/lib/whop-reconcile";

const ANALYZE_PATH = "/analyze";
const ONBOARDING_PATH = "/onboarding";
const LOGIN_ERROR_PATH = "/login?error=true";

function needsPlanUrl(origin: string) {
  const u = new URL("/", origin);
  u.searchParams.set("subscribe", "1");
  u.searchParams.set("needs_plan", "1");
  return u;
}

/**
 * OAuth / email magic-link PKCE callback.
 *
 * Important: Session cookies must be set on the *same* `NextResponse` we return.
 * Returning a fresh `NextResponse.redirect()` after `cookies().set()` drops Set-Cookie
 * so the next request has no session.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");

  const redirectWithError = () =>
    NextResponse.redirect(new URL(LOGIN_ERROR_PATH, origin));

  if (!code) {
    return redirectWithError();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectWithError();
  }

  try {
    const cookieStore = await cookies();
    /** Capture Set-Cookie options so the final redirect keeps a valid session (path/httpOnly/etc.). */
    const sessionCookies: { name: string; value: string; options: CookieOptions }[] = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            sessionCookies.push({
              name,
              value,
              options: options as CookieOptions,
            });
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectWithError();
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let hasWhop = await getWhopHasAccessFromDb(supabase, user?.email);
    if (!hasWhop && user?.email) {
      const r = await reconcileWhopEntitlementForEmail(user.email);
      hasWhop = r.hasAccess;
      if (!hasWhop) {
        hasWhop = await getWhopHasAccessFromDb(supabase, user.email);
      }
    }
    // Only treat explicit true as done — Boolean("false") is true; missing key must mean onboarding.
    const onboardingDone = user?.user_metadata?.onboarding_complete === true;

    // Onboarding is only for paying members; others go to marketing with needs_plan.
    let redirectUrl: URL;
    if (hasWhop && onboardingDone) {
      redirectUrl = new URL(ANALYZE_PATH, origin);
    } else if (hasWhop && !onboardingDone) {
      redirectUrl = new URL(ONBOARDING_PATH, origin);
    } else {
      redirectUrl = needsPlanUrl(origin);
    }

    const response = NextResponse.redirect(redirectUrl);
    sessionCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  } catch {
    return redirectWithError();
  }
}
