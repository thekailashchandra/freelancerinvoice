import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PillarHubContent } from "@/components/pillar-hub-content";
import { PillarHubSchema } from "@/components/pillar-hub-schema";
import {
  getTopicalPillar,
  pillarSlugs,
} from "@/data/topical-pillars";
import { buildPageMetadata } from "@/data/seo";

type PillarRouteProps = {
  params: Promise<{ pillar: string }>;
};

export async function generateStaticParams() {
  return pillarSlugs.map((pillar) => ({ pillar }));
}

export async function generateMetadata({
  params,
}: PillarRouteProps): Promise<Metadata> {
  const { pillar: pillarSlug } = await params;
  const pillar = getTopicalPillar(pillarSlug);

  if (!pillar) {
    return { title: "Page not found" };
  }

  return buildPageMetadata({
    title: `${pillar.title} | Freelance Finances`,
    description: pillar.description,
    path: `/blog/pillar/${pillar.slug}`,
    keywords: pillar.keywords,
  });
}

export default async function PillarPage({ params }: PillarRouteProps) {
  const { pillar: pillarSlug } = await params;
  const pillar = getTopicalPillar(pillarSlug);

  if (!pillar) {
    notFound();
  }

  return (
    <>
      <PillarHubSchema pillar={pillar} />
      <PillarHubContent pillar={pillar} />
    </>
  );
}
