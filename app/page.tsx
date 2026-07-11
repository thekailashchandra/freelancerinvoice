import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { StructuredData } from "@/components/structured-data";
import {
  buildSocialMetadata,
  getCanonicalUrl,
  homeSeo,
} from "@/data/seo";
import { homePageKeywords } from "@/data/page-keywords";
/** SSG + ISR — auth redirects run in middleware, not here. */
export const revalidate = 86400;

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  keywords: homePageKeywords.join(", "),
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  ...buildSocialMetadata({
    title: homeSeo.ogTitle,
    description: homeSeo.ogDescription,
    path: "/",
  }),
};

export default function HomePage() {
  return (
    <>
      <StructuredData includeFaq includeGeoAnswers />
      <LandingPage />
    </>
  );
}
