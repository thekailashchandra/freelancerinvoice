"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createTranslator } from "@/lib/i18n/translate";
import {
  readLocaleCookie,
  readLocaleCountryCookie,
  setLocaleCountryClient,
} from "@/lib/i18n/locale-client";
import { defaultLocaleForCountry } from "@/lib/i18n/country-locale";
import type { LocaleCode } from "@/lib/i18n/types";

type LocaleContextValue = {
  locale: LocaleCode;
  countryCode: string;
  t: (key: string) => string;
  setLocaleCountry: (countryCode: string, locale?: LocaleCode) => Promise<void>;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [countryCode, setCountryCode] = useState("US");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocale(readLocaleCookie());
    setCountryCode(readLocaleCountryCookie());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const setLocaleCountry = useCallback(
    async (nextCountry: string, nextLocale?: LocaleCode) => {
      const resolvedLocale =
        nextLocale ?? defaultLocaleForCountry(nextCountry);
      await setLocaleCountryClient(nextCountry, resolvedLocale);
      setLocale(resolvedLocale);
      setCountryCode(nextCountry.toUpperCase());
      router.refresh();
    },
    [router]
  );

  const value = useMemo(
    () => ({ locale, countryCode, t, setLocaleCountry, ready }),
    [locale, countryCode, t, setLocaleCountry, ready]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, countryCode, setLocaleCountry } = useLocale();
  return { t, locale, countryCode, setLocaleCountry };
}
