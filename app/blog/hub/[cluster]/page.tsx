import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubClusterContent } from "@/components/hub-cluster-content";
import { HubClusterSchema } from "@/components/hub-cluster-schema";
import {
  getHubCluster,
  hubClusterSlugs,
} from "@/data/hub-clusters";
import { buildPageMetadata } from "@/data/seo";

type HubClusterRouteProps = {
  params: Promise<{ cluster: string }>;
};

export async function generateStaticParams() {
  return hubClusterSlugs.map((cluster) => ({ cluster }));
}

export async function generateMetadata({
  params,
}: HubClusterRouteProps): Promise<Metadata> {
  const { cluster: clusterSlug } = await params;
  const cluster = getHubCluster(clusterSlug);

  if (!cluster) {
    return { title: "Page not found" };
  }

  return buildPageMetadata({
    title: cluster.title,
    description: cluster.description,
    path: `/blog/hub/${cluster.slug}`,
    keywords: cluster.keywords,
    type: "article",
  });
}

export default async function HubClusterPage({ params }: HubClusterRouteProps) {
  const { cluster: clusterSlug } = await params;
  const cluster = getHubCluster(clusterSlug);

  if (!cluster) {
    notFound();
  }

  return (
    <>
      <HubClusterSchema cluster={cluster} />
      <HubClusterContent cluster={cluster} />
    </>
  );
}
