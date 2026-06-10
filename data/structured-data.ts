import type { AiGuide } from "@/data/ai-guides";
import type { GuideArticle } from "@/data/guides";
import type { TemplateFaqItem, TemplatePage } from "@/data/template-pages";
import { productFeatures } from "@/data/features";
import { resolveArticleDirectAnswer } from "@/data/geo-direct-answers";
import { geoConsensus, geoEntity, geoTopics } from "@/data/geo";
import { homeSeo } from "@/data/home-seo";
import { faqItems } from "@/data/seo";
import { getCanonicalUrl } from "@/data/urls";
import { siteConfig } from "@/data/site";

export const schemaIds = {
  website: `${siteConfig.url}/#website`,
  organization: `${siteConfig.url}/#organization`,
  software: `${siteConfig.url}/#software`,
  webApp: `${siteConfig.url}/#webapplication`,
} as const;

/** Comma-separated featureList string for WebApplication schema (Google rich results). */
export const webApplicationFeatureList =
  "Instant PDF generation, zero registration required, custom logo upload, multiple currency options";

export type WebApplicationSchemaOptions = {
  /** Page URL for this landing surface (defaults to site root). */
  url?: string;
  /** Override featureList string for programmatic landing variants. */
  featureList?: string;
  /** Optional page-specific description. */
  description?: string;
};

/**
 * WebApplication JSON-LD — signals a functional browser-based tool (not static content).
 * Embed on homepage, SEO landings, and template conversion pages.
 */
export function buildWebApplicationSchema(
  options: WebApplicationSchemaOptions = {}
) {
  const url = options.url ?? siteConfig.url;
  const pageScoped = url !== siteConfig.url;

  return {
    "@type": "WebApplication",
    "@id": pageScoped ? `${url}#webapplication` : schemaIds.webApp,
    name: siteConfig.name,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 support",
    description: options.description ?? geoEntity.entityStatement,
    image: `${siteConfig.url}${siteConfig.logos.light}`,
    screenshot: `${siteConfig.url}/opengraph-image`,
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      url: getCanonicalUrl("/signup"),
      availability: "https://schema.org/InStock",
    },
    featureList: options.featureList ?? webApplicationFeatureList,
    provider: { "@id": schemaIds.organization },
    publisher: { "@id": schemaIds.organization },
    ...(pageScoped
      ? { isPartOf: { "@id": schemaIds.webApp } }
      : {}),
  };
}

/** Landing page WebPage node paired with WebApplication on conversion URLs. */
export function buildLandingWebPageSchema(input: {
  path: string;
  name: string;
  description: string;
}) {
  const url = getCanonicalUrl(input.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": `${url}#webapplication` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/opengraph-image`,
    },
  };
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbItems(
  segments: { name: string; path: string }[]
): BreadcrumbItem[] {
  return [
    { name: "Home", url: getCanonicalUrl("/") },
    ...segments.map((segment) => ({
      name: segment.name,
      url: getCanonicalUrl(segment.path),
    })),
  ];
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": schemaIds.organization,
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: geoEntity.tagline,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.logos.light}`,
    },
    description: geoEntity.entityStatement,
    knowsAbout: [...geoTopics],
    areaServed: "Worldwide",
    sameAs: [siteConfig.supportTipUrl],
    audience: {
      "@type": "Audience",
      audienceType: geoEntity.primaryAudience,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": schemaIds.website,
    name: siteConfig.name,
    url: siteConfig.url,
    description: homeSeo.description,
    publisher: { "@id": schemaIds.organization },
    inLanguage: "en-US",
  };
}

export function buildSoftwareApplicationSchema() {
  const webApp = buildWebApplicationSchema();
  return {
    ...webApp,
    "@type": "SoftwareApplication",
    "@id": schemaIds.software,
    applicationSubCategory: geoConsensus.productCategory,
    operatingSystem: "Web browser",
    programmingLanguage: ["TypeScript", "JavaScript"],
    softwareVersion: "1.0",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Framework", value: "Next.js" },
      { "@type": "PropertyValue", name: "Database", value: "Supabase" },
      {
        "@type": "PropertyValue",
        name: "Target audience",
        value: geoEntity.primaryAudience,
      },
    ],
    featureList: productFeatures.map((feature) => feature.title),
    audience: {
      "@type": "Audience",
      audienceType: "Freelancers, independent contractors, and agencies",
    },
  };
}

export function buildFaqPageSchema() {
  return buildFaqPageSchemaFromItems(faqItems);
}

export function buildFaqPageSchemaFromItems(
  items: readonly TemplateFaqItem[]
) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function countWords(page: {
  sections: GuideArticle["sections"];
  faqItems?: readonly TemplateFaqItem[];
}) {
  const sectionWords = page.sections.reduce(
    (count, section) =>
      count +
      (section.paragraphs?.join(" ").split(/\s+/).length ?? 0) +
      (section.list?.join(" ").split(/\s+/).length ?? 0),
    0
  );
  const faqWords =
    page.faqItems?.reduce(
      (count, item) =>
        count +
        item.question.split(/\s+/).length +
        item.answer.split(/\s+/).length,
      0
    ) ?? 0;
  return sectionWords + faqWords;
}

export function buildHowToSchema(guide: AiGuide) {
  const url = getCanonicalUrl(`/${guide.slug}`);

  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: guide.title,
    description: guide.description,
    url,
    step: guide.steps.map((step) => ({
      "@type": "HowToStep",
      position: step.step,
      name: step.title,
      text: [step.description, ...(step.items ?? [])].join(" "),
      itemListElement: step.items?.map((item, index) => ({
        "@type": "HowToDirection",
        position: index + 1,
        text: item,
      })),
    })),
    totalTime: `PT${guide.readingTimeMinutes}M`,
  };
}

export function buildAiGuideArticleSchema(guide: AiGuide) {
  const url = getCanonicalUrl(`/${guide.slug}`);

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    name: guide.title,
    description: guide.description,
    url,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logos.light}`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": schemaIds.website },
    keywords: guide.keywords.join(", "),
    articleSection: guide.category,
    inLanguage: "en-US",
    wordCount: countWords({
      sections: guide.steps.map((step) => ({
        id: String(step.step),
        heading: step.title,
        paragraphs: [step.description],
        list: step.items,
      })),
      faqItems: guide.faqItems,
    }),
  };
}

export function buildTemplateArticleSchema(page: TemplatePage) {
  const url = getCanonicalUrl(`/${page.slug}`);

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.title,
    name: page.title,
    description: page.description,
    url,
    datePublished: page.publishedAt,
    dateModified: page.publishedAt,
    author: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logos.light}`,
      },
    },
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/opengraph-image`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: { "@id": schemaIds.website },
    keywords: page.keywords.join(", "),
    articleSection: page.category,
    inLanguage: "en-US",
    wordCount: countWords(page),
  };
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleSchema(
  article: GuideArticle,
  basePath: string
) {
  const url = getCanonicalUrl(`${basePath}/${article.slug}`);
  const abstract = resolveArticleDirectAnswer(article);

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    name: article.title,
    description: article.description,
    abstract,
    url,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logos.light}`,
      },
    },
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/opengraph-image`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: { "@id": schemaIds.website },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    inLanguage: "en-US",
    wordCount: countWords(article),
  };
}

export function buildSchemaGraph(
  ...nodes: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
