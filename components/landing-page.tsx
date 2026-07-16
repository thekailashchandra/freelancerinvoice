"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Cloud,
  FileText,
  History,
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

/** Keep the home page calm — show a short feature set and a small FAQ. */
const FEATURE_IDS = ["f1", "f2", "f3"] as const;
const FEATURE_ICONS: Record<(typeof FEATURE_IDS)[number], LucideIcon> = {
  f1: FileText,
  f2: Cloud,
  f3: History,
};

const STEP_IDS = ["s1", "s2", "s3"] as const;
const VISIBLE_FAQ_COUNT = 5;

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
        step: String(index + 1),
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

        <section className="border-t border-border/40 py-16" aria-labelledby="how-heading">
          <h2
            id="how-heading"
            className="mb-2 text-center text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("landing.steps.title")}
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            {t("landing.steps.subtitle")}
          </p>
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <li key={s.step} className="text-center md:text-left">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border/40 py-16" aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="mb-2 text-center text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("landing.features.title")}
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            {t("landing.features.subtitle")}
          </p>
          <div className="grid gap-10 sm:grid-cols-3">
            {features.map((f) => (
              <article key={f.id} className="text-center sm:text-left">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60">
                  <f.icon className="h-5 w-5 text-foreground/80" aria-hidden />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("landing.hero.ctaFeatures")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </section>

        <section className="border-t border-border/40 py-16" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="mb-2 text-center text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("landing.faq.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
            {t("landing.faq.subtitle")}
          </p>
          <div className="mx-auto max-w-2xl divide-y divide-border/50">
            {visibleFaqs.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="faq-answer mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-border/40 py-16 text-center" aria-labelledby="cta-heading">
          <h2
            id="cta-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("landing.cta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {formatMessage(t("landing.cta.descriptionBefore"), { name })}{" "}
            <Link href="/pricing" className="text-foreground underline-offset-4 hover:underline">
              {t("landing.cta.freeLink")}
            </Link>
            {t("landing.cta.descriptionAfter")}
          </p>
          <div className="mt-8">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/signup">
                {t("landing.cta.primary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
