import type { SeoLandingPage } from "@/data/landing-pages";
import { WebApplicationSchema } from "@/components/web-application-schema";
import { getCanonicalUrl } from "@/data/seo";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildLandingWebPageSchema,
  webApplicationFeatureList,
} from "@/data/structured-data";

type SeoLandingPageSchemaProps = {
  page: SeoLandingPage;
};

function landingFeatureList(page: SeoLandingPage): string {
  const extras = page.benefits.slice(0, 2).join(", ");
  return extras
    ? `${webApplicationFeatureList}, ${extras}`
    : webApplicationFeatureList;
}

export function SeoLandingPageSchema({ page }: SeoLandingPageSchemaProps) {
  const path = `/${page.slug}`;

  return (
    <WebApplicationSchema
      url={getCanonicalUrl(path)}
      description={page.metaDescription}
      featureList={landingFeatureList(page)}
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: page.h1, path }])
        ),
        buildLandingWebPageSchema({
          path,
          name: page.title,
          description: page.metaDescription,
        }),
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
