import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Printer,
  Sparkles,
} from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import { PricingTrustSection } from "@/components/pricing-trust-section";
import { getPageFaqs } from "@/data/page-faqs";
import { siteConfig } from "@/data/site";
import { SupportTipLink } from "@/components/support-tip-link";
import { Button, buttonVariants } from "@/components/ui/button";
import { invoiceTemplates } from "@/lib/invoice-templates";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "Unlimited freelancer invoices",
  "Live invoice preview with your branding",
  "Classic template — PDF export and print at no charge",
  "Cloud-backed invoice history",
  "Payment status tracking",
  "Multi-currency and country-specific payment fields",
  "Logo and signature on invoices",
  "GST support for Indian freelancers",
];

const premiumTemplateNames = invoiceTemplates
  .filter((template) => template.isPremium)
  .map((template) => template.name);

export function PricingPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header className="text-center">
        <p className="text-sm font-medium text-primary">Simple pricing</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Free for freelancers
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          {siteConfig.name} costs nothing for everyday invoicing. Optional
          one-time purchases unlock premium templates for PDF export and print.
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-lg">
        <div className="glass rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center shadow-lg">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Core product
          </p>
          <p className="mt-3 text-5xl font-bold tracking-tight">
            $0
            <span className="text-lg font-normal text-muted-foreground">
              /month
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            No subscription. No credit card required to start.
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-8 w-full gap-2" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <section className="mt-12 rounded-2xl border border-border/50 bg-card/50 p-8 md:p-10">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="text-2xl font-bold">Optional paid templates</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              Three premium invoice layouts —{" "}
              <strong className="font-medium text-foreground">
                {premiumTemplateNames.join(", ")}
              </strong>{" "}
              — are available as a <strong className="font-medium text-foreground">one-time</strong>{" "}
              unlock when payments are enabled in your region:
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background/60 p-5">
            <p className="text-sm font-medium text-muted-foreground">
              International
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">$1</p>
            <p className="mt-1 text-sm text-muted-foreground">one-time per template</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-5">
            <p className="text-sm font-medium text-muted-foreground">India</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">₹99</p>
            <p className="mt-1 text-sm text-muted-foreground">one-time per template</p>
          </div>
        </div>

        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              Preview any template for free. Payment is only required to{" "}
              <strong className="font-medium text-foreground">download the PDF</strong>{" "}
              or <strong className="font-medium text-foreground">print</strong> using a
              premium layout.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Printer
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              The free <strong className="font-medium text-foreground">Classic</strong>{" "}
              template can always be exported and printed at no charge — even if you
              were previewing a premium design.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              Unlocks are one-time, per template, and verified automatically via
              Razorpay when checkout is available.
            </span>
          </li>
        </ul>

        <p className="mt-6 text-xs text-muted-foreground">
          Template payments are optional. You can invoice professionally on the
          free Classic layout without ever paying.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-border/50 bg-card/50 p-8 text-center md:p-10">
        <Heart className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">Support this platform</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground leading-relaxed">
          {siteConfig.name} is built and maintained as a free tool for
          independent contractors. You can also support ongoing development with
          a voluntary tip on Ko-fi — from $1 internationally or ₹99 in India.
          Contributors can remove the small &ldquo;Powered by&rdquo; footer from
          their invoices.
        </p>
        <SupportTipLink
          showIcon={false}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 no-underline hover:no-underline"
          )}
        >
          Tip on Ko-fi
        </SupportTipLink>
        <p className="mt-4 text-xs text-muted-foreground">
          Ko-fi tips are separate from premium template unlocks. Tips do not
          replace the template payment when exporting or printing premium layouts.
        </p>
      </section>

      <PageFaqSection faqItems={getPageFaqs("/pricing")} />

      <PricingTrustSection />
    </div>
  );
}
