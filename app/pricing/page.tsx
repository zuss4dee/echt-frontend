import { redirect } from "next/navigation";

/**
 * Legacy `/pricing` URLs redirect to the marketing home (pricing lives at `/#pricing`).
 */
export default async function PricingRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    } else {
      qs.set(key, value);
    }
  }
  const q = qs.toString();
  redirect(q ? `/?${q}` : "/");
}
