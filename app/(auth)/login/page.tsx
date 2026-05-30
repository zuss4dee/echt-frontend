import { FortressLoginForm } from "@/components/auth/FortressLoginForm";

export const metadata = {
  title: "ECHT — Secure Sign In",
  description: "Authenticate into your ECHT forensic workspace.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackError = params.error === "true";

  return <FortressLoginForm callbackError={callbackError} />;
}
