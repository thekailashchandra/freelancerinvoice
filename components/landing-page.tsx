import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { guideArticles } from "@/data/guides";
import { geoAuthoritativeAnswers } from "@/data/geo";
import { faqItems } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { ConversionLandingHero } from "@/components/conversion-landing-hero";
import { GeoKeyFacts } from "@/components/geo-key-facts";
import type { MarketContext } from "@/lib/geo-market";
import {
  getMarketLandingPaths,
  globalMarketHero,
  indiaMarketHero,
} from "@/data/geo-markets";
import { LandingWorkflowSteps } from "@/components/landing-workflow-steps";
import { PageFaqSection } from "@/components/page-faq-section";
import { PublicSiteFooter } from "@/components/public-site-footer";
import { PublicSiteHeader } from "@/components/public-site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const LandingInteractiveWorkspace = dynamic(
  () =>
    import("@/components/landing-interactive-workspace").then((m) => ({
      default: m.LandingInteractiveWorkspace,
    })),
  {
    loading: () => (
      <Skeleton className="min-h-[640px] w-full rounded-2xl" aria-hidden />
    ),
  }
);

const featuredGuides = guideArticles.slice(0, 3);
const allFaqItems = [...faqItems, ...geoAuthoritativeAnswers];

type LandingPageProps = {
  marketContext: MarketContext;
};

export function LandingPage({ marketContext }: LandingPageProps) {
  const isIndia = marketContext.market === "IN";
  const hero = isIndia ? indiaMarketHero : globalMarketHero;
  const marketPaths = getMarketLandingPaths(marketContext.market);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      </div>

      <PublicSiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <ConversionLandingHero
          badge={hero.badge}
          title={
            isIndia ? (
              hero.title
            ) : (
              <>
                Free{" "}
                <span className="gradient-text">Invoice for Freelancers</span>
                {" — "}Start Invoicing Now
              </>
            )
          }
          summary={hero.summary}
        />

        <section aria-label="Interactive invoice builder">
          <LandingInteractiveWorkspace
            initialCountryCode={marketContext.countryCode}
          />
        </section>

        <section className="py-10" aria-labelledby="market-paths-heading">
          <h2 id="market-paths-heading" className="text-center text-xl font-bold">
            {isIndia ? "India invoicing resources" : "Global compliance resources"}
          </h2>
          <ul className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2">
            {marketPaths.slice(0, 4).map((path) => (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="block rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm hover:border-primary/30"
                >
                  <span className="font-medium">{path.label}</span>
                  <span className="mt-1 block text-muted-foreground">
                    {path.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <LandingWorkflowSteps />

        <PageFaqSection
          faqItems={allFaqItems}
          heading="Frequently asked questions about freelancer invoices"
          includeSchema
        />

        <section className="py-12" aria-label="Product summary">
          <GeoKeyFacts />
        </section>

        <section className="py-12" aria-labelledby="guide-heading">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="guide-heading" className="text-2xl font-bold">
                Freelancer billing guides
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Payment terms, international invoicing, and getting paid on time.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/guide">
                View all guides
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredGuides.map((article) => (
              <article
                key={article.slug}
                className="rounded-2xl border border-border/50 bg-card/50 p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {article.category}
                </p>
                <h3 className="mt-2 font-semibold leading-snug">
                  <Link
                    href={`/guide/${article.slug}`}
                    className="hover:text-primary"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {article.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readingTimeMinutes} min read
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 text-center" aria-labelledby="cta-heading">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10">
            <h2 id="cta-heading" className="text-2xl font-bold">
              Want cloud history and payment tracking?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Keep using the free editor above, or create an account to save every
              invoice and track paid vs overdue bills.
            </p>
            <Button size="lg" className="mt-6 gap-2" asChild>
              <Link href="/signup">
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
