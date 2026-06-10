import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { SeoLandingPage } from "@/data/landing-pages";
import {
  getLandingPageBySlug,
  getRelatedLandingPages,
} from "@/data/landing-pages";
import { PageFaqSection } from "@/components/page-faq-section";
import { Button } from "@/components/ui/button";

type SeoLandingPageContentProps = {
  page: SeoLandingPage;
};

export function SeoLandingPageContent({ page }: SeoLandingPageContentProps) {
  const related = getRelatedLandingPages(page);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header>
        <p className="text-sm font-medium text-primary">{page.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          {page.h1}
        </h1>
        <p className="geo-page-summary seo-hero-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {page.heroSummary}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild className="gap-2">
            <Link href="/signup">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/features">See all features</Link>
          </Button>
        </div>
      </header>

      <section className="mt-14" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="text-2xl font-bold">
          Why freelancers choose us
        </h2>
        <ul className="mt-6 space-y-3">
          {page.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-bold">
          Key features
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {page.features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="usecases-heading">
        <h2 id="usecases-heading" className="text-2xl font-bold">
          Use cases
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {page.useCases.map((useCase) => (
            <li key={useCase}>{useCase}</li>
          ))}
        </ul>
      </section>

      <PageFaqSection faqItems={page.faqItems} />

      {related.length > 0 && (
        <nav className="mt-14 border-t border-border/50 pt-10" aria-label="Related pages">
          <h2 className="text-lg font-semibold">Related pages</h2>
          <ul className="mt-4 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {item.h1}
                </Link>
              </li>
            ))}
            {page.relatedSlugs
              .filter((slug) => !getLandingPageBySlug(slug))
              .map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}

      <nav className="mt-8 flex flex-wrap gap-4 text-sm">
        {page.relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
