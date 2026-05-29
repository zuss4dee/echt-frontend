"use client";

import { BackgroundField } from "@/components/marketing/BackgroundField";
import { Clearance } from "@/components/marketing/Clearance";
import { Engine } from "@/components/marketing/Engine";
import { Hero } from "@/components/marketing/Hero";
import { Partners } from "@/components/marketing/Partners";
import { Proof } from "@/components/marketing/Proof";
import { useLenis } from "@/hooks/use-lenis";

export function MarketingHome() {
  useLenis();

  return (
    <>
      <BackgroundField />
      <main className="relative z-10 text-foreground">
        <Hero />
        <Proof />
        <Engine />
        <Partners />
        <Clearance />
      </main>
    </>
  );
}
