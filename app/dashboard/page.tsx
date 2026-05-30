import { redirect } from "next/navigation";
import { APP_ANALYZE_PATH } from "@/lib/auth-routing";

export const metadata = {
  title: "Dashboard | Echt",
  description: "Signed-in workspace.",
};

export default function DashboardPage() {
  redirect(APP_ANALYZE_PATH);
}
