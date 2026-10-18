import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  GEO_IP_COUNTRY_COOKIE,
  readCountryFromHeaders,
  resolveDefaultCountryCode,
} from "@/lib/geo-market";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readDevConsentCountry(): string | null {
  const dev = process.env.DEV_CONSENT_COUNTRY?.trim().toUpperCase();
  if (process.env.NODE_ENV === "development" && dev && dev.length >= 2) {
    return resolveDefaultCountryCode(dev);
  }
  return null;
}

/** Resolve consent country from IP only - never locale switcher. */
export function resolveConsentCountryCode(input: {
  ipCookie?: string | null;
  requestHeaders?: Headers;
}): string | null {
  if (input.ipCookie) {
    return resolveDefaultCountryCode(input.ipCookie);
  }

  if (input.requestHeaders) {
    const detected = readCountryFromHeaders(input.requestHeaders);
    if (detected) {
      return resolveDefaultCountryCode(detected);
    }
  }

  return readDevConsentCountry();
}

export function readConsentCountryFromRequest(
  request: NextRequest
): string | null {
  return resolveConsentCountryCode({
    ipCookie: request.cookies.get(GEO_IP_COUNTRY_COOKIE)?.value ?? null,
    requestHeaders: request.headers,
  });
}

export function attachConsentCountryCookie(
  response: NextResponse,
  countryCode: string
): void {
  response.cookies.set(GEO_IP_COUNTRY_COOKIE, countryCode, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}

/** Client-only fallback when IP geo is unavailable (e.g. localhost). */
export function guessConsentCountryFromTimezone(): string | null {
  if (typeof Intl === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "IN";
    if (tz.startsWith("Europe/")) return null;
    if (tz.startsWith("America/")) return "US";
  } catch {
    // ignore
  }
  return null;
}

export { GEO_IP_COUNTRY_COOKIE };
