/** Google AdSense + Funding Choices (Google CMP) configuration */

const DEFAULT_CLIENT_ID = "ca-pub-1406068437280536";

export function getAdsenseClientId(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? DEFAULT_CLIENT_ID;
}

/** Funding Choices uses `pub-` without the `ca-` prefix */
export function getFundingChoicesPubId(): string {
  return getAdsenseClientId().replace(/^ca-/, "");
}

export const adsenseConfig = {
  clientId: getAdsenseClientId(),
  fundingChoicesUrl: `https://fundingchoicesmessages.google.com/i/pub-${getFundingChoicesPubId()}?ers=1`,
  adsScriptUrl: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getAdsenseClientId()}`,
} as const;
