"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/components/locale-provider";
import { COUNTRY_OPTIONS } from "@/lib/country";
import {
  countryFlagEmoji,
  defaultLocaleForCountry,
  LOCALE_LABELS,
} from "@/lib/i18n/country-locale";
import { limitCountryOptions } from "@/lib/select-limits";
import type { LocaleCode } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const POPULAR_COUNTRY_CODES = [
  "US",
  "IN",
  "GB",
  "CA",
  "AU",
  "DE",
  "FR",
  "ES",
  "IT",
  "BR",
  "MX",
  "JP",
  "CN",
  "KR",
  "SA",
  "AE",
  "NL",
  "PL",
  "TR",
  "ID",
  "VN",
  "SG",
  "ZA",
  "PH",
] as const;

type LocaleCountrySwitcherProps = {
  className?: string;
  variant?: "icon" | "compact";
};

export function LocaleCountrySwitcher({
  className,
  variant = "icon",
}: LocaleCountrySwitcherProps) {
  const { t, locale, countryCode, setLocaleCountry } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const popularOptions = useMemo(() => {
    const byCode = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]));
    return POPULAR_COUNTRY_CODES.map((code) => byCode.get(code)).filter(
      Boolean
    ) as typeof COUNTRY_OPTIONS;
  }, []);

  const { items: filtered, truncated } = useMemo(
    () => limitCountryOptions(COUNTRY_OPTIONS, search, countryCode),
    [search, countryCode]
  );

  const displayCountries = search.trim() ? filtered : popularOptions;

  const handleSelect = (code: string, selectedLocale?: LocaleCode) => {
    startTransition(async () => {
      try {
        await setLocaleCountry(code, selectedLocale ?? defaultLocaleForCountry(code));
        setOpen(false);
        setSearch("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update language");
      }
    });
  };

  const currentFlag = countryFlagEmoji(countryCode);
  const currentLanguage = LOCALE_LABELS[locale] ?? LOCALE_LABELS.en;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={variant === "icon" ? "icon" : "sm"}
          className={cn(
            variant === "icon" ? "h-9 w-9" : "gap-2 px-2.5",
            className
          )}
          aria-label={t("locale.chooseCountry")}
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : variant === "compact" ? (
            <>
              <span className="text-base leading-none" aria-hidden>
                {currentFlag}
              </span>
              <span className="hidden text-xs font-medium sm:inline">
                {currentLanguage}
              </span>
            </>
          ) : (
            <Globe className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="p-3 pb-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            {t("locale.chooseCountry")}
          </DropdownMenuLabel>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentFlag} {currentLanguage}
          </p>
        </div>
        <div className="px-3 pb-2">
          <Input
            placeholder={t("locale.searchCountries")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        {!search.trim() && truncated ? (
          <p className="px-3 pb-2 text-xs text-muted-foreground">
            {t("locale.commonCountries")}
          </p>
        ) : null}
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[min(20rem,50vh)] overflow-y-auto p-1">
          {displayCountries.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t("locale.noCountries")}
            </p>
          ) : (
            displayCountries.map((country) => {
              const countryLocale = defaultLocaleForCountry(country.code);
              const selected =
                country.code === countryCode && countryLocale === locale;
              return (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent",
                    selected && "bg-accent"
                  )}
                  onClick={() => handleSelect(country.code, countryLocale)}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {countryFlagEmoji(country.code)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {country.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {LOCALE_LABELS[countryLocale]}
                    </span>
                  </span>
                  {selected ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
