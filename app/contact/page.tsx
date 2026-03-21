import Link from "next/link";

export const metadata = {
  title: "Contact | Echt",
  description: "Get in touch with Echt.",
};

/**
 * Placeholder: replace with contact form + CRM / email integration when ready.
 */
export default function ContactPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 px-6 text-zinc-900">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          A contact form and sales routing will be added here. For now, use your team email or
          CRM link when you wire this page up.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Back to site
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
