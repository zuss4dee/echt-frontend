/**
 * Public Whop “experience” URLs (forum, support chat, product updates).
 * Set in env — see `docs/WHOP.md` and `.env.example`.
 */

export function getWhopForumUrl(): string {
  return process.env.NEXT_PUBLIC_WHOP_FORUM_URL?.trim() ?? "";
}

export function getWhopSupportChatUrl(): string {
  return process.env.NEXT_PUBLIC_WHOP_SUPPORT_CHAT_URL?.trim() ?? "";
}

export function getWhopProductUpdatesUrl(): string {
  return process.env.NEXT_PUBLIC_WHOP_PRODUCT_UPDATES_URL?.trim() ?? "";
}
