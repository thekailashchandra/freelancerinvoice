import { SchemaGraph } from "@/components/schema-graph";
import {
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
  schemaIds,
} from "@/data/structured-data";
import { geoAuthoritativeAnswers } from "@/data/geo";
import { faqItems, homeSeo } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { buildFaqPageSchemaFromItems } from "@/data/structured-data";

type StructuredDataProps = {
  /** Include FAQ schema — use on pages that render the FAQ section. */
  includeFaq?: boolean;
  /** Append GEO authoritative Q&A to FAQ schema (homepage). */
  includeGeoAnswers?: boolean;
};

export function StructuredData({
  includeFaq = false,
  includeGeoAnswers = false,
}: StructuredDataProps) {
  const webPage = {
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    name: homeSeo.title,
    description: homeSeo.description,
    url: siteConfig.url,
    isPartOf: { "@id": schemaIds.website },
    about: {
      "@type": "Thing",
      name: "Freelancer invoicing and billing",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/opengraph-image`,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "h1",
        ".seo-hero-summary",
        ".geo-page-summary",
        ".geo-fact-answer",
        ".faq-answer",
      ],
    },
  };

  const nodes = [
    buildWebSiteSchema(),
    buildOrganizationSchema(),
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
