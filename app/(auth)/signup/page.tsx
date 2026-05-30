import { FortressSignupForm } from "@/components/auth/FortressSignupForm";

export const metadata = {
  title: "ECHT — Request Clearance",
  description: "Provision a new ECHT forensic workspace for your agency.",
};

export default function SignupPage() {
  return <FortressSignupForm />;
}
