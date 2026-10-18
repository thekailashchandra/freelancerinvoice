import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CrossBorderComparisonTable } from "@/components/cross-border-comparison-table";
import { ConversionLandingHero } from "@/components/conversion-landing-hero";
import { GeoDirectAnswer } from "@/components/geo-direct-answer";
import { LandingWorkflowSteps } from "@/components/landing-workflow-steps";
import { PageFaqSection } from "@/components/page-faq-section";
import { indiaCrossBorderPayoutComparison } from "@/data/cross-border-comparisons";
import { indiaMarketHero, indiaMarketLandingPaths } from "@/data/geo-markets";
import { getGeoDirectAnswer } from "@/data/geo-direct-answers";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

const indiaHubFaqs = [
  {
    question: "What makes an invoice GST-compliant for Indian contractors?",
    answer:
      "A GST tax invoice includes your GSTIN, client details, invoice number, SAC code, taxable value, GST rate, and CGST/SGST or IGST breakdown. Export invoices add LUT/FIRC references when billing foreign clients.",
  },
  {
    question: "How should Indian freelancers receive payment from US clients?",
    answer:
      "Wise and SWIFT wires are common for USD payments. Compare FX margins and receiving bank fees. Keep FIRC documentation for foreign remittance and report income in your ITR.",
  },
  {
    question: "Is TDS deducted on contractor invoices in India?",
    answer:
      "Clients often deduct TDS under Section 194J (typically 10% on professional fees). Show gross amounts on your invoice and collect Form 16A from the client for tax filing.",
  },
];

type IndiaMarketHubContentProps = {
  workspace: ReactNode;
};

export function IndiaMarketHubContent({ workspace }: IndiaMarketHubContentProps) {
  const directAnswer = getGeoDirectAnswer("gst-invoice-generator-india");

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12 xl:max-w-[1600px]">
      <ConversionLandingHero
        badge={indiaMarketHero.badge}
        title={indiaMarketHero.title}
        summary={indiaMarketHero.summary}
      />

      {directAnswer ? <GeoDirectAnswer answer={directAnswer} /> : null}

      <section className="mt-8" aria-label="Interactive GST invoice builder">
        {workspace}
      </section>

      <LandingWorkflowSteps
        heading="Three steps to a GST-compliant contractor invoice"
        subheading="Fill SAC-coded line items, preview CGST/SGST or IGST lines, and export your PDF on Cloud."
      />

      <section className="mt-14" aria-labelledby="india-paths-heading">
        <h2 id="india-paths-heading" className="text-2xl font-bold">
          GST & contractor invoicing paths
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {indiaMarketLandingPaths.map((path) => (
            <li key={path.href}>
              <Link
                href={path.href}
                className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/50 p-5 hover:border-primary/30"
              >
                <h3 className="font-semibold">{path.label}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {path.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="payout-comparison-heading">
        <h2 id="payout-comparison-heading" className="text-2xl font-bold">
          Cross-border payout channels for Indian freelancers
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Compare local and international payout rails - conversion fees, speed,
          and tax withholding declarations before you choose how US and EU clients
          pay you.
        </p>
        <CrossBorderComparisonTable rows={indiaCrossBorderPayoutComparison} />
      </section>

      <PageFaqSection
        faqItems={indiaHubFaqs}
        heading="India invoicing FAQ"
        includeSchema
      />

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          {siteConfig.name} - built for Indian independent contractors and global
          freelancers alike.
        </p>
        <Button className="mt-4 gap-2" asChild>
          <Link href="/">
            Global homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
