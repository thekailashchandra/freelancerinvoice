import type { GuideArticle } from "@/data/guides";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildArticleSchema,
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildOrganizationSchema,
} from "@/data/structured-data";

type ArticleSchemaProps = {
  article: GuideArticle;
  basePath?: string;
  breadcrumbLabel?: string;
};

export function ArticleSchema({
  article,
  basePath = "/guide",
  breadcrumbLabel = "Guide",
}: ArticleSchemaProps) {
  const breadcrumbs = buildBreadcrumbItems([
    { name: breadcrumbLabel, path: basePath },
    { name: article.title, path: `${basePath}/${article.slug}` },
  ]);

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(breadcrumbs),
        buildArticleSchema(article, basePath),
      ]}
    />
  );
}
