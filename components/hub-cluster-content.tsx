import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { HubCluster } from "@/data/hub-clusters";
import { getGuideBySlug } from "@/data/guides";
import { topicalAuthorityHub } from "@/data/topical-pillars";
import { HubClusterSpokeNav } from "@/components/hub-cluster-spoke-nav";
import { PageFaqSection } from "@/components/page-faq-section";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HubClusterContentProps = {
  cluster: HubCluster;
};

export function HubClusterContent({ cluster }: HubClusterContentProps) {
  const hubArticle = getGuideBySlug(cluster.hubArticleSlug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/freelance-finances" className="hover:underline">
          {topicalAuthorityHub.title}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Hub guide</span>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-primary">Pillar hub guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {cluster.title}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {cluster.description}
        </p>
        {hubArticle && (
          <p className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={hubArticle.publishedAt}>
              {formatDate(hubArticle.publishedAt)}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              {hubArticle.readingTimeMinutes} min read
            </span>
          </p>
        )}
      </header>

      <div className="mt-10">
        <HubClusterSpokeNav cluster={cluster} variant="hub" />
      </div>

      {hubArticle && (
        <div className="mt-12 space-y-10">
          {hubArticle.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground leading-relaxed">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                  {section.note}
                </p>
              )}
            </section>
          ))}
        </div>
      )}

      <section className="mt-14" aria-labelledby="spoke-deep-dives-heading">
        <h2 id="spoke-deep-dives-heading" className="text-xl font-bold">
          Deep-dive spoke guides
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {cluster.spokes.map((spoke) => (
            <li key={spoke.slug}>
              <Link
                href={`/blog/${spoke.articleSlug}`}
                className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/50 p-5 hover:border-primary/30"
              >
                <h3 className="font-semibold leading-snug">{spoke.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {spoke.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read guide
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <h2 className="text-xl font-semibold">Invoice professionally — free</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Put this guide into practice with {siteConfig.name} — live preview, PDF
          export, and payment tracking.
        </p>
        <Button className="mt-5 gap-2" asChild>
          <Link href="/signup">
            Create your first invoice
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <PageFaqSection faqItems={cluster.faqItems} />

      <nav className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/blog" className="text-primary hover:underline">
          ← All blog articles
        </Link>
        <Link
          href={`/blog/${cluster.hubArticleSlug}`}
          className="text-muted-foreground hover:underline"
        >
          Permalink to this guide
        </Link>
      </nav>
    </main>
  );
}
