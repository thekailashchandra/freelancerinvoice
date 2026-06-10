import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparisonPageContent } from "@/components/comparison-page-content";
import { ComparisonPageSchema } from "@/components/comparison-page-schema";
import {
  comparisonSlugs,
  getComparisonBySlug,
  isComparisonSlug,
} from "@/data/comparisons";
import { buildPageMetadata } from "@/data/seo";

type ComparisonRouteProps = {
  params: Promise<{ competitor: string }>;
};

export async function generateStaticParams() {
  return comparisonSlugs.map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: ComparisonRouteProps): Promise<Metadata> {
  const { competitor } = await params;

  if (!isComparisonSlug(competitor)) {
    return { title: "Page not found" };
  }

  const page = getComparisonBySlug(competitor)!;
  return buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/vs/${page.slug}`,
    keywords: page.keywords,
    type: "article",
    publishedTime: page.publishedAt,
  });
}

export default async function ComparisonPage({ params }: ComparisonRouteProps) {
  const { competitor } = await params;

  if (!isComparisonSlug(competitor)) {
    notFound();
  }

  const page = getComparisonBySlug(competitor)!;

  return (
    <>
      <ComparisonPageSchema page={page} />
      <ComparisonPageContent page={page} />
    </>
  );
}
