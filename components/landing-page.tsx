import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Download,
  FileText,
  Globe,
  History,
  Receipt,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { faqItems } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Professional freelancer invoices",
    description:
      "Build polished invoices for freelance work with live preview, your logo, itemized line items, and one-click PDF export.",
  },
  {
    icon: Cloud,
    title: "Cloud-backed invoice storage",
    description:
      "Every invoice for freelancers is saved securely in the cloud — access your billing history from any device.",
  },
  {
    icon: History,
    title: "Invoice history & filters",
    description:
      "Track paid, pending, and overdue freelance invoices with search and status filters built for busy contractors.",
  },
  {
    icon: Shield,
    title: "Secure, isolated accounts",
    description:
      "Row-level security keeps every freelancer account private. Your clients and invoices stay yours alone.",
  },
  {
    icon: Download,
    title: "PDF export",
    description:
      "Download a client-ready PDF invoice for freelancers in seconds — no manual formatting in Word or Excel.",
  },
  {
    icon: Globe,
    title: "Multi-currency billing",
    description:
      "Invoice international clients with the right currency and country-specific payment fields on every bill.",
  },
];

const steps = [
  {
    step: "1",
    title: "Create your free account",
    description:
      "Sign up in under a minute. Add your freelance business name, logo, and default payment details once.",
  },
  {
    step: "2",
    title: "Build your invoice",
    description:
      "Enter client info, services, rates, and due dates. Watch your freelancer invoice update in real time.",
  },
  {
    step: "3",
    title: "Send & get paid",
    description:
      "Export a professional PDF, email it to your client, and track payment status from your dashboard.",
  },
];

const benefits = [
  "Free invoice generator designed specifically for freelancers",
  "No spreadsheets, no broken Word templates, no design headaches",
  "Branded PDF invoices that look professional to every client",
  "Cloud sync so you never lose a freelance invoice again",
  "Payment tracking for paid, pending, and overdue bills",
  "Works for designers, developers, writers, consultants, and agencies",
];

const useCases = [
  {
    title: "Project-based freelance work",
    body: "Bill clients for fixed-scope deliverables — websites, branding packages, copywriting projects, or consulting engagements — with clear line items and totals.",
  },
  {
    title: "Hourly & retainer billing",
    body: "Invoice for freelance hours or monthly retainers with descriptive line items so clients understand exactly what they are paying for.",
  },
  {
    title: "International clients",
    body: "Send invoices for freelance services worldwide with configurable currency and payment details that match how you actually get paid.",
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <SiteLogo variant="full" href="/" priority />
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        {/* Hero */}
        <section className="py-16 text-center md:py-24" aria-labelledby="hero-heading">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            Built for freelancers & agencies
          </div>
          <h1
            id="hero-heading"
            className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl"
          >
            Free{" "}
            <span className="gradient-text">Invoice for Freelancers</span>{" "}
            — Professional Billing in Minutes
          </h1>
          <p className="seo-hero-summary mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
            {siteConfig.name} is the fastest way to create an invoice for freelance
            work. Generate beautiful PDF invoices, track payments, and manage your
            entire freelance billing workflow in one cloud-backed platform — no
            spreadsheets, no messy templates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/signup">
                Create your first freelancer invoice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to start · PDF export · Cloud invoice history
          </p>
        </section>

        {/* Features */}
        <section
          className="py-12"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="mb-3 text-center text-3xl font-bold">
            Everything freelancers need to invoice clients
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            From your first freelance gig to a full client roster, our invoice
            generator keeps billing simple, professional, and organized.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="glass rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* What is invoice for freelancers */}
        <section
          className="py-12"
          aria-labelledby="about-heading"
        >
          <div className="glass rounded-2xl border border-border/50 p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="hidden rounded-xl bg-primary/10 p-3 sm:block">
                <Receipt className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <div>
                <h2 id="about-heading" className="text-2xl font-bold md:text-3xl">
                  What is an invoice for freelancers?
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  An <strong>invoice for freelancers</strong> is the document you send
                  after completing work to request payment from a client. Unlike
                  employees who receive paychecks, freelancers and independent
                  contractors must bill for each project, hour, or retainer period.
                  A professional freelancer invoice lists who you are, who the client is,
                  what you delivered, how much they owe, and when payment is due.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Many freelancers still wrestle with Word templates, Google Sheets, or
                  generic invoicing tools that were not built for solo operators.
                  {` `}
                  {siteConfig.name} removes that friction: you get a purpose-built
                  <strong> invoice for freelance</strong> workflow with live preview,
                  branded PDFs, and a searchable history of every bill you have ever sent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-3 text-center text-3xl font-bold">
            How to create an invoice for freelance work
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Three steps from signup to a client-ready PDF — most freelancers finish
            their first invoice in under five minutes.
          </p>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.step}
                className="glass rounded-2xl border border-border/50 p-6"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Benefits */}
        <section className="py-12" aria-labelledby="benefits-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="benefits-heading" className="text-3xl font-bold">
                Why freelancers choose {siteConfig.name}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Whether you are a designer, developer, writer, marketer, or consultant,
                getting paid on time starts with a clear, professional invoice. Our
                free <strong>freelancer invoice generator</strong> helps you look
                credible, stay organized, and spend less time on admin.
              </p>
              <Button className="mt-6 gap-2" asChild>
                <Link href="/signup">
                  Start invoicing for free
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-12" aria-labelledby="usecases-heading">
          <h2 id="usecases-heading" className="mb-10 text-center text-3xl font-bold">
            Built for every type of freelance billing
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((uc) => (
              <article
                key={uc.title}
                className="rounded-2xl border border-border/50 bg-card/50 p-6"
              >
                <h3 className="font-semibold">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {uc.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-3 text-center text-3xl font-bold">
            Frequently asked questions about freelancer invoices
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            Answers to common questions about creating an invoice for freelancers,
            PDF export, security, and getting paid faster.
          </p>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group glass rounded-xl border border-border/50 p-5"
              >
                <summary className="cursor-pointer list-none font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="faq-answer mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-12 text-center"
          aria-labelledby="cta-heading"
        >
          <div className="glass rounded-2xl border border-primary/20 bg-primary/5 px-6 py-12 md:px-12">
            <h2 id="cta-heading" className="text-3xl font-bold">
              Ready to create your invoice for freelancers?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of freelancers who bill professionally with{" "}
              {siteConfig.name}. Free account, instant PDF export, cloud-backed
              invoice history.
            </p>
            <Button size="lg" className="mt-8 gap-2 px-8" asChild>
              <Link href="/signup">
                Get started — it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground md:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            <a href={siteConfig.url} className="text-foreground hover:underline">
              {siteConfig.name}
            </a>
            {" · "}
            Free invoice generator for freelancers
          </p>
          <nav className="mt-4 flex flex-wrap items-center justify-center gap-4" aria-label="Footer">
            <Link href="/signup" className="hover:text-foreground hover:underline">
              Sign up
            </Link>
            <Link href="/login" className="hover:text-foreground hover:underline">
              Sign in
            </Link>
            <a
              href={`${siteConfig.url}/sitemap.xml`}
              className="hover:text-foreground hover:underline"
            >
              Sitemap
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
