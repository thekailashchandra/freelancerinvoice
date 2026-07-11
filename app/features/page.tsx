import type { Metadata } from "next";
import { FeaturesPageContent } from "@/components/features-page-content";
import { WebApplicationSchema } from "@/components/web-application-schema";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { featuresPageKeywords } from "@/data/page-keywords";
import { siteConfig } from "@/data/site";

const title = "Features";
const description = `Explore ${siteConfig.name} features: professional invoices, PDF export, cloud storage, payment tracking, multi-currency billing, and GST support for freelancers.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: featuresPageKeywords.join(", "),
  alternates: { canonical: getCanonicalUrl("/features") },
  ...buildSocialMetadata({ title, description, path: "/features" }),
};

export default function FeaturesPage() {
  return (
    <>
      <WebApplicationSchema
        url={getCanonicalUrl("/features")}
        description={description}
        nodes={[
          buildBreadcrumbListSchema(
            buildBreadcrumbItems([{ name: "Features", path: "/features" }])
          ),
          buildLandingWebPageSchema({
            path: "/features",
            name: title,
            description,
          }),
        ]}
      />
      <FeaturesPageContent />
    </>
  );
}
