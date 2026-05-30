import { FortressOnboardingFlow } from "@/components/auth/FortressOnboardingFlow";

export const metadata = {
  title: "ECHT — Workspace Setup",
  description: "Initialize your ECHT workspace and run your first forensic scan.",
};

export default function SetupPage() {
  return <FortressOnboardingFlow />;
}
