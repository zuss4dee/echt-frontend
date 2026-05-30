import { NextResponse } from "next/server";
import { readEnv } from "@/lib/env";

type ContactBody = {
  corporate_entity?: string;
  portfolio_volume?: string;
  operational_region?: string;
  preferred_contact?: string;
  inquiry_details?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const corporate_entity = body.corporate_entity?.trim() ?? "";
  const portfolio_volume = body.portfolio_volume?.trim() ?? "";
  const operational_region = body.operational_region?.trim() ?? "";
  const preferred_contact = body.preferred_contact?.trim() ?? "";
  const inquiry_details = body.inquiry_details?.trim() ?? "";

  if (!corporate_entity || !preferred_contact || !inquiry_details) {
    return NextResponse.json(
      { error: "Corporate entity, preferred contact, and inquiry details are required." },
      { status: 400 },
    );
  }

  const apiKey = readEnv("RESEND_API_KEY");
  const inbox = readEnv("CONTACT_INBOX_EMAIL");
  const from = readEnv("CONTACT_FROM_EMAIL") ?? "Echt <hello@useecht.com>";

  if (!apiKey || !inbox) {
    return NextResponse.json(
      { error: "Contact delivery is not configured." },
      { status: 503 },
    );
  }

  const subject = `[Echt website] B2B inquiry — ${corporate_entity}`;
  const text = [
    `Corporate entity: ${corporate_entity}`,
    `Portfolio volume: ${portfolio_volume || "—"}`,
    `Operational region: ${operational_region || "—"}`,
    `Preferred contact: ${preferred_contact}`,
    "",
    "Inquiry details:",
    inquiry_details,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [inbox],
        reply_to: preferred_contact.includes("@") ? preferred_contact : undefined,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      console.error("[contact/submit] Resend error:", err);
      return NextResponse.json(
        { error: err.message || "Could not send inquiry." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact/submit]", e);
    return NextResponse.json({ error: "Could not send inquiry." }, { status: 500 });
  }
}
