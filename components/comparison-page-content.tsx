import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ComparisonPage } from "@/data/comparisons";
import { getComparisonBySlug } from "@/data/comparisons";
import { PageFaqSection } from "@/components/page-faq-section";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

type ComparisonPageContentProps = {
  page: ComparisonPage;
};

export function ComparisonPageContent({ page }: ComparisonPageContentProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header>
        <p className="text-sm font-medium text-primary">Comparison</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {page.h1}
        </h1>
        <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
          {page.summary}
        </p>
        <Button className="mt-8 gap-2" asChild>
          <Link href="/signup">
            Try {siteConfig.name} free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <section className="mt-14" aria-labelledby="comparison-table-heading">
        <h2 id="comparison-table-heading" className="text-2xl font-bold">
          Feature comparison
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">
              {siteConfig.name} vs {page.competitorName}
            </caption>
            <thead className="border-b border-border/50 bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">{siteConfig.name}</th>
                <th className="px-4 py-3 font-semibold">{page.competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/30 last:border-0"
                >
                  <th className="px-4 py-3 font-medium">{row.feature}</th>
                  <td className="px-4 py-3 text-muted-foreground align-top">
                    {row.us}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground align-top">
                    {row.them}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="why-us-heading">
        <h2 id="why-us-heading" className="text-2xl font-bold">
          When to choose {siteConfig.name}
        </h2>
        <ul className="mt-6 space-y-3">
          {page.whyChooseUs.map((reason) => (
            <li key={reason} className="flex items-start gap-3 text-sm">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden
              />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <PageFaqSection faqItems={page.faqItems} includeSchema={false} />

      {page.relatedComparisons.length > 0 && (
        <nav className="mt-14 border-t border-border/50 pt-10" aria-label="More comparisons">
          <h2 className="text-lg font-semibold">More comparisons</h2>
          <ul className="mt-4 space-y-2">
            {page.relatedComparisons.map((slug) => {
              const related = getComparisonBySlug(slug);
              if (!related) return null;
              return (
                <li key={slug}>
                  <Link
                    href={`/vs/${slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    vs {related.competitorName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </main>
  );
}
