import type { Metadata } from "next";
import { MarketingHome } from "@/components/MarketingHome";

export const metadata: Metadata = {
  title: "ECHT — Forensic Integrity for Tenant Referencing",
  description:
    "ECHT is enterprise-grade AI forensic verification for tenant referencing. Absolute truth in every document.",
  openGraph: {
    title: "ECHT — Forensic Integrity for Tenant Referencing",
    description:
      "Enterprise AI forensic verification platform. Absolute truth in document analysis.",
    type: "website",
  },
};

export default function HomePage() {
  return <MarketingHome />;
}
