import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleSchema } from "@/components/article-schema";
import { GuideArticleContent } from "@/components/guide-article-content";
import {
  getAllGuideSlugs,
  getGuideBySlug,
} from "@/data/guides";
import { buildSocialMetadata, getCanonicalUrl } from "@/data/seo";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: getCanonicalUrl(`/blog/${article.slug}`) },
    ...buildSocialMetadata({
      title: article.title,
      description: article.description,
      path: `/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
    }),
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticleSchema article={article} basePath="/blog" breadcrumbLabel="Blog" />
      <GuideArticleContent
        article={article}
        basePath="/blog"
        indexLabel="Blog"
      />
    </>
  );
}
