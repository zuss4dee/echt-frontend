# Whop integration

## Webhook URL (production)

Register this URL in the Whop dashboard when creating a webhook:

`https://<your-domain>/api/webhooks/whop`

- Use **HTTPS** in production.
- For local testing, expose your dev server with a tunnel (e.g. ngrok) and use  
  `https://<ngrok-subdomain>.ngrok.io/api/webhooks/whop`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `WHOP_API_KEY` | Server-side Whop API key (from dashboard). |
| `WHOP_WEBHOOK_SECRET` | **Raw** signing secret from the Whop dashboard (e.g. `ws_...`). Not the API key. The app base64-encodes this when constructing `@whop/sdk` (per Whop / Standard Webhooks). |
| `WHOP_PRODUCT_ID` | Defaults to `prod_n4pIDJRqfBUx0` — must match the product you pass to `users.checkAccess`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Lets the webhook upsert `public.whop_entitlements` (never expose to the client). |
| `WHOP_SKIP_SUBSCRIPTION_GATE` | Set to `true` **only in local dev** to skip the paywall. |
| `NEXT_PUBLIC_APP_URL` | Site origin (e.g. `https://www.useecht.com`). Used to build the **post-checkout return URL** appended to hosted Whop checkout links (`/login?checkout=success`). |
| `NEXT_PUBLIC_WHOP_CHECKOUT_SUCCESS_PARAM` | Optional. **Primary** query param for the post-checkout URL. Defaults to **`redirect_url`**. The code also appends **`onSuccess`** with the same URL when the primary name isn’t `onSuccess`, so different Whop versions still return buyers to Echt. |
| `NEXT_PUBLIC_WHOP_FORUM_URL` | Public Whop **members’ forum** URL (Analyze shows **Join community** for paid, non-trial members). |
| `NEXT_PUBLIC_WHOP_SUPPORT_CHAT_URL` | Public Whop **support chat** URL (marketing “Contact”, pricing “Contact us”, Analyze “Contact support”). |
| `NEXT_PUBLIC_WHOP_PRODUCT_UPDATES_URL` | Public Whop **product updates** URL (e.g. `/contact` hub). |

## Hosted checkout → return to Echt (Phase 1)

- **Approach:** Keep Whop **hosted** checkout URLs (`https://whop.com/checkout/plan_...`) from `lib/pricing-plans.ts`.
- **Redirect:** `lib/whop-checkout-url.ts` appends **`redirect_url`** and **`onSuccess`** (same destination) so users return to **`{NEXT_PUBLIC_APP_URL}/login?checkout=success`** after payment. If **`NEXT_PUBLIC_APP_URL` is unset in Vercel**, no params are added—buyers stay on Whop’s default (often the community). **Set `NEXT_PUBLIC_APP_URL` in production.**
- **Dashboard (critical if you still land on Whop community):** In Whop **Settings → Checkout** (or product checkout settings), set the **post-purchase / success redirect** to your app (e.g. `https://www.useecht.com/login?checkout=success`). A dashboard “default to community” rule can override link params.
- **Embedded checkout** uses `returnUrl` / `onComplete` instead—that’s **Phase 2**, optional.

## Supabase Auth redirect URLs

- Magic links and OAuth still use **`/auth/callback`** — that path must stay in the Supabase **Redirect URL allow list** (e.g. `https://www.useecht.com/auth/callback`).
- Landing on **`/login?checkout=success`** after Whop does **not** need to be allowlisted **unless** you pass `/login` as Supabase `redirectTo` for email links. The app’s normal flow is: Whop → your site `/login` → user requests magic link → Supabase → `/auth/callback` → app.

## Database

Run `docs/sql/whop_entitlements.sql` in the Supabase SQL editor so the app can store subscription state keyed by email.

## Webhook secret format

`WHOP_WEBHOOK_SECRET` must be the **exact** string from the Whop dashboard (e.g. `ws_...`).  
Do **not** manually replace `ws_` with `whsec_` or pre-encode. The SDK client in `lib/whop-server.ts` base64-encodes the raw value for `webhookKey` (same idea as `btoa()` in Whop’s examples).

## Webhook API version (important)

`@whop/sdk` **`webhooks.unwrap()`** expects the **Standard Webhooks** shape (`webhook-id`, `webhook-timestamp`, `webhook-signature` headers, etc.), which Whop associates with **API version `v1`** for the webhook endpoint.

- In the Whop dashboard, edit your webhook and set **API version to `v1`** (not `v5`).  
- If the webhook is on **`v5`**, payload and signing can differ, and **`unwrap()` may always return 401** even when production deliveries work or when other tools accept the event.

## Testing: dashboard “Test” vs real events

- The dashboard **Test webhook** button can be unreliable (missing or incomplete signature headers / body vs a real delivery). A **401** from **`unwrap()`** there does not always mean production is broken.
- The reliable check is a **real** event: e.g. complete a **trial checkout** with a test account and watch **Vercel logs** and **`whop_entitlements`** for that delivery.
- A **200** response with `{"received":true}` means verification passed and the handler ran (your DB upsert still only runs for subscribed **`membership.*`** events that match **`WHOP_PRODUCT_ID`**).

## Flow

1. Whop sends `membership.*` webhooks → `/api/webhooks/whop` updates `whop_entitlements`.
2. The proxy checks `whop_entitlements.has_access` for `/analyze`, `/onboarding`, `/dashboard`.
3. Optional: `POST /api/whop/verify-access` calls `users.checkAccess` when `whop_user_id` is already stored (e.g. webhook was delayed).

## Security

- Rotate any API key that was pasted into chat or committed to git.
- Never put `WHOP_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables.
