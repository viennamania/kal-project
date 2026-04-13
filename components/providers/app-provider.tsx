"use client";

import { ThirdwebProvider } from "thirdweb/react";

import { AppInstallPrompt } from "@/components/pwa/app-install-prompt";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { WalletMemberProvider } from "@/components/providers/wallet-member-provider";
import type { AppDictionary, AppLocale } from "@/lib/i18n";

export function AppProvider({
  children,
  dictionary,
  locale
}: {
  children: React.ReactNode;
  dictionary: AppDictionary;
  locale: AppLocale;
}) {
  return (
    <LocaleProvider dictionary={dictionary} locale={locale}>
      <ThirdwebProvider>
        <WalletMemberProvider>
          {children}
          <AppInstallPrompt />
        </WalletMemberProvider>
      </ThirdwebProvider>
    </LocaleProvider>
  );
}
