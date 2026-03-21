import Whop from "@whop/sdk";

let client: Whop | null = null;

/** Singleton Whop API client (server-only). */
export function getWhopClient(): Whop {
  if (!client) {
    const apiKey = process.env.WHOP_API_KEY;
    if (!apiKey) {
      throw new Error("Missing WHOP_API_KEY");
    }
    const webhookKey = process.env.WHOP_WEBHOOK_SECRET ?? null;
    client = new Whop({ apiKey, webhookKey });
  }
  return client;
}
