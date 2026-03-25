"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Star } from "lucide-react";

import {
  ECHT_PRODUCT_FEATURES,
  getAnnualCard,
  getMonthlyCard,
  getQuarterlyCard,
  getTrialCard,
  type PricingCardConfig,
} from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";

const accent = {
  text: "text-red-600",
  border: "border-red-600",
  bg: "bg-red-600",
  bgHover: "hover:bg-red-700",
  check: "text-red-600",
  badgeRed: "bg-red-600 text-white",
  badgeGreen: "bg-emerald-600 text-white",
  badgeSlate: "bg-zinc-800 text-white",
};

/** Monthly “Popular” (not red) so it doesn’t clash with Trial */
const popular = {
  border: "border-zinc-800",
  bg: "bg-zinc-800",
  bgHover: "hover:bg-zinc-900",
};

/** Same strings from pricing-plans; only layout changes (large figure + smaller cadence). */
function splitPriceForDisplay(priceMain: string): { main: string; suffix: string | null } {
  const month = priceMain.match(/^(£[\d,]+)\s+per\s+month$/i);
  if (month) return { main: month[1], suffix: "per month" };
  const quarter = priceMain.match(/^(£[\d,]+)\s+per\s+quarter$/i);
  if (quarter) return { main: quarter[1], suffix: "per quarter" };
  const year = priceMain.match(/^(£[\d,]+)\s+per\s+year$/i);
  if (year) return { main: year[1], suffix: "per year" };
  return { main: priceMain, suffix: null };
}

function PlanCard({
  plan,
  recommended = false,
}: {
  plan: PricingCardConfig;
  recommended?: boolean;
}) {
  const priceParts = splitPriceForDisplay(plan.priceMain);
  /** “Popular” pill hidden when the sky “Recommended for you” bar carries emphasis */
  const showPillBadge =
    plan.badge && !(recommended && plan.variant === "subscribePopular");

  const borderClass = recommended
    ? "border-0"
    : plan.variant === "trial"
      ? cn("border-2", accent.border)
      : plan.variant === "subscribePopular"
        ? cn("border-2", popular.border)
        : plan.variant === "subscribeGreen"
          ? "border-2 border-emerald-600"
          : "border border-zinc-200";

  const useNavyCta =
    recommended && (plan.variant === "subscribePopular" || plan.variant === "subscribeGreen");

  const btnClass = useNavyCta
    ? "bg-slate-900 text-white hover:bg-slate-800"
    : plan.variant === "trial"
      ? cn("text-white", accent.bg, accent.bgHover)
      : plan.variant === "subscribePopular"
        ? cn("text-white", popular.bg, popular.bgHover)
        : plan.variant === "subscribeGreen"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50";

  const inner = (
    <>
      <div className="flex min-h-[2.25rem] items-start justify-center">
        {showPillBadge && plan.badge ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
              plan.badge.variant === "red" && accent.badgeRed,
              plan.badge.variant === "green" && accent.badgeGreen,
              plan.badge.variant === "slate" && accent.badgeSlate,
            )}
          >
            {plan.badge.variant === "red" || plan.badge.variant === "slate" ? (
              <Star className="h-3 w-3 fill-white text-white" aria-hidden />
            ) : null}
            {plan.badge.label}
          </span>
        ) : (
          <div className="min-h-[2.25rem] w-full" aria-hidden />
        )}
      </div>

      <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {plan.nameUpper}
      </p>

      <div className="mt-5">
        {priceParts.suffix ? (
          <p className="flex flex-wrap items-baseline justify-center gap-x-1.5">
            <span className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 sm:text-[2.5rem]">
              {priceParts.main}
            </span>
            <span className="text-sm font-medium text-zinc-500 sm:text-base">/ {priceParts.suffix}</span>
          </p>
        ) : (
          <p className="text-center font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-[2rem]">
            {priceParts.main}
          </p>
        )}
      </div>

      <div className="mx-auto mt-5 max-w-[min(100%,14rem)] border-t border-zinc-200" />

      {plan.subline ? (
        <p className="mt-3 text-center text-sm leading-relaxed text-zinc-600">{plan.subline}</p>
      ) : null}

      <div className="mt-8 flex flex-1 flex-col justify-end">
        <a
          href={plan.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-center text-sm font-semibold transition-colors",
            btnClass,
          )}
        >
          {plan.cta}
        </a>
        {plan.footnote ? (
          <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500">{plan.footnote}</p>
        ) : null}
      </div>
    </>
  );

  if (recommended) {
    return (
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-2 ring-sky-200 ring-offset-0",
          "shadow-sky-200/40",
        )}
      >
        <div className="bg-sky-100 py-2.5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-950">
            Recommended for you
          </p>
        </div>
        <div className={cn("flex flex-1 flex-col p-6 sm:p-7", borderClass)}>{inner}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm sm:p-7",
        borderClass,
      )}
    >
      {inner}
    </div>
  );
}

