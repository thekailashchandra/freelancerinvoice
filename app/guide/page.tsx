import type { Metadata } from "next";
import { GuideIndexContent } from "@/components/guide-index-content";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Freelancer Guide: Invoicing, Tax, and International Billing",
  description:
    "Free guides for freelancers on how to bill international clients, freelance tax requirements, payment terms, GST invoicing in India, and professional invoice checklists.",
  keywords: [
    "freelancer guide",
    "how to bill international clients",
    "freelance tax requirements",
    "freelancer invoice guide",
    "freelance billing tips",
  ],
  alternates: {
    canonical: getCanonicalUrl("/guide"),
  },
  openGraph: {
    title: `Freelancer Guide | ${siteConfig.name}`,
    description:
      "Practical invoicing and tax guides for freelancers and independent contractors.",
    url: getCanonicalUrl("/guide"),
    type: "website",
  },
};

export default function GuideIndexPage() {
  return <GuideIndexContent />;
}
