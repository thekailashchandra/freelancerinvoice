import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/blog-index-content";
import { GuideIndexSchema } from "@/components/guide-index-schema";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Blog";
const description =
  "Freelancer invoicing blog with guides on international billing, freelance taxes, payment terms, GST invoicing, and professional invoice best practices.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/blog") },
  ...buildSocialMetadata({
    title: `Blog | ${siteConfig.name}`,
    description,
    path: "/blog",
  }),
};

export default function BlogPage() {
  return (
    <>
      <GuideIndexSchema
        basePath="/blog"
        breadcrumbLabel="Blog"
        pageTitle="Freelancer Invoicing & Billing Blog"
      />
      <BlogIndexContent />
    </>
  );
}
