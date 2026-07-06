import { GEO_COUNTRY_COOKIE } from "@/lib/geo-market";
import {
  LOCALE_COOKIE,
  LOCALE_COUNTRY_COOKIE,
  type LocaleCode,
} from "@/lib/i18n/types";
import { isLocaleCode } from "@/lib/i18n/translate";

export function readLocaleCookie(): LocaleCode {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`)
  );
  const value = decodeURIComponent(match?.[1] ?? "");
  return isLocaleCode(value) ? value : "en";
}

export function readLocaleCountryCookie(): string {
  if (typeof document === "undefined") return "US";
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COUNTRY_COOKIE}=([^;]+)`)
  );
  if (match?.[1]) return decodeURIComponent(match[1]).toUpperCase();

  const geoMatch = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${GEO_COUNTRY_COOKIE}=([^;]+)`)
  );
  return decodeURIComponent(geoMatch?.[1] ?? "US").toUpperCase();
}

export async function setLocaleCountryClient(
  countryCode: string,
  locale: LocaleCode
): Promise<void> {
  const res = await fetch("/api/locale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ countryCode, locale }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Failed to update language");
  }
}
