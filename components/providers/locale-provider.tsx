"use client";

import {
  createContext,
  useContext,
  useMemo,
  useTransition
} from "react";
import { useRouter } from "next/navigation";

import {
  LOCALE_COOKIE_NAME,
  type AppDictionary,
  type AppLocale
} from "@/lib/i18n";

type LocaleContextValue = {
  dictionary: AppDictionary;
  isSwitchingLocale: boolean;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  dictionary,
  locale
}: {
  children: React.ReactNode;
  dictionary: AppDictionary;
  locale: AppLocale;
}) {
  const router = useRouter();
  const [isSwitchingLocale, startTransition] = useTransition();

  const value = useMemo<LocaleContextValue>(() => {
    return {
      dictionary,
      isSwitchingLocale,
      locale,
      setLocale(nextLocale) {
        if (nextLocale === locale) {
          return;
        }

        document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => {
          router.refresh();
        });
      }
    };
  }, [dictionary, isSwitchingLocale, locale, router]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}
