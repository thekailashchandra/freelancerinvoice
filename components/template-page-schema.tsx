import type { TemplatePage } from "@/data/template-pages";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildTemplateArticleSchema,
} from "@/data/structured-data";

type TemplatePageSchemaProps = {
  page: TemplatePage;
};

export function TemplatePageSchema({ page }: TemplatePageSchemaProps) {
  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: page.category, path: `/${page.slug}` },
          ])
        ),
        buildSoftwareApplicationSchema(),
        buildTemplateArticleSchema(page),
        buildFaqPageSchemaFromItems(page.faqItems),
      ]}
    />
  );
}
