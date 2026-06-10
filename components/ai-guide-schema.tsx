import type { AiGuide } from "@/data/ai-guides";
import { WebApplicationSchema } from "@/components/web-application-schema";
import {
  buildAiGuideArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildHowToSchema,
  buildLandingWebPageSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type AiGuideSchemaProps = {
  guide: AiGuide;
};

export function AiGuideSchema({ guide }: AiGuideSchemaProps) {
  const url = getCanonicalUrl(`/${guide.slug}`);

  return (
    <WebApplicationSchema
      url={url}
      description={guide.description}
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: guide.category, path: `/${guide.slug}` },
          ])
        ),
        buildLandingWebPageSchema({
          path: `/${guide.slug}`,
          name: guide.title,
          description: guide.description,
        }),
        buildAiGuideArticleSchema(guide),
        buildHowToSchema(guide),
        buildFaqPageSchemaFromItems(guide.faqItems),
      ]}
    />
  );
}
