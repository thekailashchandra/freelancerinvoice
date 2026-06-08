import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleContent } from "@/components/guide-article-content";
import { GuideArticleSchema } from "@/components/guide-article-schema";
import {
  getAllGuideSlugs,
  getGuideBySlug,
} from "@/data/guides";
import { getCanonicalUrl } from "@/data/seo";
import { siteConfig } from "@/data/site";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    return { title: "Guide not found" };
  }

  const canonical = getCanonicalUrl(`/guide/${article.slug}`);

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt,
      siteName: siteConfig.name,
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <GuideArticleSchema article={article} />
      <GuideArticleContent article={article} />
    </>
  );
}
