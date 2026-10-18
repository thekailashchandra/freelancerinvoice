/**
 * @deprecated Use topical-pillars.ts - kept for sitemap/robots path generation.
 * Cluster slugs now map 1:1 to topical authority pillars.
 */
import type { TemplateFaqItem } from "@/data/template-pages/types";
import { getPillarArticles, topicalPillars } from "@/data/topical-pillars";

export type BlogCluster = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  articleSlugs: string[];
  faqItems: TemplateFaqItem[];
};

export const blogClusters: BlogCluster[] = topicalPillars.map((pillar) => ({
  slug: pillar.slug,
  title: pillar.title,
  description: pillar.description,
  keywords: pillar.keywords,
  articleSlugs: getPillarArticles(pillar).map((a) => a.slug),
  faqItems: pillar.faqItems,
}));

const clusterMap = new Map(blogClusters.map((c) => [c.slug, c]));

export function getBlogCluster(slug: string): BlogCluster | undefined {
  return clusterMap.get(slug);
}

export function getClusterArticles(cluster: BlogCluster) {
  return getPillarArticles(
    topicalPillars.find((p) => p.slug === cluster.slug)!
  );
}

export { topicalPillars, getTopicalPillar } from "@/data/topical-pillars";
