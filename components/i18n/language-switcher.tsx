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
        "inline-flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/75 p-2 shadow-soft backdrop-blur-xl",
        className
      )}
    >
      {appLocales.map((entry) => {
        const active = entry === locale;

        return (
          <button
            key={entry}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-semibold transition",
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
