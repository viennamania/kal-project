import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";
import "@/app/globals.css";
import { getDictionary, getRequestLocale, LOCALE_COOKIE_NAME } from "@/lib/i18n";

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

export function generateMetadata(): Metadata {
  const locale = getRequestLocale({
    acceptLanguage: headers().get("accept-language"),
    cookieLocale: cookies().get(LOCALE_COOKIE_NAME)?.value
  });
  const dictionary = getDictionary(locale);

  return {
    description: dictionary.connect.appDescription,
    title: dictionary.common.brand
  };
}

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getRequestLocale({
    acceptLanguage: headers().get("accept-language"),
    cookieLocale: cookies().get(LOCALE_COOKIE_NAME)?.value
  });
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} min-h-dvh overflow-x-hidden bg-confetti font-body text-ink`}
      >
        <AppProvider dictionary={dictionary} locale={locale}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
