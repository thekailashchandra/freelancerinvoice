import { type NextRequest, NextResponse } from "next/server";
import {
  GEO_COUNTRY_COOKIE,
  GEO_MARKET_COOKIE,
  readCountryFromHeaders,
  resolveDefaultCountryCode,
  resolveMarketFromCountry,
} from "@/lib/geo-market";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Attach geo market cookies from IP headers or ?market= override. */
export function applyGeoCookies(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const override = request.nextUrl.searchParams.get("market");
  const detected = readCountryFromHeaders(request.headers);

  let countryCode =
    request.cookies.get(GEO_COUNTRY_COOKIE)?.value ??
    resolveDefaultCountryCode(detected);

  if (override === "in") {
    countryCode = "IN";
  } else if (override === "global") {
    countryCode = resolveDefaultCountryCode(detected ?? "US");
  } else if (detected && !request.cookies.has(GEO_COUNTRY_COOKIE)) {
    countryCode = resolveDefaultCountryCode(detected);
  }

  const market = resolveMarketFromCountry(countryCode);

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
}
