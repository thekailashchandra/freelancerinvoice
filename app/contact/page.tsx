import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact-page-content";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Contact";
const description = `Contact ${siteConfig.name} for support, feature requests, partnerships, or general questions about our free freelancer invoice generator.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/contact") },
  ...buildSocialMetadata({ title, description, path: "/contact" }),
};

export default function ContactPage() {
  return (
    <>
      <PublicBreadcrumbSchema segments={[{ name: "Contact", path: "/contact" }]} />
      <ContactPageContent />
    </>
  );
}
