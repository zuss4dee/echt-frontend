import { FortressOnboardingFlow } from "@/components/auth/FortressOnboardingFlow";

export const metadata = {
  title: "ECHT — Onboarding / Forensic Clearance",
  description: "Initialize your ECHT workspace and run your first forensic scan.",
};

export default function OnboardingPage() {
  return <FortressOnboardingFlow />;
}
