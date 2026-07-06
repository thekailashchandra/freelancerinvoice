"use client";

import { useLayoutEffect } from "react";
import { adsenseConfig } from "@/data/adsense";

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

/**
 * Google Privacy & Messaging (Funding Choices CMP) and AdSense.
 * Analytics is loaded separately via GoogleAnalytics in the root layout head.
 */
export function GooglePrivacyScripts() {
  useLayoutEffect(() => {
    injectExternalScript(
      "google-funding-choices",
      adsenseConfig.fundingChoicesUrl,
      document.head
    );
    injectExternalScript(
      "google-adsense",
      adsenseConfig.adsScriptUrl,
      document.head,
      { crossOrigin: "anonymous" }
    );
    injectInlineScript("google-fc-present", fundingChoicesPresentScript, document.body);
  }, []);

  return null;
}
