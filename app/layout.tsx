import type { Metadata } from "next";
import { Inter, Geist_Mono, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echt | Tenant Referencing Fraud Forensics",
  description:
    "Echt gives referencing teams the exact metadata and tamper signals to catch fraud. Upload payslips, bank statements, or IDs for a crystal clear outcome to approve real tenants and reject scammers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth font-sans", geist.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${inter.className} ${inter.variable} ${geistMono.variable} relative min-h-dvh bg-white antialiased text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50`}
      >
        <div className="relative z-[1]">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
