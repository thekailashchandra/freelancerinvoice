"use client";

import { useLayoutEffect } from "react";
import { adsenseConfig } from "@/data/adsense";

const consentDefaultScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
`.trim();

const fundingChoicesPresentScript = `
  (function () {
    function signalGooglefcPresent() {
      if (!window.frames['googlefcPresent']) {
        if (document.body) {
          const iframe = document.createElement('iframe');
          iframe.style.cssText =
            'width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;display:none';
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
        } else {
          setTimeout(signalGooglefcPresent, 0);
        }
      }
    }
    signalGooglefcPresent();
  })();
`.trim();

function injectInlineScript(
  id: string,
  code: string,
  parent: HTMLElement
): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.textContent = code;
  parent.appendChild(script);
}

function injectExternalScript(
  id: string,
  src: string,
  parent: HTMLElement,
  crossOrigin?: string
): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  if (crossOrigin) script.crossOrigin = crossOrigin;
  parent.appendChild(script);
}

/**
 * Google Privacy & Messaging (Funding Choices CMP) + AdSense.
 * Injected client-side only so React never hydrates <script> tags in <head>
 * (avoids mismatches from extensions or third-party script reordering).
 */
export function GooglePrivacyScripts() {
  useLayoutEffect(() => {
    injectInlineScript("google-consent-default", consentDefaultScript, document.head);
    injectExternalScript(
      "google-funding-choices",
      adsenseConfig.fundingChoicesUrl,
      document.head
    );
    injectExternalScript(
      "google-adsense",
      adsenseConfig.adsScriptUrl,
      document.head,
      "anonymous"
    );
    injectInlineScript("google-fc-present", fundingChoicesPresentScript, document.body);
  }, []);

  return null;
}
