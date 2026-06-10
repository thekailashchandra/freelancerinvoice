import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing-page-content";
import { PricingSchema } from "@/components/pricing-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Pricing";
const description = `${siteConfig.name} is free for freelancers. Create invoices, export PDFs, and manage billing at $0. Optional Ko-fi tips help keep the platform running.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  ...buildSocialMetadata({
    title: `Pricing | ${siteConfig.name}`,
    description: "Free invoice generator for freelancers. Optional tips via Ko-fi.",
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
