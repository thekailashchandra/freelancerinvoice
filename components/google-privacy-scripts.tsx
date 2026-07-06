"use client";

import { useLayoutEffect } from "react";
import { adsenseConfig } from "@/data/adsense";
import {
  COOKIE_CONSENT_SET_EVENT,
  readConsentCookie,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

function injectExternalScript(
  id: string,
  src: string,
  parent: HTMLElement,
  options?: { crossOrigin?: string; async?: boolean }
): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  if (options?.crossOrigin) script.crossOrigin = options.crossOrigin;
  if (options?.async) script.async = true;
  parent.appendChild(script);
}

function shouldLoadAds(choice: CookieConsentChoice | null): boolean {
  return choice === "all";
}

function loadAdSenseScripts(): void {
  injectExternalScript(
    "google-adsense",
    adsenseConfig.adsScriptUrl,
    document.head,
    { crossOrigin: "anonymous" }
  );
}

/**
 * Loads Google AdSense after the user accepts advertising cookies.
 * Consent is managed by CookieConsentBanner (no duplicate Funding Choices banner).
 */
export function GooglePrivacyScripts() {
  useLayoutEffect(() => {
    if (shouldLoadAds(readConsentCookie())) {
      loadAdSenseScripts();
    }

    const handleConsent = (event: Event) => {
      const choice = (event as CustomEvent<CookieConsentChoice>).detail;
      if (shouldLoadAds(choice)) {
        loadAdSenseScripts();
      }
    };

    window.addEventListener(COOKIE_CONSENT_SET_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_SET_EVENT, handleConsent);
  }, []);

  return null;
}
