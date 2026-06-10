import type { TemplatePage } from "@/data/template-pages";
import { WebApplicationSchema } from "@/components/web-application-schema";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildLandingWebPageSchema,
  buildTemplateArticleSchema,
  webApplicationFeatureList,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type TemplatePageSchemaProps = {
  page: TemplatePage;
};

export function TemplatePageSchema({ page }: TemplatePageSchemaProps) {
  const path = `/${page.slug}`;

  return (
    <WebApplicationSchema
      url={getCanonicalUrl(path)}
      description={page.description}
      featureList={`${webApplicationFeatureList}, ${page.category.toLowerCase()} invoice template`}
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: page.title, path }])
        ),
        buildLandingWebPageSchema({
          path,
          name: page.title,
          description: page.description,
        }),
        buildTemplateArticleSchema(page),
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
