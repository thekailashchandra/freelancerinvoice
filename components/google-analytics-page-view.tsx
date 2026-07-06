"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  COOKIE_CONSENT_SET_EVENT,
} from "@/lib/cookie-consent";
import {
  hasAnalyticsConsent,
  sendGtagPageViewFromRouter,
} from "@/lib/gtag-analytics";

function trackWhenGtagReady(
  track: () => void,
  maxAttempts = 50,
  intervalMs = 100
): () => void {
  if (typeof window.gtag === "function") {
    track();
    return () => {};
  }

  let attempts = 0;
  const interval = window.setInterval(() => {
    attempts += 1;
    if (typeof window.gtag === "function") {
      track();
      window.clearInterval(interval);
      return;
    }
    if (attempts >= maxAttempts) window.clearInterval(interval);
  }, intervalMs);

  return () => window.clearInterval(interval);
}

/** Sends GA4 page_view on load (after consent) and App Router client navigations. */
export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const onConsentSaved = () => {
      if (!hasAnalyticsConsent()) return;
      const query = searchParams.toString();
      trackWhenGtagReady(() => sendGtagPageViewFromRouter(pathname, query));
    };

    window.addEventListener(COOKIE_CONSENT_SET_EVENT, onConsentSaved);
    return () => window.removeEventListener(COOKIE_CONSENT_SET_EVENT, onConsentSaved);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pathname || !hasAnalyticsConsent()) return;

    const query = searchParams.toString();
    return trackWhenGtagReady(() => sendGtagPageViewFromRouter(pathname, query));
  }, [pathname, searchParams]);

  return null;
}
