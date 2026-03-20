import { MagicLinkLoginForm } from "@/components/auth/MagicLinkLoginForm";

export const metadata = {
  title: "Sign in — Echt",
  description: "Sign in to the Echt dashboard with a secure email link.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackError = params.error === "true";

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      {/* Subtle glow behind the card */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-[42%] h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="absolute left-1/2 top-[48%] h-[min(100vw,640px)] w-[min(110vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute right-[15%] top-[28%] h-64 w-64 rounded-full bg-indigo-500/15 blur-[80px]" />
      </div>

      <MagicLinkLoginForm callbackError={callbackError} />
    </main>
  );
}
