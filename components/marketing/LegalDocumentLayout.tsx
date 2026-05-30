import Link from "next/link";
import type { ReactNode } from "react";

type LegalDocumentLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-tight text-white md:text-xl">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-neutral-400 md:text-base">
        {children}
      </div>
    </section>
  );
}

export function LegalDocumentLayout({
  title,
  lastUpdated = "30 May 2026",
  children,
}: LegalDocumentLayoutProps) {
  return (
    <main className="min-h-dvh bg-neutral-950">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Link
          href="/"
          className="label-micro text-neutral-500 transition-colors hover:text-white"
        >
          ← Return to Home
        </Link>

        <header className="mt-12 border-b border-neutral-800 pb-10">
          <h1 className="display-serif text-4xl text-white md:text-5xl">{title}</h1>
          <p className="mt-4 label-micro text-neutral-500">Last updated · {lastUpdated}</p>
          <p className="mt-6 text-sm leading-relaxed text-neutral-400 md:text-base">
            Echt · England and Wales
          </p>
        </header>

        <div className="mt-16 space-y-12">{children}</div>
      </article>
    </main>
  );
}
