"use client";

import { useEffect, useState } from "react";
import {
  defaultMarketContext,
  readMarketFromDocumentCookies,
} from "@/lib/geo-market-client";
import type { MarketContext } from "@/lib/geo-market";

/**
 * Hydrates market context from middleware cookies after mount.
 * Defaults to US/GLOBAL for SSR to match build-time static render.
 */
export function useMarketContext(override?: Partial<MarketContext>): MarketContext {
  const [context, setContext] = useState<MarketContext>(() => ({
    ...defaultMarketContext,
    ...override,
  }));

  useEffect(() => {
    if (override?.countryCode || override?.market) return;
    setContext(readMarketFromDocumentCookies());
  }, [override?.countryCode, override?.market]);

  return context;
}
