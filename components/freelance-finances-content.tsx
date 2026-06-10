import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import {
  freelanceFinancesFaqs,
  topicalAuthorityHub,
  topicalPillars,
} from "@/data/topical-pillars";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

export function FreelanceFinancesContent() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Topical authority</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          {topicalAuthorityHub.title}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {topicalAuthorityHub.description}
        </p>
        <Button size="lg" className="mt-8 gap-2" asChild>
          <Link href="/signup">
            Free invoice tool
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <section
        className="mt-14"
        aria-labelledby="authority-pillars-heading"
      >
        <h2 id="authority-pillars-heading" className="text-2xl font-bold">
          Three pillars of freelance financial expertise
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {siteConfig.name} builds authority across invoicing operations, client
          management, and tax compliance — not just invoice templates.
        </p>

        <ol className="mt-8 space-y-6">
          {topicalPillars.map((pillar, index) => (
            <li key={pillar.slug}>
              <article className="rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Pillar {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-bold md:text-2xl">
                  <Link
                    href={`/blog/pillar/${pillar.slug}`}
                    className="hover:text-primary"
                  >
                    {pillar.title}
                  </Link>
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pillar.topics.map((topic) => (
                    <li key={topic.slug}>
                      <Link
                        href={`/blog/${topic.articleSlug}`}
                        className="block rounded-xl border border-border/30 p-4 text-sm hover:border-primary/30"
                      >
                        <span className="font-semibold text-foreground">
                          {topic.title}
                        </span>
                        <p className="mt-1 text-muted-foreground">
                          {topic.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/blog/pillar/${pillar.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Explore pillar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <PageFaqSection faqItems={freelanceFinancesFaqs} />

      <nav className="mt-10 text-sm">
        <Link href="/blog" className="text-primary hover:underline">
          Browse all blog articles →
        </Link>
      </nav>
    </main>
  );
}
