/** Path + query for post–Whop-checkout landing (magic link still uses `/auth/callback`). */
export function getPostCheckoutLoginPath(): string {
  return "/login?checkout=success";
}
