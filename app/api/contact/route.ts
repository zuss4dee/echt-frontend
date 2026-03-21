import { NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_MESSAGE = 8000;
const MAX_NAME = 200;

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — must be empty */
  website?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website != null && String(body.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = isNonEmptyString(body.name) ? body.name.trim().slice(0, MAX_NAME) : "";
  const email = isNonEmptyString(body.email) ? body.email.trim().slice(0, 320) : "";
  const message = isNonEmptyString(body.message) ? body.message.trim().slice(0, MAX_MESSAGE) : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Echt <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Contact form is not configured on the server." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[Echt website] Message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Could not send message. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
