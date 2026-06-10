import type { Metadata } from "next";
import { FreelanceFinancesContent } from "@/components/freelance-finances-content";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { SchemaGraph } from "@/components/schema-graph";
import { buildPageMetadata, getCanonicalUrl } from "@/data/seo";
import {
  freelanceFinancesFaqs,
  topicalAuthorityHub,
  topicalPillars,
} from "@/data/topical-pillars";
import {
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: `${topicalAuthorityHub.title} — Expert Guides for Freelancers`,
  description: topicalAuthorityHub.description,
  path: "/freelance-finances",
  keywords: [...topicalAuthorityHub.keywords],
});

export default function FreelanceFinancesPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[
          { name: topicalAuthorityHub.title, path: "/freelance-finances" },
        ]}
      />
      <SchemaGraph
        nodes={[
          buildOrganizationSchema(),
          buildSoftwareApplicationSchema(),
          {
            "@type": "WebPage",
            name: topicalAuthorityHub.title,
            description: topicalAuthorityHub.description,
            url: getCanonicalUrl("/freelance-finances"),
            about: topicalPillars.map((pillar) => ({
              "@type": "Thing",
              name: pillar.title,
              description: pillar.description,
            })),
          },
          buildFaqPageSchemaFromItems(freelanceFinancesFaqs),
        ]}
      />
      <FreelanceFinancesContent />
    </>
  );
}
