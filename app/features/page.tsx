import type { Metadata } from "next";
import { FeaturesPageContent } from "@/components/features-page-content";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

const title = "Features";
const description = `Explore ${siteConfig.name} features: professional invoices, PDF export, cloud storage, payment tracking, multi-currency billing, and GST support for freelancers.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: getCanonicalUrl("/features") },
  ...buildSocialMetadata({ title, description, path: "/features" }),
};

export default function FeaturesPage() {
  return (
    <>
      <SchemaGraph
        nodes={[
          buildOrganizationSchema(),
          buildBreadcrumbListSchema(
            buildBreadcrumbItems([{ name: "Features", path: "/features" }])
          ),
          buildSoftwareApplicationSchema(),
        ]}
      />
      <FeaturesPageContent />
    </>
  );
}
