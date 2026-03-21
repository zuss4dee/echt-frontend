import Link from "next/link";
import { EchtWordmark } from "@/components/EchtLogo";
import { PricingSection } from "@/components/marketing/PricingSection";

export const metadata = {
  title: "Pricing | Echt",
  description:
    "Plans for tenant referencing teams. Subscribe to access document integrity analysis in Analyze.",
};

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-md outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-label="Echt home"
          >
            <EchtWordmark className="h-7 w-auto text-zinc-900 sm:h-8" />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
            <Link href="/" className="transition-colors hover:text-zinc-900">
              Home
            </Link>
            <Link href="/login" className="transition-colors hover:text-zinc-900">
              Sign in
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <PricingSection className="border-b-0" />
      </main>
    </div>
  );
}
