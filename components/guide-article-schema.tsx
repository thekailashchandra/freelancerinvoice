import type { GuideArticle } from "@/data/guides";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

type GuideArticleSchemaProps = {
  article: GuideArticle;
};

export function GuideArticleSchema({ article }: GuideArticleSchemaProps) {
  const url = getCanonicalUrl(`/guide/${article.slug}`);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logos.light}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
