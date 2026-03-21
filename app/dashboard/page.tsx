import Link from "next/link";

export const metadata = {
  title: "Dashboard | Echt",
  description: "Signed-in workspace (placeholder).",
};

/** Placeholder after successful auth; replace with your app shell. */
export default function DashboardPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-zinc-900">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="max-w-md text-center text-sm text-zinc-600">
        You&apos;ve completed the auth callback. Build your signed-in experience here.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline"
      >
        Back to marketing site
      </Link>
    </main>
  );
}
