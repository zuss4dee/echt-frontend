import Whop from "@whop/sdk";

let client: Whop | null = null;

/**
 * Whop dashboard gives the raw signing secret (e.g. `ws_...`).
 * `@whop/sdk` / Standard Webhooks expect `webhookKey` to be base64-encoded
 * (equivalent to `btoa(secret)` in the browser). See Whop webhook docs.
 */
export function encodeWhopWebhookSecretForSdk(raw: string): string {
  return Buffer.from(raw, "utf8").toString("base64");
}

/** Singleton Whop API client (server-only). */
export function getWhopClient(): Whop {
  if (!client) {
    const apiKey = process.env.WHOP_API_KEY;
    if (!apiKey) {
      throw new Error("Missing WHOP_API_KEY");
    }
    const rawWebhook = process.env.WHOP_WEBHOOK_SECRET ?? null;
    const webhookKey =
      rawWebhook != null && rawWebhook.length > 0
        ? encodeWhopWebhookSecretForSdk(rawWebhook)
        : null;
    client = new Whop({ apiKey, webhookKey });
  }
  return client;
}
