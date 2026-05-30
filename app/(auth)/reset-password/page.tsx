import { FortressResetPasswordForm } from "@/components/auth/FortressResetPasswordForm";

export const metadata = {
  title: "ECHT — Reset Password",
  description: "Set a new password for your ECHT forensic workspace.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const invalidLink = params.error === "true";

  return <FortressResetPasswordForm invalidLink={invalidLink} />;
}
