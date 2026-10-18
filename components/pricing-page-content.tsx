import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cloud,
  Github,
  Server,
  ShieldCheck,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import {
  CLOUD_PLAN_FEATURES,
  getSubscriptionPriceOptions,
  isSelfHostedMode,
} from "@/lib/subscription";

const SELF_HOST_FEATURES = [
  "Everything in Cloud",
  "No subscription, ever",
  "No seat or invoice limits",
  "Your database and storage",
  "Deploy with Node or Vercel",
  "MIT licensed source",
] as const;

const PREVIEW_FEATURES = [
  "Create and edit invoices",
  "Every template, previewable",
  "Client and payment details",
  "Live invoice preview",
  "Save drafts to the cloud",
] as const;

const COMPARISON = [
  { label: "Create and edit invoices", preview: true, cloud: true, self: true },
  { label: "PDF download", preview: false, cloud: true, self: true },
  { label: "Print invoices", preview: false, cloud: true, self: true },
  { label: "Payment receipts", preview: false, cloud: true, self: true },
  { label: "Every invoice template", preview: true, cloud: true, self: true },
  { label: "Brand color customization", preview: true, cloud: true, self: true },
  { label: "Cloud invoice history", preview: true, cloud: true, self: true },
  { label: "Remove invoice branding", preview: false, cloud: true, self: true },
  { label: "Cloud access pass", preview: false, cloud: true, self: false },
] as const;

export function PricingPageContent() {
  const selfHosted = isSelfHostedMode();
  const india = getSubscriptionPriceOptions("IN");
  const global = getSubscriptionPriceOptions("GLOBAL");

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:px-8 md:py-20 lg:px-10">
      <header className="max-w-2xl">
        <p className="eyebrow text-muted-foreground">Pricing</p>
        <h1 className="display-serif mt-4 text-4xl leading-[1.02] sm:text-5xl">
          One invoice tool.
          <br />
          Two honest ways to own it.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          The source is open. Host it yourself for free, or use our Cloud and pay
          a small monthly fee for the convenience. No feature roulette, no
          surprise upgrades.
        </p>
      </header>

      {selfHosted ? (
        <div className="mt-10 rounded-2xl border border-foreground bg-foreground p-6 text-background sm:p-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <p className="eyebrow text-[9px] text-background/60">
              Self-hosted deployment
            </p>
          </div>
          <h2 className="display-serif mt-3 text-3xl">
            Everything is unlocked.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-background/65">
            This installation runs in self-hosted mode. PDF export, printing,
            every template, and cloud history are free with no subscription and
            no limits.
          </p>
          <Button
            asChild
            className="mt-6 bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/signup">
              Create an account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {/* Cloud */}
          <article className="relative flex flex-col rounded-2xl border border-foreground bg-foreground p-7 text-background sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" aria-hidden />
                  <h2 className="text-lg font-medium">Cloud</h2>
                </div>
                <p className="mt-2 text-sm text-background/65">
                  Our hosted workspace. Nothing to install, always current.
                </p>
              </div>
              <span className="rounded-full border border-background/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-background/80">
                Recommended
              </span>
            </div>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-background/15 bg-background/[0.04] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-background/55">
                    Monthly
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="display-serif text-4xl leading-none">
                    {india.monthly.displayAmount}
                  </span>
                  <span className="text-xs text-background/55">
                    {india.monthly.intervalLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] text-background/45">
                  30 days of access
                </p>
              </div>

              <div className="rounded-xl border border-background/30 bg-background/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-background/55">
                    Yearly
                  </span>
                  <span className="rounded-full bg-background px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-foreground">
                    Save 72%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="display-serif text-4xl leading-none">
                    {india.yearly.displayAmount}
                  </span>
                  <span className="text-xs text-background/55">
                    {india.yearly.intervalLabel}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] text-background/45">
                  {india.yearly.monthlyEquivalent} · 365 days of access
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-background/50">
              India pricing. Outside India: {global.monthly.displayAmount}
              {global.monthly.intervalLabel} or {global.yearly.displayAmount}
              {global.yearly.intervalLabel}.
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {CLOUD_PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className="mt-8 w-full bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/signup">
                Start with a free preview
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-background/45">
              Build and preview free. Export when you subscribe. One payment
              covers 30 or 365 days - no automatic renewal.
            </p>
          </article>

          {/* Self-hosted */}
          <article className="flex flex-col rounded-2xl border border-border bg-card p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" aria-hidden />
                  <h2 className="text-lg font-medium">Self-hosted</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Run the same product on infrastructure you control.
                </p>
              </div>
              <span className="whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Open source
              </span>
            </div>

            <div className="mt-8 flex items-baseline gap-2">
              <span className="display-serif text-5xl leading-none">Free</span>
              <span className="text-sm text-muted-foreground">forever</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              MIT licensed · bring your own Supabase project
            </p>

            <ul className="mt-7 flex-1 space-y-3 text-sm">
              {SELF_HOST_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" variant="outline" className="mt-8 w-full">
              {siteConfig.githubUrl ? (
                <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  View the source
                </a>
              ) : (
                <Link href="/self-host">
                  <Server className="h-4 w-4" />
                  Self-hosting guide
                </Link>
              )}
            </Button>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground">
              No license fee. You pay only for your own hosting and database.
            </p>
          </article>
        </div>
      )}

      {!selfHosted ? (
        <section className="mt-12 rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Free preview, by design
              </p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                You can build invoices, pick templates, and see the live document
                before paying. Only the finished output - PDF, print, and
                receipts - sits behind the Cloud plan.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/signup">Create a free account</Link>
            </Button>
          </div>
          <ul className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            {PREVIEW_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-foreground" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!selfHosted ? (
        <section className="mt-16" aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="display-serif text-3xl">
            What is included
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-3 pl-4 pr-4 text-left text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Feature
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Preview
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Cloud
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Self-host
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th className="py-3 pl-4 pr-4 text-left text-sm font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    {[row.preview, row.cloud, row.self].map((value, index) => (
                      <td key={index} className="px-3 py-3 text-center">
                        {value ? (
                          <Check className="mx-auto h-4 w-4" aria-label="Included" />
                        ) : (
                          <span
                            className="text-muted-foreground/50"
                            aria-label="Not included"
                          >
                            -
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section
        className="mt-16 grid gap-6 border-t border-border pt-10 sm:grid-cols-3"
        aria-label="Pricing questions"
      >
        {[
          {
            q: "Why charge for Cloud?",
            a: "Hosting, payments, backups, and support cost real money. The subscription keeps the hosted product sustainable without ads or selling data.",
          },
          {
            q: "Can I cancel?",
            a: "Yes. Cloud is a 30-day pass per payment, not an auto-renewing mandate. Access runs to the end of the paid period.",
          },
          {
            q: "Is the self-hosted version limited?",
            a: "No. Self-hosting is the same codebase with billing disabled. Every feature is available with no invoice, client, or seat limits.",
          },
        ].map((item) => (
          <div key={item.q}>
            <h3 className="text-sm font-medium">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
