/**
 * Server and client: Whop product / checkout defaults.
 * Override product id with WHOP_PRODUCT_ID in server env.
 */

/** Echt AI product on Whop (used with users.checkAccess and webhook filtering). */
export const DEFAULT_WHOP_PRODUCT_ID = "prod_n4pIDJRqfBUx0";

export function getWhopProductId(): string {
  return (
    (typeof process !== "undefined" && process.env.WHOP_PRODUCT_ID) ||
    DEFAULT_WHOP_PRODUCT_ID
  );
}
