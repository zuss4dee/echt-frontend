import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Where users land after a successful magic-link / OAuth exchange. */
const POST_LOGIN_PATH = "/analyze";
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
    // Build redirect first; Supabase will attach Set-Cookie to this response in setAll.
    const redirectResponse = NextResponse.redirect(new URL(POST_LOGIN_PATH, origin));

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

    return redirectResponse;
  } catch {
    return redirectWithError();
  }
}
