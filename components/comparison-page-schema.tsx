import type { ComparisonPage } from "@/data/comparisons";
import { WebApplicationSchema } from "@/components/web-application-schema";
import { siteConfig } from "@/data/site";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type ComparisonPageSchemaProps = {
  page: ComparisonPage;
};

export function ComparisonPageSchema({ page }: ComparisonPageSchemaProps) {
  const url = getCanonicalUrl(`/vs/${page.slug}`);

  return (
    <WebApplicationSchema
      url={url}
      description={page.metaDescription}
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: "Comparisons", path: "/vs/freshbooks" },
            { name: page.h1, path: `/vs/${page.slug}` },
          ])
        ),
        buildLandingWebPageSchema({
          path: `/vs/${page.slug}`,
          name: page.title,
          description: page.metaDescription,
        }),
        {
          "@type": "Article",
          headline: page.title,
          description: page.metaDescription,
          url,
          about: [
            { "@type": "WebApplication", name: siteConfig.name },
            { "@type": "SoftwareApplication", name: page.competitorName },
          ],
        },
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
