import type { Metadata } from "next";
import { Inter, Geist_Mono, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Echt | Student Accommodation Cancellation Fraud Prevention",
  description:
    "AI forensic verification that catches forged medical notes and fake visa rejections before you issue a lease-break refund.",
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
        <SpeedInsights />
      </body>
    </html>
  );
}
