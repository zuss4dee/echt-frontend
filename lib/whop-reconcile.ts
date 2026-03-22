import { createServiceRoleClient } from "@/lib/supabase-service-role";
import { getWhopProductId } from "@/lib/whop-config";
import { getWhopClient } from "@/lib/whop-server";
import { shouldSkipWhopGate } from "@/lib/whop-entitlements";

const TABLE = "whop_entitlements";

/** Cached from product retrieve (avoids repeated Whop calls per server instance). */
let cachedCompanyId: string | null = null;

async function resolveCompanyId(productId: string): Promise<string> {
  const fromEnv = process.env.WHOP_COMPANY_ID?.trim();
  if (fromEnv) return fromEnv;
  if (cachedCompanyId) return cachedCompanyId;
  const whop = getWhopClient();
  const product = await whop.products.retrieve(productId);
  cachedCompanyId = product.company.id;
  return cachedCompanyId;
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
    console.error("[whop reconcile] upsert error:", error.message);
    throw error;
  }
}

/**
 * Calls Whop API to resolve subscription for this email, then upserts `whop_entitlements`.
 * Use when webhooks are delayed or the row was never created.
 */
export async function reconcileWhopEntitlementForEmail(
  email: string,
): Promise<{ hasAccess: boolean; reason?: string }> {
  if (shouldSkipWhopGate()) {
    return { hasAccess: true };
  }

  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm) {
    return { hasAccess: false, reason: "no_email" };
  }

  try {
    return await reconcileWhopEntitlementForEmailInner(emailNorm);
  } catch (e) {
    console.error("[whop reconcile] unexpected:", e);
    return { hasAccess: false, reason: "reconcile_failed" };
  }
}

async function reconcileWhopEntitlementForEmailInner(
  emailNorm: string,
): Promise<{ hasAccess: boolean; reason?: string }> {
  const productId = getWhopProductId();
  const whop = getWhopClient();
  const admin = createServiceRoleClient();
  const companyId = await resolveCompanyId(productId);

  const { data: existing } = await admin
    .from(TABLE)
    .select("whop_user_id")
    .eq("email", emailNorm)
    .maybeSingle();

  let whopUserId = existing?.whop_user_id as string | undefined;

  if (!whopUserId) {
    try {
      let matched: { id: string } | null = null;

      for await (const member of whop.members.list({
        company_id: companyId,
        product_ids: [productId],
        query: emailNorm,
        first: 50,
      })) {
        const memberEmail = member.user?.email?.trim().toLowerCase();
        if (memberEmail === emailNorm && member.user?.id) {
          matched = { id: member.user.id };
          break;
        }
      }

      if (!matched) {
        return { hasAccess: false, reason: "no_whop_member_for_email" };
      }
      whopUserId = matched.id;
    } catch (e) {
      console.error("[whop reconcile] member lookup failed:", e);
      return { hasAccess: false, reason: "member_lookup_failed" };
    }
  }

  try {
    const access = await whop.users.checkAccess(productId, { id: whopUserId });

    let membershipStatus = "unknown";
    for await (const m of whop.memberships.list({
      company_id: companyId,
      user_ids: [whopUserId],
      product_ids: [productId],
      first: 5,
    })) {
      membershipStatus = String(m.status);
      break;
    }

    const hasAccess = access.has_access === true;

    await upsertEntitlement({
      email: emailNorm,
      whopUserId,
      productId,
      hasAccess,
      membershipStatus,
    });

    return { hasAccess };
  } catch (e) {
    console.error("[whop reconcile] checkAccess / upsert failed:", e);
    return { hasAccess: false, reason: "reconcile_failed" };
  }
}

