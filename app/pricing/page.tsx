import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing-page-content";
import { PricingSchema } from "@/components/pricing-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { pricingPageKeywords } from "@/data/page-keywords";
import { siteConfig } from "@/data/site";

const title = "Pricing";
const description = `${siteConfig.name} is free for freelancers. Classic template PDF export and print are $0. Premium templates are an optional one-time unlock.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: pricingPageKeywords.join(", "),
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  ...buildSocialMetadata({
    title: `Pricing | ${siteConfig.name}`,
    description: "Free invoice generator for freelancers. Optional premium template unlocks and Ko-fi tips.",
    path: "/pricing",
  }),
};

export default function PricingPage() {
  return (
    <>
      <PricingSchema />
      <PricingPageContent />
    </>
  );
}
