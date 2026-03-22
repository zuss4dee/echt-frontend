import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getWhopHasAccessFromDb } from "@/lib/whop-entitlements";

const ANALYZE_PATH = "/analyze";
const ONBOARDING_PATH = "/onboarding";
const LOGIN_ERROR_PATH = "/login?error=true";

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

    const hasWhop = await getWhopHasAccessFromDb(supabase, user?.email);
    // Only treat explicit true as done — Boolean("false") is true; missing key must mean onboarding.
    const onboardingDone = user?.user_metadata?.onboarding_complete === true;

    // Never send users to /pricing from here when Whop has not synced yet (webhook delay after
    // payment). Always land on onboarding until has_access is true; onboarding checks access
    // before sending anyone to /analyze.
    let nextPath: string;
    if (hasWhop && onboardingDone) {
      nextPath = ANALYZE_PATH;
    } else {
      nextPath = ONBOARDING_PATH;
    }

    const redirectUrl = new URL(nextPath, origin);

    const response = NextResponse.redirect(redirectUrl);
    sessionCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  } catch {
    return redirectWithError();
  }
}
