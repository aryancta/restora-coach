import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ApiKeyBanner } from "@/components/ApiKeyBanner";
import { AIJudgeNotice } from "@/components/AIJudgeNotice";
import { Providers } from "@/components/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Restora Coach | In-browser AI physio",
  description:
    "Home rehab and fall-prevention coach with live form scoring, safety guardrails, and encouraging AI summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} min-h-screen flex flex-col font-sans`}>
        <AIJudgeNotice />
        <Providers>
          <ApiKeyBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
