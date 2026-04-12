import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";
import "@/app/globals.css";

const displayFont = Baloo_2({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  description:
    "Phone-first BSC token studio powered by thirdweb smart accounts, Vercel Blob, and MongoDB Atlas.",
  title: "Oasis Token Arcade"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} bg-confetti font-body text-ink`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
