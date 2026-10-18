"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Check,
  Cloud,
  FileText,
  Github,
  History,
  Server,
  type LucideIcon,
} from "lucide-react";
import { faqItems } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { useTranslation } from "@/components/locale-provider";
import { LandingHero } from "@/components/landing-hero";
import { PublicSiteFooter } from "@/components/public-site-footer";
import { PublicSiteHeader } from "@/components/public-site-header";
import { Button } from "@/components/ui/button";
import { formatMessage } from "@/lib/i18n/format-message";

/** Keep the home page calm - show a short feature set and a small FAQ. */
const FEATURE_IDS = ["f1", "f2", "f3"] as const;
const FEATURE_ICONS: Record<(typeof FEATURE_IDS)[number], LucideIcon> = {
  f1: FileText,
  f2: Cloud,
  f3: History,
};

const STEP_IDS = ["s1", "s2", "s3"] as const;
const VISIBLE_FAQ_COUNT = 5;

const PLANS = [
  {
    id: "cloud",
    name: "Cloud",
    price: "₹299",
    suffix: "/month",
    note: "or ₹999/year · $5/month or $19/year outside India",
    description: "Our hosted workspace. Nothing to install, always current.",
    features: [
      "Unlimited invoices",
      "PDF download & print",
      "Every invoice template",
      "Cloud history & client book",
      "Payment status tracking",
    ],
    cta: "Start on Cloud",
    href: "/signup",
    featured: true,
  },
  {
    id: "self-host",
    name: "Self-hosted",
    price: "Free",
    suffix: "forever",
    note: "MIT licensed · your server",
    description: "Run the same product on infrastructure you control.",
    features: [
      "Every feature unlocked",
      "No subscription or seat limits",
      "Your database, your data",
      "Deploy with Node or Vercel",
      "Community support",
    ],
    cta: "View source",
    href: siteConfig.githubUrl || "/self-host",
    featured: false,
  },
] as const;

