import { NextResponse } from "next/server";
import { findAuthUserByEmail } from "@/lib/supabase/admin-users";

export type EmailAuthStatus = "available" | "unconfirmed" | "confirmed";

/**
 * Resolves real account state when signUp returns obfuscated duplicate responses
 * (empty identities, no email_confirmed_at in the client payload).
 */
export async function POST(request: Request) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: string };
    email = String(body.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  try {
    const user = await findAuthUserByEmail(email);
    if (!user) {
      return NextResponse.json({ status: "available" satisfies EmailAuthStatus });
    }
    if (user.email_confirmed_at) {
      return NextResponse.json({ status: "confirmed" satisfies EmailAuthStatus });
    }
    return NextResponse.json({ status: "unconfirmed" satisfies EmailAuthStatus });
  } catch (e) {
    console.error("[email-status]", e);
    return NextResponse.json({ error: "Could not check email status" }, { status: 500 });
  }
}
