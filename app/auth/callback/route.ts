import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_LOGIN_PATH, getPostAuthPath } from "@/lib/auth-routing";

const LOGIN_ERROR_PATH = `${AUTH_LOGIN_PATH}?error=true`;

/**
 * Email confirmation and password recovery callback.
 * Allow-list this path per origin in Supabase → Auth → URL Configuration.
 * See frontend/docs/SUPABASE_AUTH.md for SMTP and Site URL setup.
 * Session cookies must be set on the same NextResponse we return.
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

    const redirectUrl = new URL(getPostAuthPath(user?.user_metadata), origin);

    const response = NextResponse.redirect(redirectUrl);
    sessionCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  } catch {
    return redirectWithError();
  }
}
