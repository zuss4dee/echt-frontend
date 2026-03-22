import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getWhopHasAccessFromDb } from "@/lib/whop-entitlements";
import { reconcileWhopEntitlementForEmail } from "@/lib/whop-reconcile";

function needsPlanRedirect(origin: string) {
  const redirectUrl = new URL("/", origin);
  redirectUrl.searchParams.set("subscribe", "1");
  redirectUrl.searchParams.set("needs_plan", "1");
  return redirectUrl;
}

async function resolveWhopAccess(
  supabase: SupabaseClient,
  email: string | undefined,
): Promise<boolean> {
  let hasWhop = await getWhopHasAccessFromDb(supabase, email);
  if (!hasWhop && email) {
    await reconcileWhopEntitlementForEmail(email);
    hasWhop = await getWhopHasAccessFromDb(supabase, email);
  }
  return hasWhop;
}

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
  const isOnboarding =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isProtectedApp =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/analyze" ||
    pathname.startsWith("/analyze/") ||
    isOnboarding;

  // Signed-in users should not stay on the login page.
  if (pathname === "/login" && user) {
    const hasWhop = await resolveWhopAccess(supabase, user.email);
    const onboardingDone = user.user_metadata?.onboarding_complete === true;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("error");

    if (hasWhop && onboardingDone) {
      redirectUrl.pathname = "/analyze";
    } else if (hasWhop && !onboardingDone) {
      redirectUrl.pathname = "/onboarding";
    } else {
      const redirectResponse = NextResponse.redirect(
        needsPlanRedirect(request.nextUrl.origin),
      );
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(
          cookie.name,
          cookie.value,
          cookie as CookieOptions,
        );
      });
      return redirectResponse;
    }

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

  // Onboarding is only for users with an active Whop subscription (reconcile handles webhook delay).
  if (isOnboarding && user) {
    const hasWhop = await resolveWhopAccess(supabase, user.email);
    if (!hasWhop) {
      const redirectResponse = NextResponse.redirect(
        needsPlanRedirect(request.nextUrl.origin),
      );
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(
          cookie.name,
          cookie.value,
          cookie as CookieOptions,
        );
      });
      return redirectResponse;
    }
  }

  if (isProtectedApp && user && !isOnboarding) {
    const hasWhop = await getWhopHasAccessFromDb(supabase, user.email);
    if (!hasWhop) {
      const redirectUrl = new URL("/", request.nextUrl.origin);
      redirectUrl.searchParams.set("subscribe", "1");
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
