import Script from "next/script";
import { analyticsConfig } from "@/data/analytics";
import { COOKIE_CONSENT_NAME } from "@/lib/cookie-consent";

const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 2000
});
`.trim();

const consentRestoreScript = `
(function () {
  var match = document.cookie.match(/(?:^|;\\s*)${COOKIE_CONSENT_NAME}=([^;]+)/);
  if (!match) return;
  var choice = decodeURIComponent(match[1]);
  if (choice !== 'all' && choice !== 'essential') return;
  var adsGranted = choice === 'all';
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: adsGranted ? 'granted' : 'denied',
    ad_user_data: adsGranted ? 'granted' : 'denied',
    ad_personalization: adsGranted ? 'granted' : 'denied'
  });
})();
`.trim();

const gtagInitScript = `
gtag('js', new Date());
gtag('config', '${analyticsConfig.measurementId}', {
  send_page_view: false
});
`.trim();

/** GA4 via gtag.js — loaded from the document head for reliable collection. */
export function GoogleAnalytics() {
  if (!analyticsConfig.measurementId) return null;

  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive">
        {consentDefaultScript}
      </Script>
      <Script id="google-consent-restore" strategy="beforeInteractive">
        {consentRestoreScript}
      </Script>
      <Script
        id="google-gtag"
        src={analyticsConfig.gtagScriptUrl}
        strategy="afterInteractive"
      />
      <Script id="google-gtag-init" strategy="afterInteractive">
        {gtagInitScript}
      </Script>
    </>
  );
}
