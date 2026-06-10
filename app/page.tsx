import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LandingPage } from "@/components/landing-page";
import {
  GEO_COUNTRY_COOKIE,
  GEO_MARKET_COOKIE,
  resolveMarketContext,
} from "@/lib/geo-market";
import { StructuredData } from "@/components/structured-data";
import {
  buildKeywordsString,
  buildSocialMetadata,
  getCanonicalUrl,
  homeSeo,
} from "@/data/seo";
import { MARKETING_ISR_SECONDS } from "@/lib/cache-config";

/** SSG + ISR — auth redirects run in middleware, not here. */
export const revalidate = MARKETING_ISR_SECONDS;

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  keywords: buildKeywordsString(),
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  ...buildSocialMetadata({
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    path: "/",
  }),
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const marketContext = resolveMarketContext({
    countryCode: cookieStore.get(GEO_COUNTRY_COOKIE)?.value ?? null,
    market: cookieStore.get(GEO_MARKET_COOKIE)?.value ?? null,
  });

  return (
    <>
      <StructuredData includeGeoAnswers />
      <LandingPage marketContext={marketContext} />
    </>
  );
}
