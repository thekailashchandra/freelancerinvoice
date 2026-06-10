import type { TopicalPillar } from "@/data/topical-pillars";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbItems,
  buildBreadcrumbListSchema,
  buildFaqPageSchemaFromItems,
  buildOrganizationSchema,
} from "@/data/structured-data";
import { getCanonicalUrl } from "@/data/seo";

type PillarHubSchemaProps = {
  pillar: TopicalPillar;
};

export function PillarHubSchema({ pillar }: PillarHubSchemaProps) {
  const url = getCanonicalUrl(`/blog/pillar/${pillar.slug}`);

  return (
    <SchemaGraph
      nodes={[
        buildOrganizationSchema(),
        buildBreadcrumbListSchema(
          buildBreadcrumbItems([
            { name: "Freelance Finances", path: "/freelance-finances" },
            { name: pillar.title, path: `/blog/pillar/${pillar.slug}` },
          ])
        ),
        {
          "@type": "CollectionPage",
          name: pillar.title,
          description: pillar.description,
          url,
          about: pillar.keywords.map((keyword) => ({
            "@type": "Thing",
            name: keyword,
          })),
        },
        buildFaqPageSchemaFromItems(pillar.faqItems),
      ]}
    />
  );
}
