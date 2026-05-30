import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  APP_ANALYZE_PATH,
  AUTH_LOGIN_PATH,
  AUTH_RESET_PASSWORD_PATH,
  AUTH_SETUP_PATH,
  AUTH_SIGNUP_PATH,
  POST_PAYMENT_ONBOARDING_PATH,
  getPostAuthPath,
} from "@/lib/auth-routing";

/**
 * Refreshes Supabase auth cookies and enforces the auth flow:
 * pay → /onboarding (account) → /setup (clearance) → /analyze
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[proxy] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as CookieOptions),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === AUTH_LOGIN_PATH;
  const isSignup = pathname === AUTH_SIGNUP_PATH;
  const isResetPassword =
    pathname === AUTH_RESET_PASSWORD_PATH ||
    pathname.startsWith(`${AUTH_RESET_PASSWORD_PATH}/`);
  const isAuthEntry = isLogin || isSignup;
  const isPostPaymentOnboarding =
    pathname === POST_PAYMENT_ONBOARDING_PATH ||
    pathname.startsWith(`${POST_PAYMENT_ONBOARDING_PATH}/`);
  const isSetup =
    pathname === AUTH_SETUP_PATH || pathname.startsWith(`${AUTH_SETUP_PATH}/`);
  const isAppRoute =
    pathname === APP_ANALYZE_PATH ||
    pathname.startsWith(`${APP_ANALYZE_PATH}/`) ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const metadata = user?.user_metadata;
  const onboardingDone = metadata?.onboarding_complete === true;

  function redirectTo(path: string) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = path;
    redirectUrl.searchParams.delete("error");
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(
        cookie.name,
        cookie.value,
        cookie as CookieOptions,
      );
    });
    return redirectResponse;
  }

  if (user && isAuthEntry) {
    return redirectTo(getPostAuthPath(metadata));
  }

  // Recovery session must stay on reset-password until a new password is set.
  if (user && isResetPassword) {
    return supabaseResponse;
  }

  if (user && onboardingDone && isSetup) {
    return redirectTo(APP_ANALYZE_PATH);
  }

  if (user && !onboardingDone && isAppRoute) {
    return redirectTo(AUTH_SETUP_PATH);
  }

  if (!user && (isSetup || isAppRoute)) {
    return redirectTo(AUTH_LOGIN_PATH);
  }

  // Post-payment onboarding is public (session_id validated client-side).
  if (isPostPaymentOnboarding) {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