export function LandingPage() {
  const { t } = useTranslation();
  const name = siteConfig.name;

  const features = useMemo(
    () =>
      FEATURE_IDS.map((id) => ({
        id,
        icon: FEATURE_ICONS[id],
        title: t(`landing.features.${id}.title`),
        description: t(`landing.features.${id}.description`),
      })),
    [t]
  );

  const steps = useMemo(
    () =>
      STEP_IDS.map((id, index) => ({
        step: String(index + 1).padStart(2, "0"),
        title: t(`landing.steps.${id}.title`),
        description: t(`landing.steps.${id}.description`),
      })),
    [t]
  );

  const visibleFaqs = faqItems.slice(0, VISIBLE_FAQ_COUNT);

  return (
    <div className="relative min-h-screen bg-background">
      <PublicSiteHeader />

      <main className="mx-auto w-full max-w-6xl overflow-x-clip px-6 pb-20 lg:px-10">
        <LandingHero />

        {/* How it works */}
        <section
          className="border-t border-border py-20"
          aria-labelledby="how-heading"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">The workflow</p>
              <h2
                id="how-heading"
                className="display-serif mt-3 max-w-xl text-3xl leading-tight sm:text-4xl"
              >
                {t("landing.steps.title")}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("landing.steps.subtitle")}
            </p>
          </div>

          <ol className="mt-12 grid border-t border-border md:grid-cols-3">
            {steps.map((s, index) => (
              <li
                key={s.step}
                className="group relative border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {s.step}
                </span>
                <h3 className="mt-5 text-lg font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-10 hidden h-5 w-5 text-border md:block"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section
          className="border-t border-border py-20"
          aria-labelledby="features-heading"
        >
          <div className="max-w-2xl">
            <p className="eyebrow text-muted-foreground">Built for solo work</p>
            <h2
              id="features-heading"
              className="display-serif mt-3 text-3xl leading-tight sm:text-4xl"
            >
              {t("landing.features.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {features.map((f, index) => (
              <article
                key={f.id}
                className="group bg-card p-7 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                    <f.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("landing.hero.ctaFeatures")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Open source vs Cloud */}
        <section
          className="relative overflow-hidden border-t border-border py-20"
          aria-labelledby="plans-heading"
        >
          <div className="absolute inset-0 -z-10 hairline-grid opacity-40" aria-hidden />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-muted-foreground">Simple ownership</p>
              <h2
                id="plans-heading"
                className="display-serif mt-3 max-w-xl text-3xl leading-tight sm:text-4xl"
              >
                Run it yourself, or let us run it for you.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              The source is open. The hosted Cloud plan keeps the lights on and
              pays for the team behind it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={
                  plan.featured
                    ? "relative flex flex-col rounded-2xl border border-foreground bg-foreground p-7 text-background sm:p-9"
                    : "relative flex flex-col rounded-2xl border border-border bg-card p-7 sm:p-9"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {plan.featured ? (
                        <Cloud className="h-4 w-4" aria-hidden />
                      ) : (
                        <Server className="h-4 w-4" aria-hidden />
                      )}
                      <h3 className="text-lg font-medium">{plan.name}</h3>
                    </div>
                    <p
                      className={
                        plan.featured
                          ? "mt-2 text-sm text-background/65"
                          : "mt-2 text-sm text-muted-foreground"
                      }
                    >
                      {plan.description}
                    </p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full border border-background/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-background/80">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="display-serif text-5xl leading-none">
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.featured
                        ? "text-sm text-background/60"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {plan.suffix}
                  </span>
                </div>
                <p
                  className={
                    plan.featured
                      ? "mt-1.5 text-xs text-background/55"
                      : "mt-1.5 text-xs text-muted-foreground"
                  }
                >
                  {plan.note}
                </p>

                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={
                          plan.featured
                            ? "mt-0.5 h-4 w-4 shrink-0 text-background"
                            : "mt-0.5 h-4 w-4 shrink-0 text-foreground"
                        }
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.featured ? "secondary" : "outline"}
                  className={
                    plan.featured
                      ? "mt-8 w-full bg-background text-foreground hover:bg-background/90"
                      : "mt-8 w-full"
                  }
                >
                  {plan.id === "self-host" && plan.href.startsWith("http") ? (
                    <a href={plan.href} target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" />
                      {plan.cta}
                    </a>
                  ) : (
                    <Link href={plan.href}>
                      {plan.id === "self-host" ? (
                        <Github className="h-4 w-4" />
                      ) : null}
                      {plan.cta}
                      {plan.id === "self-host" ? null : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Link>
                  )}
                </Button>
              </article>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Cloud includes 30 days per monthly payment or 365 days per yearly
            payment. Cancel any time and keep access to the end of the period.
          </p>
        </section>

        {/* FAQ */}
        <section
          className="border-t border-border py-20"
          aria-labelledby="faq-heading"
        >
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow text-muted-foreground">Questions</p>
              <h2
                id="faq-heading"
                className="display-serif mt-3 text-3xl leading-tight sm:text-4xl"
              >
                {t("landing.faq.title")}
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("landing.faq.subtitle")}
              </p>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {visibleFaqs.map((item) => (
                <details key={item.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="faq-answer mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden rounded-2xl border border-foreground bg-foreground px-6 py-16 text-center text-background sm:px-10 sm:py-20"
          aria-labelledby="cta-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 70% 80% at 50% 0%, black 20%, transparent 75%)",
            }}
            aria-hidden
          />
          <p className="eyebrow text-background/50">Start today</p>
          <h2
            id="cta-heading"
            className="display-serif mx-auto mt-4 max-w-2xl text-3xl leading-tight sm:text-5xl"
          >
            {t("landing.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-background/65 sm:text-base">
            {formatMessage(t("landing.cta.descriptionBefore"), { name })}{" "}
            <Link
              href="/pricing"
              className="text-background underline underline-offset-4"
            >
              {t("landing.cta.freeLink")}
            </Link>
            {t("landing.cta.descriptionAfter")}
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 gap-2 bg-background px-6 text-foreground hover:bg-background/90"
            >
              <Link href="/signup">
                {t("landing.cta.primary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-12 px-5 text-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
