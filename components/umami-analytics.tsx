"use client";

import Script from "next/script";

const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();

/** Optional Umami analytics (privacy-friendly, open source). */
export function UmamiAnalytics() {
  if (!websiteId || !scriptUrl) return null;

  return (
    <Script
      async
      defer
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
