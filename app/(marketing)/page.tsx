import type { Metadata } from "next";
import { MarketingHome } from "@/components/MarketingHome";

export const metadata: Metadata = {
  title: "ECHT — Student Accommodation Cancellation Fraud Prevention",
  description:
    "AI forensic verification that catches forged medical notes and fake visa rejections before you issue a lease-break refund.",
  openGraph: {
    title: "ECHT — Student Accommodation Cancellation Fraud Prevention",
    description:
      "Stop revenue leakage from fake student cancellations. Forensic verification for UK PBSA operators.",
    type: "website",
  },
};

export default function HomePage() {
  return <MarketingHome />;
}
