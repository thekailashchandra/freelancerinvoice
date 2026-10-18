import { analyticsConfig } from "@/data/analytics";
import { readConsentCookie } from "@/lib/cookie-consent";

/** User chose Essential only or Accept all - either enables GA (ads stay gated separately). */
export function hasAnalyticsConsent(): boolean {
  return readConsentCookie() !== null;
}

/** Fire a GA4 page_view after consent is granted (initial hits are blocked by Consent Mode). */
export function sendGtagPageView(pagePath?: string): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const path =
    pagePath ??
    `${window.location.pathname}${window.location.search}`;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function sendGtagPageViewFromRouter(pathname: string, search: string): void {
  if (!pathname) return;
  const pagePath = search ? `${pathname}?${search}` : pathname;
  sendGtagPageView(pagePath);
}

export function getGtagMeasurementId(): string {
  return analyticsConfig.measurementId;
}
