/** FastAPI backend origin (no trailing slash). */
export function getApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_ECHT_API_URL ?? "";
  return raw.replace(/\/$/, "");
}

export function parseApiError(body: unknown, status: number): string {
  if (!body || typeof body !== "object") {
    return `Request failed (${status})`;
  }
  const record = body as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (typeof record.message === "string" && !record.ok) return record.message;
  const detail = record.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item) {
          return String((item as { msg: unknown }).msg);
        }
        return String(item);
      })
      .join(" ");
  }
  return `Request failed (${status})`;
}
