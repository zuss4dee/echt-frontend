import { NextResponse } from "next/server";
import { getWhopProductId } from "@/lib/whop-config";
import { createServiceRoleClient } from "@/lib/supabase-service-role";
import { getWhopClient } from "@/lib/whop-server";

export const runtime = "nodejs";

const TABLE = "whop_entitlements";

function headersToRecord(request: Request): Record<string, string> {
  const out: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function membershipAllowsAccess(status: string): boolean {
  return status === "trialing" || status === "active" || status === "past_due";
}

async function upsertEntitlement(input: {
  email: string;
  whopUserId: string;
  productId: string;
  hasAccess: boolean;
  membershipStatus: string;
}) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from(TABLE).upsert(
    {
      email: input.email.trim().toLowerCase(),
      whop_user_id: input.whopUserId,
      whop_product_id: input.productId,
      has_access: input.hasAccess,
      membership_status: input.membershipStatus,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );
  if (error) {
    console.error("[whop webhook] upsert error:", error.message);
    throw error;
  }
}

type MembershipPayload = {
  status: string;
  product?: { id: string } | null;
  user?: { id: string; email?: string | null } | null;
};

async function handleMembershipEvent(
  type: string,
  data: MembershipPayload,
) {
  const targetProduct = getWhopProductId();
  const productId = data.product?.id;
  if (!productId || productId !== targetProduct) {
    return;
  }

  const user = data.user;
  if (!user?.id) {
    console.warn("[whop webhook] membership event without user id");
    return;
  }

  const email = user.email?.trim().toLowerCase();
  if (!email) {
    console.warn("[whop webhook] membership event without user email");
    return;
  }

  if (type === "membership.deactivated") {
    await upsertEntitlement({
      email,
      whopUserId: user.id,
      productId,
      hasAccess: false,
      membershipStatus: String(data.status),
    });
    return;
  }

  const hasAccess = membershipAllowsAccess(String(data.status));
  await upsertEntitlement({
    email,
    whopUserId: user.id,
    productId,
    hasAccess,
    membershipStatus: String(data.status),
  });
}

/**
 * Whop sends signed webhooks here. Register in Whop dashboard:
 * `https://<your-domain>/api/webhooks/whop`
 *
 * Set `WHOP_WEBHOOK_SECRET` to the **raw** secret from Whop (`ws_...`).
 * Encoding for `unwrap()` is applied in `getWhopClient()` — do not pass a
 * second `key` here or verification will fail.
 */
export async function POST(request: Request) {
  if (!process.env.WHOP_WEBHOOK_SECRET?.trim()) {
    console.error("[whop webhook] WHOP_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();

  try {
    const whop = getWhopClient();
    const event = whop.webhooks.unwrap(rawBody, {
      headers: headersToRecord(request),
    }) as { type: string; data: MembershipPayload };

    switch (event.type) {
      case "membership.activated":
      case "membership.deactivated":
      case "membership.cancel_at_period_end_changed":
        await handleMembershipEvent(event.type, event.data);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (
      message.includes("signature") ||
      message.includes("Missing required headers") ||
      message.includes("Webhook key")
    ) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
    }
    console.error("[whop webhook]", message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
