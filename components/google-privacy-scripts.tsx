import Script from "next/script";
import { adsenseConfig } from "@/data/adsense";

/**
 * Google Privacy & Messaging (Funding Choices CMP) + AdSense.
 * Publish your European regulations message in AdSense → Privacy & messaging first.
 * The CMP banner is served by Google once the message is published.
 */
export function GooglePrivacyScripts() {
  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>
      <Script
        id="google-funding-choices"
        src={adsenseConfig.fundingChoicesUrl}
        strategy="beforeInteractive"
      />
      <Script
        id="google-adsense"
        src={adsenseConfig.adsScriptUrl}
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script id="google-fc-present" strategy="afterInteractive">
        {`
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
        `}
      </Script>
    </>
  );
}
