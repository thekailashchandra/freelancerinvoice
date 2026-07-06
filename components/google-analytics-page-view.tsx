"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { analyticsConfig } from "@/data/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends GA4 page_view on App Router client navigations. */
export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag("config", analyticsConfig.measurementId, {
      page_path: pagePath,
    });
  }, [pathname, searchParams]);

  return null;
}
