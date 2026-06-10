import type { BlogCluster } from "@/data/blog-clusters";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type BlogClusterSchemaProps = {
  cluster: BlogCluster;
};

export function BlogClusterSchema({ cluster }: BlogClusterSchemaProps) {
  const url = getCanonicalUrl(`/blog/cluster/${cluster.slug}`);

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: "Blog", path: "/blog" },
            { name: cluster.title, path: `/blog/cluster/${cluster.slug}` },
          ])
        ),
        {
          "@type": "CollectionPage",
          name: cluster.title,
          description: cluster.description,
          url,
        },
        buildFaqPageSchemaFromItems(cluster.faqItems),
      ]}
    />
  );
}
