"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMarketContext } from "@/hooks/use-market-context";
import { CrossBorderComparisonTable } from "@/components/cross-border-comparison-table";
import { GeoDirectAnswer } from "@/components/geo-direct-answer";
import { ConversionLandingHero } from "@/components/conversion-landing-hero";
import { LandingWorkflowSteps } from "@/components/landing-workflow-steps";
import {
  globalWireFormatComparison,
  indiaCrossBorderPayoutComparison,
} from "@/data/cross-border-comparisons";
import type { SeoLandingPage } from "@/data/landing-pages";
import { getGeoDirectAnswer } from "@/data/geo-direct-answers";
import {
  getLandingPageBySlug,
  getRelatedLandingPages,
} from "@/data/landing-pages";
import { PageFaqSection } from "@/components/page-faq-section";
import { Skeleton } from "@/components/ui/skeleton";

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

type SeoLandingPageContentProps = {
  page: SeoLandingPage;
};

export function SeoLandingPageContent({ page }: SeoLandingPageContentProps) {
  const marketContext = useMarketContext(
    page.market === "IN" ? { market: "IN", countryCode: "IN", currencyCode: "INR" } : undefined
  );
  const related = getRelatedLandingPages(page);
  const directAnswer = getGeoDirectAnswer(page.slug);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12 xl:max-w-[1600px]">
      <p className="text-center text-sm font-medium text-primary">
        {page.category}
      </p>

      <ConversionLandingHero
        title={page.h1}
        summary={page.heroSummary}
        badge="No signup required to build & download PDFs"
      />

      {directAnswer ? <GeoDirectAnswer answer={directAnswer} /> : null}

      <section className="mt-8" aria-label="Interactive invoice builder">
        <LandingInteractiveWorkspace
          key={marketContext.countryCode}
          initialCountryCode={marketContext.countryCode}
        />
      </section>

      <LandingWorkflowSteps />

      {page.market === "IN" ? (
        <section className="mt-14" aria-labelledby="payout-comparison-heading">
          <h2 id="payout-comparison-heading" className="text-2xl font-bold">
            Payout channels & tax withholding (India)
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Compare Wise, PayPal, SWIFT, and domestic UPI rails - fees, speed, and
            TDS/Form 16A implications for independent contractors.
          </p>
          <CrossBorderComparisonTable rows={indiaCrossBorderPayoutComparison} />
        </section>
      ) : null}

      {page.slug === "global-freelance-invoicing-compliance" ? (
        <section className="mt-14" aria-labelledby="wire-format-heading">
          <h2 id="wire-format-heading" className="text-2xl font-bold">
            International wire & banking layouts
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Match payment fields to each client&apos;s corridor - routing numbers,
            IBAN, sort codes, and compliance documentation.
          </p>
          <div className="ai-content-table mt-4 overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">{globalWireFormatComparison.caption}</caption>
              <thead className="border-b border-border/50 bg-muted/50">
                <tr>
                  {globalWireFormatComparison.headers.map((header) => (
                    <th key={header} className="px-4 py-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {globalWireFormatComparison.rows.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-border/30 last:border-0"
                  >
                    {row.map((cell) => (
                      <td
                        key={cell.slice(0, 24)}
                        className="px-4 py-3 text-muted-foreground align-top"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <PageFaqSection faqItems={page.faqItems} includeSchema={false} />

      {related.length > 0 && (
        <nav
          className="mt-14 border-t border-border/50 pt-10"
          aria-label="Related pages"
        >
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
