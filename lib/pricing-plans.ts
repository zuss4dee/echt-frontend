/**
 * One Whop product (Echt AI). Same features everywhere; billing options differ.
 *
 * **Free trial:** The "7-day free trial" card uses `DEFAULT_CHECKOUT.trial` or
 * `NEXT_PUBLIC_WHOP_CHECKOUT_TRIAL`. Whop only shows a trial at checkout if **that plan**
 * has a trial period enabled in the Whop dashboard. If checkout asks for full payment
 * immediately, fix the plan in Whop (or point the env var at a plan that has a trial).
 */

import { withPostCheckoutRedirect } from "@/lib/whop-checkout-url";

export type CardBadge = { label: string; variant: "red" | "green" | "slate" };

/** Visual treatment for the CTA button and borders */
export type CardVariant =
  | "trial"
  | "subscribePopular"
  | "subscribeOutline"
  | "subscribeGreen";

export type PricingCardConfig = {
  id: string;
  nameUpper: string;
  badge?: CardBadge;
  priceMain: string;
  /** Single supporting line under price (billing note) */
  subline?: string;
  cta: string;
  checkoutUrl: string;
  variant: CardVariant;
  /** Short line under button */
  footnote?: string;
};

const DEFAULT_CHECKOUT = {
  trial: "https://whop.com/checkout/plan_8LkmfefKiGRTz",
  monthly: "https://whop.com/checkout/plan_fumKSodpl3C1q",
  quarterly: "https://whop.com/checkout/plan_TrJJ6gTzRWKaj",
  annual: "https://whop.com/checkout/plan_8s0HW4fAnAolI",
} as const;

function uTrial() {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_TRIAL ?? DEFAULT_CHECKOUT.trial;
}
function uMonthly() {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_MONTHLY ?? DEFAULT_CHECKOUT.monthly;
}
function uQuarterly() {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_QUARTERLY ?? DEFAULT_CHECKOUT.quarterly;
}
function uAnnual() {
  return process.env.NEXT_PUBLIC_WHOP_CHECKOUT_ANNUAL ?? DEFAULT_CHECKOUT.annual;
}

function checkoutWithReturn(base: string): string {
  return withPostCheckoutRedirect(base);
}

export const ECHT_PRODUCT_FEATURES: string[] = [
  "Unlimited document scans in Analyze (fair use policy applies)",
  "Full verification for payslips, bank statements, and IDs in one workflow",
  "Integrity first signals: metadata, structure, and pixel level analysis",
  "Structured outputs you can use in review, audit, and dispute",
  "Access to every future product update and new check at no extra cost",
  "Support chat with the Echt team",
  "Community forum, release notes, and roadmap visibility",
];

export function getTrialCard(): PricingCardConfig {
  return {
    id: "trial",
    nameUpper: "7-day free trial",
    badge: { label: "Try first", variant: "red" },
    priceMain: "Free trial",
    subline: "Seven days full access, then £249 per month unless you cancel.",
    cta: "Start free trial",
    checkoutUrl: checkoutWithReturn(uTrial()),
    variant: "trial",
    footnote: "Nothing to lose. Use your own documents.",
  };
}

export function getQuarterlyCard(): PricingCardConfig {
  return {
    id: "quarterly",
    nameUpper: "Quarterly",
    priceMain: "£597 per quarter",
    subline: "£199 per month when billed quarterly. Save 20% vs monthly.",
    cta: "Subscribe",
    checkoutUrl: checkoutWithReturn(uQuarterly()),
    variant: "subscribeOutline",
    footnote: "Best balance of savings and flexibility.",
  };
}

/** Middle column: monthly billing */
export function getMonthlyCard(): PricingCardConfig {
  return {
    id: "monthly",
    nameUpper: "Monthly",
    badge: { label: "Popular", variant: "slate" },
    priceMain: "£249 per month",
    subline: "Billed monthly. Cancel any time.",
    cta: "Subscribe",
    checkoutUrl: checkoutWithReturn(uMonthly()),
    variant: "subscribePopular",
    footnote: "Ideal when you want to stay nimble.",
  };
}

/** Middle column: annual billing (toggle) */
export function getAnnualCard(): PricingCardConfig {
  return {
    id: "annual",
    nameUpper: "Annual",
    badge: { label: "Save 40%", variant: "green" },
    priceMain: "£1,788 per year",
    subline: "£149 per month effective. One payment, twelve months of access.",
    cta: "Subscribe",
    checkoutUrl: checkoutWithReturn(uAnnual()),
    variant: "subscribeGreen",
    footnote: "After your trial, the strongest value on the ladder.",
  };
}
