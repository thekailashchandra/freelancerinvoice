import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import { PublicBreadcrumbSchema } from "@/components/public-breadcrumb-schema";
import { SchemaGraph } from "@/components/schema-graph";
import { aiGuides } from "@/data/ai-guides";
import { landingPages } from "@/data/landing-pages";
import { templatePages } from "@/data/template-pages";
import { buildPageMetadata } from "@/data/seo";
import { siteConfig } from "@/data/site";
import {
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";
import { Button } from "@/components/ui/button";

const title = "Invoice Templates & Generators for Freelancers";
const description = `Browse free invoice templates and generators for freelancers — by profession, region, GST India, USD, agencies, and designers. ${siteConfig.name}.`;

const hubFaqs = [
  {
    question: "What invoice templates does Invoice for Freelance offer?",
    answer:
      "Templates and guides for designers, developers, marketers, photographers, video editors, GST India, USD international billing, agencies, and general freelancers — all free with PDF export.",
  },
  {
    question: "Are these invoice templates free?",
    answer:
      "Yes. Every template and generator on this page is free with no credit card required.",
  },
  {
    question: "Which template should Indian freelancers use?",
    answer:
      "Use the GST invoice generator for tax invoices, or the India invoice template for INR billing with UPI and bank details.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/invoice-templates",
  keywords: [
    "invoice templates freelancers",
    "free invoice template",
    "GST invoice template India",
    "freelancer invoice generator",
  ],
});

export default function InvoiceTemplatesHubPage() {
  return (
    <>
      <PublicBreadcrumbSchema
        segments={[{ name: "Invoice Templates", path: "/invoice-templates" }]}
      />
      <SchemaGraph
        nodes={[
          buildOrganizationSchema(),
          buildSoftwareApplicationSchema(),
          {
            "@type": "CollectionPage",
            name: title,
            description,
            url: "/invoice-templates",
          },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Templates</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            Invoice templates & generators
          </h1>
          <p className="geo-page-summary mt-4 text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
          <Button size="lg" className="mt-8 gap-2" asChild>
            <Link href="/signup">
              Create your first invoice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <section className="mt-14" aria-labelledby="landing-pages-heading">
          <h2 id="landing-pages-heading" className="text-2xl font-bold">
            Invoice generators
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {landingPages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/${page.slug}`}
                  className="block rounded-2xl border border-border/50 bg-card/50 p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold">{page.h1}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {page.heroSummary.slice(0, 140)}…
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="profession-templates-heading">
          <h2 id="profession-templates-heading" className="text-2xl font-bold">
            By profession & region
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templatePages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/${page.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {page.title.split(" — ")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-2xl font-bold">
            Step-by-step guides
          </h2>
          <ul className="mt-6 space-y-3">
            {aiGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/${guide.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <PageFaqSection faqItems={[...hubFaqs]} />
      </div>
    </>
  );
}
