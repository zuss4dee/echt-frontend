"use client";

import Link from "next/link";
import { BackgroundField } from "@/components/marketing/BackgroundField";
import { useLenis } from "@/hooks/use-lenis";

type AuthShellProps = {
  badge: string;
  headerRight?: React.ReactNode;
  editorial: React.ReactNode;
  children: React.ReactNode;
};

export function AuthShell({ badge, headerRight, editorial, children }: AuthShellProps) {
  useLenis();

  return (
    <>
      <BackgroundField />
      <main className="relative z-10 min-h-screen text-foreground">
        <div className="border-b border-hairline">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-2 w-2 bg-verdict-green" />
              <span className="label-micro">ECHT — FORENSIC INTEGRITY</span>
            </Link>
            <span className="label-micro text-muted-foreground">{badge}</span>
            {headerRight ?? (
              <Link
                href="/"
                className="label-micro text-muted-foreground transition hover:text-foreground"
              >
                ← EXIT
              </Link>
            )}
          </div>
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1600px] grid-cols-12 gap-8 px-8 py-20 md:py-28">
          <aside className="col-span-12 md:col-span-6 md:sticky md:top-28 md:self-start">
            {editorial}
          </aside>
          <section className="col-span-12 md:col-span-6">{children}</section>
        </div>
      </main>
    </>
  );
}

export function AuthComplianceFooter() {
  return (
    <p className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 label-micro text-muted-foreground">
      <span>SOC 2 TYPE II</span>
      <span>ISO 27001</span>
      <span>UK GDPR</span>
      <span>ZERO RETENTION</span>
    </p>
  );
}
