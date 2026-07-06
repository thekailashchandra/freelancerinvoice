import type { LocaleCode } from "@/lib/i18n/types";

/** Default UI locale when a user picks a billing country. */
const COUNTRY_LOCALE: Record<string, LocaleCode> = {
  IN: "hi",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  NZ: "en",
  IE: "en",
  SG: "en",
  PH: "en",
  ZA: "en",
  NG: "en",
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  PT: "pt",
  BR: "pt",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
  IT: "it",
  NL: "nl",
  KR: "ko",
  RU: "ru",
  TR: "tr",
  ID: "id",
  VN: "vi",
  PL: "pl",
  EU: "en",
  OTHER: "en",
};

export function defaultLocaleForCountry(countryCode: string): LocaleCode {
  return COUNTRY_LOCALE[countryCode.toUpperCase()] ?? "en";
}

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ja: "日本語",
  ar: "العربية",
  zh: "中文",
  it: "Italiano",
  nl: "Nederlands",
  ko: "한국어",
  ru: "Русский",
  tr: "Türkçe",
  id: "Bahasa Indonesia",
  vi: "Tiếng Việt",
  pl: "Polski",
};

export function countryFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code === "EU") return "🇪🇺";
  if (code === "OTHER") return "🌍";
  if (code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  return String.fromCodePoint(
    ...code.split("").map((char) => base + char.charCodeAt(0) - 65)
  );
}
