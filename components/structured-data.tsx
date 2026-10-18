import { SchemaGraph } from "@/components/schema-graph";
import {
  buildOrganizationSchema,
  buildLandingWebPageSchema,
  buildSoftwareApplicationSchema,
  buildWebApplicationSchema,
  buildWebSiteSchema,
  schemaIds,
} from "@/data/structured-data";
import { geoAuthoritativeAnswers } from "@/data/geo";
import { faqItems, homeSeo } from "@/data/seo";
import { buildFaqPageSchemaFromItems } from "@/data/structured-data";

type StructuredDataProps = {
  /** Include FAQ schema - use on pages that render the FAQ section. */
  includeFaq?: boolean;
  /** Append GEO authoritative Q&A to FAQ schema (homepage). */
  includeGeoAnswers?: boolean;
};

export function StructuredData({
  includeFaq = false,
  includeGeoAnswers = false,
}: StructuredDataProps) {
  const webPage = {
    ...buildLandingWebPageSchema({
      path: "/",
      name: homeSeo.title,
      description: homeSeo.description,
    }),
    about: { "@id": schemaIds.webApp },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "h1",
        ".seo-hero-summary",
        ".geo-page-summary",
        ".geo-fact-answer",
        ".faq-answer",
        ".geo-direct-answer-text",
      ],
    },
  };

  const nodes = [
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildWebApplicationSchema(),
    buildSoftwareApplicationSchema(),
    webPage,
    ...(includeFaq
      ? [
          buildFaqPageSchemaFromItems([
            ...faqItems,
            ...(includeGeoAnswers ? geoAuthoritativeAnswers : []),
          ]),
        ]
      : []),
  ];

  return <SchemaGraph nodes={nodes} />;
}
