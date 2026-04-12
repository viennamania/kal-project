"use client";

import { localeLabels, type AppLocale, appLocales } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageSwitcher({
  className
}: {
  className?: string;
}) {
  const { isSwitchingLocale, locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-2 rounded-[28px] border border-white/70 bg-white/75 p-2 shadow-soft backdrop-blur-xl sm:inline-flex sm:w-auto sm:flex-wrap sm:items-center sm:rounded-full",
        className
      )}
    >
      {appLocales.map((entry) => {
        const active = entry === locale;

        return (
          <button
            key={entry}
            className={cn(
              "min-h-11 rounded-full px-3.5 py-2 text-sm font-semibold transition sm:min-h-0 sm:px-3 sm:text-xs",
              active ? "bg-ink text-white" : "bg-white/70 text-ink/70 hover:bg-white"
            )}
            disabled={isSwitchingLocale}
            onClick={() => setLocale(entry as AppLocale)}
            type="button"
          >
            {localeLabels[entry]}
          </button>
        );
      })}
    </div>
  );
}
