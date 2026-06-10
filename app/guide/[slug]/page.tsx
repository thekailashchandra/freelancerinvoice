import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleSchema } from "@/components/article-schema";
import { GuideArticleContent } from "@/components/guide-article-content";
import {
  getAllGuideSlugs,
  getGuideBySlug,
} from "@/data/guides";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";

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
    ...buildSocialMetadata({
      title: article.title,
      description: article.description,
      path: `/guide/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
    }),
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
      <ArticleSchema article={article} basePath="/guide" breadcrumbLabel="Guide" />
      <GuideArticleContent article={article} />
    </>
  );
}
