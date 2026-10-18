import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about-page-content";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { aboutPageKeywords } from "@/data/page-keywords";
import { siteConfig } from "@/data/site";

const title = "About";
const description = `Learn about ${siteConfig.name} - an open-source, monochrome invoicing studio for freelancers, independent contractors, and small agencies.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: aboutPageKeywords.join(", "),
  alternates: { canonical: getCanonicalUrl("/about") },
  ...buildSocialMetadata({ title, description, path: "/about" }),
};

export default function AboutPage() {
  return (
    <>
      <PublicBreadcrumbSchema segments={[{ name: "About", path: "/about" }]} />
      <AboutPageContent />
    </>
  );
}
