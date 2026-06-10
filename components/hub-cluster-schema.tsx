import type { HubCluster } from "@/data/hub-clusters";
import { getHubClusterPath } from "@/data/hub-clusters";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type HubClusterSchemaProps = {
  cluster: HubCluster;
};

export function HubClusterSchema({ cluster }: HubClusterSchemaProps) {
  const url = getCanonicalUrl(getHubClusterPath(cluster));

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: "Blog", path: "/blog" },
            { name: cluster.title, path: getHubClusterPath(cluster) },
          ])
        ),
        {
          "@type": "Article",
          headline: cluster.title,
          description: cluster.description,
          url,
          articleSection: "Freelance Invoicing",
          about: cluster.keywords.map((keyword) => ({
            "@type": "Thing",
            name: keyword,
          })),
        },
        {
          "@type": "CollectionPage",
          name: cluster.title,
          description: cluster.description,
          url,
          hasPart: cluster.spokes.map((spoke) => ({
            "@type": "Article",
            name: spoke.title,
            url: getCanonicalUrl(`/blog/${spoke.articleSlug}`),
          })),
        },
        buildFaqPageSchemaFromItems(cluster.faqItems),
      ]}
    />
  );
}
