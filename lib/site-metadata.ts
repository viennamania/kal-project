export const siteMetadata = {
  appName: "Oasis Token Arcade",
  defaultDescription:
    "Phone-first token studio for creating playful community tokens, managing wallets, and sending tokens with a bright arcade-style experience.",
  keywords: [
    "Oasis Token Arcade",
    "token studio",
    "thirdweb",
    "BSC token",
    "wallet service",
    "community token",
    "phone wallet"
  ],
  shortName: "Oasis Arcade",
  themeColor: "#FDFEFF",
  titleTemplate: "%s | Oasis Token Arcade"
} as const;

export function getSiteUrl() {
  const fallback = "http://localhost:3000";

  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? fallback);
  } catch {
    return new URL(fallback);
  }
}
