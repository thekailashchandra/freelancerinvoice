"use client";

import {
  GEO_COUNTRY_COOKIE,
  GEO_MARKET_COOKIE,
  type MarketContext,
  resolveMarketContext,
} from "@/lib/geo-market";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Read geo market cookies set by middleware (client-only — keeps ISR pages static). */
export function readMarketFromDocumentCookies(): MarketContext {
  return resolveMarketContext({
    countryCode: readCookie(GEO_COUNTRY_COOKIE),
    market: readCookie(GEO_MARKET_COOKIE),
  });
}

export const defaultMarketContext: MarketContext = {
  market: "GLOBAL",
  countryCode: "US",
  currencyCode: "USD",
};
