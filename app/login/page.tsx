import Link from "next/link";

export const metadata = {
  title: "Sign in — Echt",
  description: "Access the Echt forensic platform.",
};

/**
 * Placeholder: replace with real auth (e.g. Supabase Auth, Clerk) when ready.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to Echt</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Login and sign-up will live here—connect your auth provider and redirect to the app
          dashboard.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            Open platform
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Marketing site
          </Link>
        </div>
      </div>
    </main>
  );
}
