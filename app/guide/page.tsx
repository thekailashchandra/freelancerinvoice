import type { Metadata } from "next";
import { GuideIndexContent } from "@/components/guide-index-content";
import { GuideIndexSchema } from "@/components/guide-index-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Freelancer Guide: Invoicing, Tax, and International Billing";
const description =
  "Free guides for freelancers on how to bill international clients, freelance tax requirements, payment terms, GST invoicing in India, and professional invoice checklists.";

export const metadata: Metadata = {
  title,
  description,
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
  ...buildSocialMetadata({
    title: `Freelancer Guide | ${siteConfig.name}`,
    description:
      "Practical invoicing and tax guides for freelancers and independent contractors.",
    path: "/guide",
  }),
};

export default function GuideIndexPage() {
  return (
    <>
      <GuideIndexSchema />
      <GuideIndexContent />
    </>
  );
}
