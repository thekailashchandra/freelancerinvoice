import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiGuideContent } from "@/components/ai-guide-content";
import { AiGuideSchema } from "@/components/ai-guide-schema";
import { SeoLandingPageContent } from "@/components/seo-landing-page-content";
import { SeoLandingPageSchema } from "@/components/seo-landing-page-schema";
import { TemplatePageContent } from "@/components/template-page-content";
import { TemplatePageSchema } from "@/components/template-page-schema";
import {
  aiGuideSlugs,
  getAiGuideBySlug,
  isAiGuideSlug,
} from "@/data/ai-guides";
import {
  getLandingPageBySlug,
  isLandingPageSlug,
  landingPageSlugs,
} from "@/data/landing-pages";
import {
  getTemplatePageBySlug,
  isTemplatePageSlug,
  templatePageSlugs,
} from "@/data/template-pages";
import { buildPageMetadata } from "@/data/seo";

type MarketingSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [...templatePageSlugs, ...aiGuideSlugs, ...landingPageSlugs].map(
    (slug) => ({ slug })
  );
}

export async function generateMetadata({
  params,
}: MarketingSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isAiGuideSlug(slug)) {
    const guide = getAiGuideBySlug(slug)!;
    return buildPageMetadata({
      title: guide.title,
      description: guide.description,
      path: `/${guide.slug}`,
      keywords: [...guide.keywords],
      type: "article",
      publishedTime: guide.publishedAt,
    });
  }

  if (isTemplatePageSlug(slug)) {
    const page = getTemplatePageBySlug(slug)!;
    return buildPageMetadata({
      title: page.title,
      description: page.description,
      path: `/${page.slug}`,
      keywords: [...page.keywords],
      type: "article",
      publishedTime: page.publishedAt,
    });
  }

  if (isLandingPageSlug(slug)) {
    const page = getLandingPageBySlug(slug)!;
    return buildPageMetadata({
      title: page.title,
      description: page.metaDescription,
      path: `/${page.slug}`,
      keywords: page.keywords,
      type: "article",
      publishedTime: page.publishedAt,
    });
  }

  return { title: "Page not found" };
}

export default async function MarketingSlugPage({
  params,
}: MarketingSlugPageProps) {
  const { slug } = await params;

  if (isAiGuideSlug(slug)) {
    const guide = getAiGuideBySlug(slug)!;
    return (
      <>
        <AiGuideSchema guide={guide} />
        <AiGuideContent guide={guide} />
      </>
    );
  }

  if (isTemplatePageSlug(slug)) {
    const page = getTemplatePageBySlug(slug)!;
    return (
      <>
        <TemplatePageSchema page={page} />
        <TemplatePageContent page={page} />
      </>
    );
  }

  if (isLandingPageSlug(slug)) {
    const page = getLandingPageBySlug(slug)!;
    return (
      <>
        <SeoLandingPageSchema page={page} />
        <SeoLandingPageContent page={page} />
      </>
    );
  }

  notFound();
}
