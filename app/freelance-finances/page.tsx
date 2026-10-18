import type { Metadata } from "next";
import { FreelanceFinancesContent } from "@/components/freelance-finances-content";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { WebApplicationSchema } from "@/components/web-application-schema";
import { buildPageMetadata, getCanonicalUrl } from "@/data/seo";
import {
  freelanceFinancesFaqs,
  topicalAuthorityHub,
  topicalPillars,
} from "@/data/topical-pillars";
import {
  buildFaqPageSchemaFromItems,
  buildLandingWebPageSchema,
} from "@/data/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: `${topicalAuthorityHub.title} - Expert Guides for Freelancers`,
  description: topicalAuthorityHub.description,
  path: "/freelance-finances",
  keywords: [...topicalAuthorityHub.keywords],
});

export default function FreelanceFinancesPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[
          { name: topicalAuthorityHub.title, path: "/freelance-finances" },
        ]}
      />
      <WebApplicationSchema
        url={getCanonicalUrl("/freelance-finances")}
        description={topicalAuthorityHub.description}
        nodes={[
          {
            ...buildLandingWebPageSchema({
              path: "/freelance-finances",
              name: topicalAuthorityHub.title,
              description: topicalAuthorityHub.description,
            }),
            about: [
              { "@id": `${getCanonicalUrl("/freelance-finances")}#webapplication` },
              ...topicalPillars.map((pillar) => ({
                "@type": "Thing",
                name: pillar.title,
                description: pillar.description,
              })),
            ],
          },
          buildFaqPageSchemaFromItems(freelanceFinancesFaqs),
        ]}
      />
      <FreelanceFinancesContent />
    </>
  );
}
