import { NextResponse } from "next/server";
import {
  GEO_COUNTRY_COOKIE,
  GEO_MARKET_COOKIE,
  resolveMarketFromCountry,
} from "@/lib/geo-market";
import { defaultLocaleForCountry } from "@/lib/i18n/country-locale";
import {
  LOCALE_COOKIE,
  LOCALE_COUNTRY_COOKIE,
  type LocaleCode,
} from "@/lib/i18n/types";
import { isLocaleCode } from "@/lib/i18n/translate";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      countryCode?: string;
      locale?: string;
    };

    const countryCode = body.countryCode?.trim().toUpperCase();
    if (!countryCode || countryCode.length < 2) {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    const locale: LocaleCode = isLocaleCode(body.locale)
      ? body.locale
      : defaultLocaleForCountry(countryCode);

    const market = resolveMarketFromCountry(countryCode);
    const response = NextResponse.json({ ok: true, countryCode, locale, market });

    response.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    response.cookies.set(LOCALE_COUNTRY_COOKIE, countryCode, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    response.cookies.set(GEO_COUNTRY_COOKIE, countryCode, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    response.cookies.set(GEO_MARKET_COOKIE, market, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
