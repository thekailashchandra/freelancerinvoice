"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Clock,
  Download,
  FileText,
  Globe,
  History,
  Receipt,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { guideArticles } from "@/data/guides";
import { geoAuthoritativeAnswers } from "@/data/geo";
import { faqItems } from "@/data/seo";
import { siteConfig } from "@/data/site";
import { useTranslation } from "@/components/locale-provider";
import { GeoKeyFacts } from "@/components/geo-key-facts";
import { HeroInvoiceDemo } from "@/components/hero-invoice-demo";
import { PublicSiteFooter } from "@/components/public-site-footer";
import { PublicSiteHeader } from "@/components/public-site-header";
import { Button } from "@/components/ui/button";
import { formatMessage } from "@/lib/i18n/format-message";

const FEATURE_IDS = ["f1", "f2", "f3", "f4", "f5", "f6"] as const;
const FEATURE_ICONS: Record<(typeof FEATURE_IDS)[number], LucideIcon> = {
  f1: FileText,
  f2: Cloud,
  f3: History,
  f4: Shield,
  f5: Download,
  f6: Globe,
};

const STEP_IDS = ["s1", "s2", "s3"] as const;
const BENEFIT_IDS = ["b1", "b2", "b3", "b4", "b5", "b6"] as const;
const USE_CASE_IDS = ["u1", "u2", "u3"] as const;

const featuredGuides = guideArticles.slice(0, 3);
const allFaqItems = [...faqItems, ...geoAuthoritativeAnswers];

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

  const benefits = useMemo(
    () => BENEFIT_IDS.map((id) => t(`landing.benefits.${id}`)),
    [t]
  );

  const useCases = useMemo(
    () =>
      USE_CASE_IDS.map((id) => ({
        title: t(`landing.useCases.${id}.title`),
        body: t(`landing.useCases.${id}.body`),
      })),
    [t]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      </div>

      <PublicSiteHeader />

      <main className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10 xl:px-12">
        <section
          className="py-12 md:py-16 lg:py-20"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              {t("landing.hero.badge")}
            </div>
            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              {t("landing.hero.titlePrefix")}{" "}
              <span className="gradient-text">{t("landing.hero.titleHighlight")}</span>
              {t("landing.hero.titleSuffix")}
            </h1>
            <p className="seo-hero-summary mt-6 text-lg text-muted-foreground">
              {formatMessage(t("landing.hero.description"), { name })}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2 px-8">
                <Link href="/signup">
                  {t("landing.hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">{t("landing.hero.ctaFeatures")}</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/login">{t("landing.hero.ctaSignIn")}</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("landing.hero.metaFree")} ·{" "}
              <Link href="/pricing" className="text-foreground hover:underline">
                {t("landing.hero.metaPricing")}
              </Link>
              {" · "}
              {t("landing.hero.metaPdf")} · {t("landing.hero.metaCloud")}
            </p>
          </div>

          <div className="mt-12 md:mt-14 lg:mt-16">
            <HeroInvoiceDemo />
          </div>
        </section>

        <section className="py-12" aria-label="Product summary">
          <GeoKeyFacts />
        </section>

        <section className="py-12" aria-labelledby="features-heading">
          <h2 id="features-heading" className="mb-3 text-center text-3xl font-bold">
            {t("landing.features.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            {t("landing.features.subtitle")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.id}
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

        <section className="py-12" aria-labelledby="about-heading">
          <div className="glass rounded-2xl border border-border/50 p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="hidden rounded-xl bg-primary/10 p-3 sm:block">
                <Receipt className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <div>
                <h2 id="about-heading" className="text-2xl font-bold md:text-3xl">
                  {t("landing.about.title")}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("landing.about.p1")}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {formatMessage(t("landing.about.p2"), { name })}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" aria-labelledby="how-heading">
          <h2 id="how-heading" className="mb-3 text-center text-3xl font-bold">
            {t("landing.steps.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            {t("landing.steps.subtitle")}
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

        <section className="py-12" aria-labelledby="benefits-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="benefits-heading" className="text-3xl font-bold">
                {formatMessage(t("landing.benefits.title"), { name })}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("landing.benefits.intro")}
              </p>
              <Button className="mt-6 gap-2" asChild>
                <Link href="/signup">
                  {t("landing.benefits.cta")}
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

        <section className="py-12" aria-labelledby="usecases-heading">
          <h2 id="usecases-heading" className="mb-10 text-center text-3xl font-bold">
            {t("landing.useCases.title")}
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

        <section className="py-12" aria-labelledby="guide-heading">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="guide-heading" className="text-3xl font-bold">
                {t("landing.guideSection.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {t("landing.guideSection.subtitle")}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/guide">
                {t("guides.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredGuides.map((article) => (
              <article
                key={article.slug}
                className="glass rounded-2xl border border-border/50 p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {article.category}
                </p>
                <h3 className="mt-2 font-semibold leading-snug">
                  <Link
                    href={`/guide/${article.slug}`}
                    className="hover:text-primary"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
                <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readingTimeMinutes} {t("guides.minRead")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-3 text-center text-3xl font-bold">
            {t("landing.faq.title")}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
            {t("landing.faq.subtitle")}
          </p>
          <div className="mx-auto max-w-3xl space-y-4">
            {allFaqItems.map((item) => (
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

        <section className="py-12 text-center" aria-labelledby="cta-heading">
          <div className="glass rounded-2xl border border-primary/20 bg-primary/5 px-6 py-12 md:px-12">
            <h2 id="cta-heading" className="text-3xl font-bold">
              {t("landing.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {formatMessage(t("landing.cta.descriptionBefore"), { name })}{" "}
              <Link href="/pricing" className="text-foreground hover:underline">
                {t("landing.cta.freeLink")}
              </Link>
              {t("landing.cta.descriptionAfter")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/signup">
                  {t("landing.cta.primary")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/guide">{t("landing.cta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
}
