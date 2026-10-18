import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import { guideArticles } from "@/data/guides";
import { freelanceInvoicingCluster } from "@/data/hub-clusters";
import { topicalAuthorityHub, topicalPillars } from "@/data/topical-pillars";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/lib/utils";

const blogFaqs = [
  {
    question: "What topics does the Invoice for Freelance blog cover?",
    answer:
      "Freelance finances across three pillars: invoicing and billing operations, client management and legal operations, and tax, compliance, and cross-border currency logistics.",
  },
  {
    question: "Are blog articles free to read?",
    answer: "Yes. All guides and articles are free with no account required.",
  },
] as const;

export function BlogIndexContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Blog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Freelancer finances & billing blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Expert guides from {siteConfig.name} on invoicing operations, client
          contracts, scope management, tax compliance, and cross-border payments
          - not just invoice templates.
        </p>
        <Link
          href="/freelance-finances"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Explore topical authority hub
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <section
        className="mt-12 rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8"
        aria-labelledby="featured-hub-heading"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Featured hub & spoke cluster
        </p>
        <h2 id="featured-hub-heading" className="mt-2 text-2xl font-bold">
          {freelanceInvoicingCluster.title}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {freelanceInvoicingCluster.description}
        </p>
        <Link
          href={`/blog/hub/${freelanceInvoicingCluster.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Read the hub guide
          <ArrowRight className="h-4 w-4" />
        </Link>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {freelanceInvoicingCluster.spokes.map((spoke) => (
            <li key={spoke.slug}>
              <Link
                href={`/blog/${spoke.articleSlug}`}
                className="block rounded-xl border border-border/40 bg-card/60 p-4 text-sm hover:border-primary/30"
              >
                <span className="font-medium text-foreground">{spoke.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="authority-pillars-heading">
        <h2 id="authority-pillars-heading" className="text-2xl font-bold">
          {topicalAuthorityHub.title}: three pillars
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Structural authority across invoicing, client operations, and tax
          compliance.
        </p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {topicalPillars.map((pillar, index) => (
            <li key={pillar.slug}>
              <Link
                href={`/blog/pillar/${pillar.slug}`}
                className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/50 p-5 hover:border-primary/30"
              >
                <span className="text-xs font-semibold uppercase text-primary">
                  Pillar {index + 1}
                </span>
                <span className="mt-2 font-semibold text-foreground">
                  {pillar.title}
                </span>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {pillar.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View pillar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {guideArticles.map((article) => (
          <article
            key={article.slug}
            className="glass flex flex-col rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {article.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug">
              <Link
                href={`/blog/${article.slug}`}
                className="hover:text-primary"
              >
                {article.title}
              </Link>
            </h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
              {article.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {article.readingTimeMinutes} min read
              </span>
            </div>
            <Link
              href={`/blog/${article.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>

      <PageFaqSection faqItems={[...blogFaqs]} />
    </div>
  );
}

