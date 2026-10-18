import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing-page-content";
import { PricingSchema } from "@/components/pricing-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { pricingPageKeywords } from "@/data/page-keywords";
import { siteConfig } from "@/data/site";

const title = "Pricing";
const description = `${siteConfig.name} is free to self-host. The hosted Cloud plan is ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. It unlocks PDF download, printing, brand colors, and every template.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: pricingPageKeywords.join(", "),
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  ...buildSocialMetadata({
    title: `Pricing | ${siteConfig.name}`,
    description:
      "Self-host for free or subscribe to Cloud for ₹299/month or ₹999/year in India, and $5/month or $19/year elsewhere. Preview invoices free; unlock PDF and print with Cloud.",
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
