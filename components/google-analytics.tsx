import Script from "next/script";
import { analyticsConfig } from "@/data/analytics";

const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  wait_for_update: 500
});
`.trim();

const gtagInitScript = `
gtag('js', new Date());
gtag('config', '${analyticsConfig.measurementId}', {
  send_page_view: true
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
