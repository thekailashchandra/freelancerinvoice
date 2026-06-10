import Link from "next/link";
import { ArrowRight, Heart, Target, Users } from "lucide-react";
import { GeoEntityBlock } from "@/components/geo-entity-block";
import { GeoKeyFacts } from "@/components/geo-key-facts";
import { PageFaqSection } from "@/components/page-faq-section";
import { geoEntity } from "@/data/geo";
import { getPageFaqs } from "@/data/page-faqs";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Built for freelancers",
    description:
      "We focus on solo operators and small teams — designers, developers, writers, consultants, and agencies who need simple, professional invoicing.",
  },
  {
    icon: Heart,
    title: "Free at the core",
    description:
      "Creating invoices, exporting PDFs, and managing history should not require a monthly subscription. Our core product stays free.",
  },
  {
    icon: Users,
    title: "Community supported",
    description:
      "Optional Ko-fi tips from users who find value in the tool help fund hosting, improvements, and ongoing maintenance.",
  },
];

export function AboutPageContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-primary">About</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          About {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {siteConfig.name} is a free invoice generator designed specifically for
          freelancers and independent contractors. We help you create
          professional invoices, export PDFs, track payments, and keep your
          billing organized in the cloud.
        </p>
      </header>

      <div className="mt-10">
        <GeoEntityBlock />
      </div>

      <div className="mt-10">
        <GeoKeyFacts
          extraFacts={[
            {
              term: "Why was Invoice for Freelance built?",
              definition: geoEntity.differentiators.join(" "),
            },
          ]}
        />
      </div>

      <section className="mt-12 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Too many freelancers still rely on Word templates, Google Sheets, or
          generic tools that were never built for solo billing workflows.
          {` `}
          {siteConfig.name} removes that friction with a purpose-built platform:
          live invoice preview, branded PDFs, multi-currency support, and a
          searchable invoice history — all in one place.
        </p>
        <p>
          We believe getting paid should be straightforward. That means clear
          invoices, sensible defaults, and software that stays out of your way
          so you can focus on client work.
        </p>
      </section>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.title}
            className="rounded-2xl border border-border/50 bg-card/50 p-6"
          >
            <value.icon className="h-6 w-6 text-primary" aria-hidden />
            <h2 className="mt-4 font-semibold text-foreground">{value.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/50 bg-card/50 p-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold">Want to learn more?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Read our blog for invoicing tips, or get in touch with questions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/blog">Visit blog</Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/signup">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <PageFaqSection faqItems={getPageFaqs("/about")} />
    </div>
  );
}
