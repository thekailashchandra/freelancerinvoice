export const LOCALE_COOKIE = "iff-locale";
export const LOCALE_COUNTRY_COOKIE = "iff-locale-country";

export const SUPPORTED_LOCALES = [
  "en",
  "hi",
  "es",
  "fr",
  "de",
  "pt",
  "ja",
  "ar",
  "zh",
  "it",
  "nl",
  "ko",
  "ru",
  "tr",
  "id",
  "vi",
  "pl",
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export type MessageTree = {
  [key: string]: string | MessageTree;
};
