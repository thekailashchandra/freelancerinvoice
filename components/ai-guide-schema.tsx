import type { AiGuide } from "@/data/ai-guides";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildAiGuideArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildHowToSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";

type AiGuideSchemaProps = {
  guide: AiGuide;
};

export function AiGuideSchema({ guide }: AiGuideSchemaProps) {
  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: guide.category, path: `/${guide.slug}` },
          ])
        ),
        buildSoftwareApplicationSchema(),
        buildAiGuideArticleSchema(guide),
        buildHowToSchema(guide),
        buildFaqPageSchemaFromItems(guide.faqItems),
      ]}
    />
  );
}
