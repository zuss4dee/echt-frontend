import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    // Placeholder redirect; Supabase attaches Set-Cookie via setAll. Path updated after session exists.
    const redirectResponse = NextResponse.redirect(new URL(ANALYZE_PATH, origin));

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            redirectResponse.cookies.set(
              name,
              value,
              options as CookieOptions,
            );
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

    const onboardingDone = Boolean(user?.user_metadata?.onboarding_complete);
    const nextPath = onboardingDone ? ANALYZE_PATH : ONBOARDING_PATH;

    if (nextPath === ANALYZE_PATH) {
      return redirectResponse;
    }

    const finalResponse = NextResponse.redirect(new URL(nextPath, origin));
    redirectResponse.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value);
    });
    return finalResponse;
  } catch {
    return redirectWithError();
  }
}
