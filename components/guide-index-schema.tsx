import { SchemaGraph } from "@/components/schema-graph";
import { guideArticles } from "@/data/guides";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

type GuideIndexSchemaProps = {
  basePath?: string;
  breadcrumbLabel?: string;
  pageTitle?: string;
};

export function GuideIndexSchema({
  basePath = "/guide",
  breadcrumbLabel = "Guide",
  pageTitle = "Freelancer Guide: Invoicing, Tax, and International Billing",
}: GuideIndexSchemaProps) {
  const url = getCanonicalUrl(basePath);

  return (
    <SchemaGraph
      nodes={[
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([{ name: breadcrumbLabel, path: basePath }])
        ),
        {
          "@type": "CollectionPage",
          "@id": `${url}#collection`,
          name: pageTitle,
          description:
            "Practical invoicing and tax guides for freelancers and independent contractors.",
          url,
          isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: guideArticles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.title,
              url: getCanonicalUrl(`${basePath}/${article.slug}`),
            })),
          },
        },
      ]}
    />
  );
}
