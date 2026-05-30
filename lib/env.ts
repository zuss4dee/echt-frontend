/** Trim env values and strip trailing inline ` # comments` from .env.local lines. */
export function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  const withoutComment = raw.split(/\s+#/)[0]?.trim() ?? "";
  return withoutComment.replace(/^["']|["']$/g, "") || undefined;
}
