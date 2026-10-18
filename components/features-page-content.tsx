import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageFaqSection } from "@/components/page-faq-section";
import { productFeatures } from "@/data/features";
import { getPageFaqs } from "@/data/page-faqs";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";

export function FeaturesPageContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-primary">Features</p>
        <h1 className="display-serif mt-2 text-3xl tracking-tight md:text-5xl">
          Everything you need to invoice as a freelancer
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {siteConfig.name} is built for independent contractors who want
          professional billing without spreadsheets, broken templates, or
          overpriced software. Preview for free; export on Cloud or self-host.
        </p>
        <Button size="lg" className="mt-8 gap-2" asChild>
          <Link href="/signup">
            Start invoicing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productFeatures.map((feature) => (
          <article
            key={feature.title}
            className="glass rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <h2 className="font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Invoice templates by profession & region</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Purpose-built guides with FAQs and examples - designers, developers,
          marketers, photographers, video editors, plus GST, USD, and India formats.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {[
            {
              href: "/invoice-generator-for-freelancers",
              label: "Invoice generator for freelancers",
            },
            {
              href: "/gst-invoice-generator-india",
              label: "GST invoice generator (India)",
            },
            {
              href: "/invoice-software-for-designers",
              label: "Invoice software for designers",
            },
            {
              href: "/invoice-template-for-agencies",
              label: "Invoice template for agencies",
            },
            { href: "/invoice-templates", label: "All templates hub" },
            { href: "/invoice-template-for-designers", label: "Designers" },
            { href: "/invoice-template-for-photographers", label: "Photographers" },
            { href: "/invoice-template-for-marketers", label: "Marketers" },
            { href: "/invoice-template-for-developers", label: "Developers" },
            { href: "/invoice-template-for-video-editors", label: "Video editors" },
            { href: "/gst-invoice-template", label: "GST invoice (India)" },
            { href: "/usd-invoice-template", label: "USD invoice" },
            { href: "/invoice-template-india", label: "Invoice template India" },
            {
              href: "/how-to-create-freelance-invoice-in-india",
              label: "How to invoice in India (GST, UPI, TDS)",
            },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-primary hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Compare with alternatives</h2>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {[
            { href: "/vs/freshbooks", label: "vs FreshBooks" },
            { href: "/vs/wave", label: "vs Wave" },
            { href: "/vs/zoho-invoice", label: "vs Zoho Invoice" },
          ].map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PageFaqSection faqItems={getPageFaqs("/features")} />

      <section className="mt-16 rounded-2xl border border-border bg-muted/30 px-6 py-12 text-center md:px-12">
        <h2 className="display-serif text-2xl">Two ways to own it</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Self-host the open-source edition for free, or use our hosted Cloud
          plan for ₹299/month or ₹999/year in India, and $5/month or $19/year
          elsewhere. Build and preview free either way.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/pricing">View pricing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
