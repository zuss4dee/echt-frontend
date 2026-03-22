import { MagicLinkLoginForm } from "@/components/auth/MagicLinkLoginForm";

export const metadata = {
  title: "Sign in | Echt",
  description: "Sign in to the Echt dashboard with a secure email link.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; checkout?: string; switch_account?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackError = params.error === "true";
  const checkoutSuccess = params.checkout === "success";
  const switchAccount = params.switch_account === "1";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 py-16">
      <MagicLinkLoginForm
        callbackError={callbackError}
        checkoutSuccess={checkoutSuccess}
        switchAccount={switchAccount}
      />
    </main>
  );
}
