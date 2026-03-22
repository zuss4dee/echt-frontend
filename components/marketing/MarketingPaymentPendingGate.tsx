"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PaymentPendingModal } from "@/components/marketing/PaymentPendingModal";
import { postWhopVerifyAccess } from "@/lib/whop-verify-client";

const POLL_MS = 1500;

/**
 * When marketing URL includes access_pending=1 (e.g. after onboarding submit while Whop syncs),
 * show the payment-confirm modal and poll until Analyze is allowed.
 */
export function MarketingPaymentPendingGate() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const needsPlan = searchParams.get("needs_plan") === "1";
  const accessPending = searchParams.get("access_pending") === "1";
  const [hint, setHint] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (needsPlan || !accessPending) return;

    let cancelled = false;

    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session?.user) {
        setHint(
          "Sign in with the same email you used at checkout, then we’ll finish confirming your access.",
        );
        return;
      }

      setHint(null);

      const tick = async () => {
        if (cancelled) return;
        if ((await postWhopVerifyAccess()).hasAccess) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          router.replace("/analyze");
        }
      };

      await tick();
      intervalRef.current = setInterval(() => void tick(), POLL_MS);
    })();

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [needsPlan, accessPending, router]);

  if (needsPlan || !accessPending) return null;

  return (
    <>
      <PaymentPendingModal open hint={hint} />
      {hint ? (
        <div className="fixed bottom-6 left-1/2 z-[301] w-[min(90vw,20rem)] -translate-x-1/2 text-center">
          <Link
            href="/login"
            className="inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg ring-1 ring-zinc-200 transition hover:bg-zinc-50"
          >
            Sign in
          </Link>
        </div>
      ) : null}
    </>
  );
}
