import type { Metadata } from "next";
import { PricingPageContent } from "@/components/pricing-page-content";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${siteConfig.name} is free for freelancers. Create invoices, export PDFs, and manage billing at $0. Optional PayPal support helps keep the platform running.`,
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
  openGraph: {
    title: `Pricing | ${siteConfig.name}`,
    description: "Free invoice generator for freelancers. Optional support via PayPal.",
    url: getCanonicalUrl("/pricing"),
    type: "website",
  },
};

export default function PricingPage() {
  return <PricingPageContent />;
}
