import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes Supabase auth cookies on matching routes and protects app routes.
 * Next.js 16+ uses the `proxy` file convention (formerly `middleware.ts`).
 * See: https://supabase.com/docs/guides/auth/server-side/nextjs
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

  // Do not add logic between createServerClient and getUser(); avoids flaky sessions.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedApp =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/analyze" ||
    pathname.startsWith("/analyze/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/");

  // Signed-in users should not stay on the login page.
  if (pathname === "/login" && user) {
    const onboardingDone = user.user_metadata?.onboarding_complete === true;
    const dest = onboardingDone ? "/analyze" : "/onboarding";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = dest;
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

  // Only gate on missing user; avoids redirect loops if a non-fatal getUser edge-case sets `error` without invalidating the session.
  if (isProtectedApp && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.delete("error");
    const redirectResponse = NextResponse.redirect(loginUrl);

    // Preserve refreshed/expired cookies on redirect so client stays in sync.
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(
        cookie.name,
        cookie.value,
        cookie as CookieOptions,
      );
    });

    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and image optimization.
     * This lets Supabase refresh the session before Server Components read cookies.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
