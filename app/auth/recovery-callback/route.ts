import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_LOGIN_PATH, AUTH_RESET_PASSWORD_PATH } from "@/lib/auth-routing";

const LOGIN_ERROR_PATH = `${AUTH_LOGIN_PATH}?error=true`;
const RESET_ERROR_PATH = `${AUTH_RESET_PASSWORD_PATH}?error=true`;

/**
 * PKCE callback for password recovery only — exchanges code, then sends user to set a new password.
 * Allow-list: https://<host>/auth/recovery-callback (per origin).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");

  const redirectWithError = () =>
    NextResponse.redirect(new URL(RESET_ERROR_PATH, origin));

  if (!code) {
    return NextResponse.redirect(new URL(LOGIN_ERROR_PATH, origin));
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

    const response = NextResponse.redirect(new URL(AUTH_RESET_PASSWORD_PATH, origin));
    sessionCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  } catch {
    return redirectWithError();
  }
}
