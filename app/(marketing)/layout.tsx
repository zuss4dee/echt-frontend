import type { ReactNode } from "react";
import "../marketing.css";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="marketing-site min-h-dvh bg-background text-foreground">{children}</div>;
}
