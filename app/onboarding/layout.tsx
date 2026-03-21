import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Echt",
  description: "Complete your profile to use Echt.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
