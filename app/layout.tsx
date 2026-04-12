import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";
import "@/app/globals.css";
import { getDictionary, getRequestLocale, LOCALE_COOKIE_NAME } from "@/lib/i18n";
import { getSiteUrl, siteMetadata } from "@/lib/site-metadata";

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
  const siteUrl = getSiteUrl();
  const title = dictionary.common.brand;
  const description = dictionary.connect.appDescription || siteMetadata.defaultDescription;

  return {
    applicationName: siteMetadata.appName,
    alternates: {
      canonical: "/"
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title
    },
    category: "finance",
    description,
    formatDetection: {
      address: false,
      email: false,
      telephone: false
    },
    icons: {
      apple: [{ sizes: "180x180", url: "/apple-icon" }],
      icon: [
        { sizes: "32x32", url: "/icon" },
        { sizes: "64x64", url: "/icon" }
      ]
    },
    keywords: [...siteMetadata.keywords],
    manifest: "/manifest.webmanifest",
    metadataBase: siteUrl,
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 630,
          url: "/opengraph-image",
          width: 1200
        }
      ],
      siteName: siteMetadata.appName,
      title,
      type: "website",
      url: siteUrl
    },
    title: {
      default: title,
      template: siteMetadata.titleTemplate
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: ["/twitter-image"],
      title
    }
  };
}

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: siteMetadata.themeColor,
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
