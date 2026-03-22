"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const navLinkClass =
  "shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:border-white/40 hover:bg-white/15 sm:py-1 sm:text-[13px] sm:normal-case sm:tracking-normal";

type MarketingLoginNavLinkProps = {
  /** e.g. close mobile menu after navigation */
  onNavigate?: () => void;
};

/**
 * When the URL has `needs_plan=1`, use `/login?switch_account=1` so the user can
 * sign out and enter their Whop checkout email (proxy no longer blocks /login).
 */
export function MarketingLoginNavLink({ onNavigate }: MarketingLoginNavLinkProps) {
  const searchParams = useSearchParams();
  const needsPlanInUrl = searchParams.get("needs_plan") === "1";
  const href = needsPlanInUrl ? "/login?switch_account=1" : "/login";

  return (
    <Link href={href} className={navLinkClass} onClick={onNavigate}>
      Log in
    </Link>
  );
}

export function MarketingLoginNavLinkFallback({ onNavigate }: MarketingLoginNavLinkProps) {
  return (
    <Link href="/login" className={navLinkClass} onClick={onNavigate}>
      Log in
    </Link>
  );
}
