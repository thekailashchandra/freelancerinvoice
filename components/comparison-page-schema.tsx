import type { ComparisonPage } from "@/data/comparisons";
import { SchemaGraph } from "@/components/schema-graph";
import { siteConfig } from "@/data/site";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type ComparisonPageSchemaProps = {
  page: ComparisonPage;
};

export function ComparisonPageSchema({ page }: ComparisonPageSchemaProps) {
  const url = getCanonicalUrl(`/vs/${page.slug}`);

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: "Comparisons", path: "/vs/freshbooks" },
            { name: page.h1, path: `/vs/${page.slug}` },
          ])
        ),
        buildSoftwareApplicationSchema(),
        {
          "@type": "Article",
          headline: page.title,
          description: page.metaDescription,
          url,
          about: [
            { "@type": "SoftwareApplication", name: siteConfig.name },
            { "@type": "SoftwareApplication", name: page.competitorName },
          ],
        },
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