type PricingSectionProps = {
  className?: string;
  /** Opens the email Contact us modal (e.g. on the marketing home). */
  onContactClick?: () => void;
};

export function PricingSection({ className, onContactClick }: PricingSectionProps) {
  const [annual, setAnnual] = useState(false);

  const trial = getTrialCard();
  const quarterly = getQuarterlyCard();
  const monthly = getMonthlyCard();
  const annualPlan = getAnnualCard();

  return (
    <section
      id="pricing"
      className={cn(
        "scroll-mt-24 border-b border-zinc-200 bg-white py-16 sm:py-20 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm",
              accent.text,
            )}
          >
            Pricing
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-[2.5rem]">
            Choose the plan that&apos;s right for you
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-600">
            One product:{" "}
            <span className="font-medium text-zinc-800">Echt AI · Document verification</span>.
            Same features on every option. Pick how you pay.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            What&apos;s included in every plan
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3">
            {ECHT_PRODUCT_FEATURES.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm text-zinc-800">
                <Check
                  className={cn("mt-0.5 h-4 w-4 shrink-0", accent.check)}
                  strokeWidth={2.5}
                  aria-hidden
                />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Monthly: trial + monthly + quarterly. Annual: annual plan only */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div
            className="inline-flex rounded-full border border-zinc-200 bg-zinc-100/80 p-1"
            role="group"
            aria-label="Show monthly options or annual billing only"
          >
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                !annual ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                annual ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
              )}
            >
              Annual
            </button>
          </div>
          <p className="max-w-md text-center text-xs text-zinc-500">
            {annual
              ? "Annual billing only. Switch to Monthly to see free trial, monthly, and quarterly."
              : "Pay each month. Switch to Annual for the yearly price only."}
          </p>
        </div>

        {!annual ? (
          <div
            className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-zinc-50 p-6 shadow-[0_12px_48px_-8px_rgba(180,83,9,0.28)] ring-1 ring-amber-300/50 sm:p-8"
            role="region"
            aria-label="Limited time founding partner offer"
          >
            <div
              className="pointer-events-none absolute -left-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-300/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-400/20 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <p className="text-center text-base font-bold leading-snug tracking-tight text-zinc-950 sm:text-lg">
                <span className="mr-1.5 inline-block sm:mr-2" aria-hidden>
                  ⚡
                </span>
                Limited Time: Independent Agency Founding Partner Offer
              </p>
              <p className="mx-auto mt-5 max-w-3xl text-pretty text-center text-sm leading-relaxed text-zinc-800 sm:text-[15px]">
                Echt retails at £249 per month for enterprise operators. However, we are currently
                onboarding three local independent agencies as Founding Partners to fine tune our
                workflow.
              </p>
              <div className="mx-auto mt-6 max-w-md">
                <div className="overflow-hidden rounded-2xl border-2 border-zinc-800 bg-white shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-900/5">
                  <div className="bg-zinc-900 py-2.5 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      The Offer
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
                    <div className="text-center">
                      <p className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0">
                        <span className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 sm:text-[2.75rem]">
                          £100
                        </span>
                        <span className="text-sm font-medium text-zinc-500 sm:text-base">
                          per month for life
                        </span>
                      </p>
                      <p className="mx-auto mt-4 max-w-sm text-pretty text-sm leading-relaxed text-zinc-700">
                        Claim one of the 3 spots to lock in unlimited forensic scans.
                      </p>
                    </div>
                    <div className="mx-auto mt-5 max-w-sm border-t border-zinc-200" />
                    <p className="mx-auto mt-5 max-w-sm text-center text-sm font-medium leading-relaxed text-zinc-800">
                      Grandfathered in. You will never pay the £249 rate.
                    </p>
                    {onContactClick ? (
                      <button
                        type="button"
                        onClick={onContactClick}
                        className="mt-6 flex w-full items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-600 to-orange-700 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition hover:from-amber-500 hover:to-orange-600"
                      >
                        Apply for a Founding Partner spot
                      </button>
                    ) : (
                      <Link
                        href="/contact"
                        className="mt-6 flex w-full items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-600 to-orange-700 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-amber-900/20 transition hover:from-amber-500 hover:to-orange-600"
                      >
                        Apply for a Founding Partner spot
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-5 max-w-3xl rounded-xl border border-zinc-200/80 bg-zinc-900/[0.03] p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-zinc-800 sm:text-[15px]">
                  <span className="font-semibold text-zinc-950">The Risk Reversal Guarantee: </span>
                  Run your most suspicious applicant files through Echt during your 7 day trial. If we
                  do not instantly give you 100% clarity on whether those documents are fabricated,
                  cancel immediately. You will not pay a single penny.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {annual ? (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-md">
              <PlanCard plan={annualPlan} recommended />
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 md:items-stretch">
            <PlanCard plan={trial} />
            <PlanCard plan={monthly} recommended />
            <PlanCard plan={quarterly} />
          </div>
        )}

        <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50/95 via-white to-slate-50 px-6 py-8 text-center shadow-lg shadow-violet-950/10 ring-1 ring-violet-200/50 sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-400/15 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center rounded-full border border-violet-200 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-800 shadow-sm backdrop-blur-sm">
              Enterprise
            </span>
            <h3 className="mt-4 text-balance text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              Building a custom workflow?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
              We offer full API and webhook access for Enterprise teams. Connect Echt directly to your
              existing systems for custom integration pricing and volume limits.
            </p>
            <div className="mt-6 flex justify-center">
              {onContactClick ? (
                <button
                  type="button"
                  onClick={onContactClick}
                  className="inline-flex min-h-[44px] w-full max-w-sm items-center justify-center rounded-xl border border-violet-300/60 bg-gradient-to-b from-violet-600 to-indigo-800 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-950/25 transition hover:from-violet-500 hover:to-indigo-700 sm:w-auto sm:min-w-[200px]"
                >
                  Contact our team
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex min-h-[44px] w-full max-w-sm items-center justify-center rounded-xl border border-violet-300/60 bg-gradient-to-b from-violet-600 to-indigo-800 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-950/25 transition hover:from-violet-500 hover:to-indigo-700 sm:w-auto sm:min-w-[200px]"
                >
                  Contact our team
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
          Prices exclude VAT where applicable.{" "}
          {onContactClick ? (
            <button
              type="button"
              onClick={onContactClick}
              className="font-medium text-zinc-700 underline underline-offset-2 transition hover:text-zinc-900"
            >
              Contact us
            </button>
          ) : (
            <Link
              href="/contact"
              className="font-medium text-zinc-700 underline underline-offset-2 transition hover:text-zinc-900"
            >
              Contact us
            </Link>
          )}{" "}
          for procurement or pilots.
        </p>
      </div>
    </section>
  );
}
