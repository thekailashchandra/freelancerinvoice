export const COOKIE_CONSENT_NAME = "iff_consent";
export const COOKIE_CONSENT_VERSION = 1;
export const OPEN_COOKIE_CONSENT_EVENT = "iff:open-cookie-consent";
export const COOKIE_CONSENT_SET_EVENT = "iff:cookie-consent-set";

export type CookieConsentChoice = "all" | "essential";

export type GtagConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function consentToGtagState(choice: CookieConsentChoice): GtagConsentState {
  const adsGranted = choice === "all";
  return {
    // Traffic measurement (GA4) — allowed once the user picks either banner option.
    analytics_storage: "granted",
    ad_storage: adsGranted ? "granted" : "denied",
    ad_user_data: adsGranted ? "granted" : "denied",
    ad_personalization: adsGranted ? "granted" : "denied",
  };
}

export function readConsentCookie(): CookieConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_CONSENT_NAME}=([^;]+)`)
  );
  const value = decodeURIComponent(match?.[1] ?? "");
  if (value === "all" || value === "essential") return value;
  return null;
}

export function writeConsentCookie(choice: CookieConsentChoice): void {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(choice)}; path=/; max-age=${maxAge}; samesite=lax`;
  try {
    localStorage.setItem(
      COOKIE_CONSENT_NAME,
      JSON.stringify({
        choice,
        version: COOKIE_CONSENT_VERSION,
        savedAt: new Date().toISOString(),
      })
    );
  } catch {
    // localStorage may be unavailable in private mode
  }
}

export function applyGtagConsent(choice: CookieConsentChoice): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", consentToGtagState(choice));
}

export function openCookieConsentPreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_CONSENT_EVENT));
}

export function notifyConsentSaved(choice: CookieConsentChoice): void {
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_SET_EVENT, { detail: choice })
  );
}

export function saveCookieConsent(choice: CookieConsentChoice): void {
  writeConsentCookie(choice);
  applyGtagConsent(choice);
  notifyConsentSaved(choice);
}
