import { en, type Messages } from "@/lib/i18n/messages/en";
import { hi } from "@/lib/i18n/messages/hi";
import { es } from "@/lib/i18n/messages/es";
import { fr } from "@/lib/i18n/messages/fr";
import { de } from "@/lib/i18n/messages/de";
import { pt } from "@/lib/i18n/messages/pt";
import { ja } from "@/lib/i18n/messages/ja";
import { ar } from "@/lib/i18n/messages/ar";
import { zh } from "@/lib/i18n/messages/zh";
import type { LocaleCode, MessageTree } from "@/lib/i18n/types";

type MessageKey = string;

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null;
}

function deepMerge<T extends MessageTree>(base: T, patch: MessageTree): T {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (isMessageTree(value) && isMessageTree(result[key])) {
      result[key] = deepMerge(result[key] as MessageTree, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

const catalogs: Record<LocaleCode, Messages> = {
  en,
  hi: deepMerge(en, hi) as Messages,
  es: deepMerge(en, es) as Messages,
  fr: deepMerge(en, fr) as Messages,
  de: deepMerge(en, de) as Messages,
  pt: deepMerge(en, pt) as Messages,
  ja: deepMerge(en, ja) as Messages,
  ar: deepMerge(en, ar) as Messages,
  zh: deepMerge(en, zh) as Messages,
  it: en,
  nl: en,
  ko: en,
  ru: en,
  tr: en,
  id: en,
  vi: en,
  pl: en,
};

export function getMessages(locale: LocaleCode): Messages {
  return catalogs[locale] ?? en;
}

export function translate(messages: Messages, key: MessageKey): string {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (!isMessageTree(current) || !(part in current)) {
      return key;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : key;
}

export function createTranslator(locale: LocaleCode) {
  const messages = getMessages(locale);
  return (key: MessageKey) => translate(messages, key);
}

export function isLocaleCode(value: string | null | undefined): value is LocaleCode {
  return (
    value === "en" ||
    value === "hi" ||
    value === "es" ||
    value === "fr" ||
    value === "de" ||
    value === "pt" ||
    value === "ja" ||
    value === "ar" ||
    value === "zh" ||
    value === "it" ||
    value === "nl" ||
    value === "ko" ||
    value === "ru" ||
    value === "tr" ||
    value === "id" ||
    value === "vi" ||
    value === "pl"
  );
}
