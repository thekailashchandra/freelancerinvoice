import type { SeoLandingPage } from "@/data/landing-pages";
import { SchemaGraph } from "@/components/schema-graph";
import { getCanonicalUrl } from "@/data/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";

type SeoLandingPageSchemaProps = {
  page: SeoLandingPage;
};

export function SeoLandingPageSchema({ page }: SeoLandingPageSchemaProps) {
  const url = getCanonicalUrl(`/${page.slug}`);

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: page.h1, path: url }])
        ),
        buildSoftwareApplicationSchema(),
        {
          "@type": "WebPage",
          name: page.title,
          description: page.metaDescription,
          url,
          about: { "@type": "Thing", name: page.category },
        },
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
