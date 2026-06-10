import type { AiGuide } from "@/data/ai-guides";
import type { GuideArticle } from "@/data/guides";
import type { TemplateFaqItem, TemplatePage } from "@/data/template-pages";
import { productFeatures } from "@/data/features";
import { geoEntity, geoTopics } from "@/data/geo";
import { faqItems, getCanonicalUrl, homeSeo } from "@/data/seo";
import { siteConfig } from "@/data/site";

export const schemaIds = {
  website: `${siteConfig.url}/#website`,
  organization: `${siteConfig.url}/#organization`,
  software: `${siteConfig.url}/#software`,
} as const;

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
    description: siteConfig.description,
    knowsAbout: [...geoTopics],
    areaServed: "Worldwide",
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
  return {
    "@type": "SoftwareApplication",
    "@id": schemaIds.software,
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Invoicing software",
    operatingSystem: "Web browser",
    url: siteConfig.url,
    description: homeSeo.description,
    image: `${siteConfig.url}${siteConfig.logos.light}`,
    screenshot: `${siteConfig.url}/opengraph-image`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: getCanonicalUrl("/signup"),
      description:
        "Free freelancer invoice generator with PDF export and cloud storage",
    },
    featureList: productFeatures.map((feature) => feature.title),
    audience: {
      "@type": "Audience",
      audienceType: "Freelancers, independent contractors, and agencies",
    },
    publisher: { "@id": schemaIds.organization },
    provider: { "@id": schemaIds.organization },
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

  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    name: article.title,
    description: article.description,
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
