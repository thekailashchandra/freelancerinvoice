"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Code2,
  FileSpreadsheet,
  Globe2,
  LayoutTemplate,
  Palette,
  PenLine,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { countryFlagEmoji } from "@/lib/i18n/country-locale";
import { formatMessage } from "@/lib/i18n/format-message";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TEMPLATE_SWATCHES = [
  { id: "classic", swatch: "bg-neutral-800", free: true },
  { id: "modern", swatch: "bg-neutral-900", free: true },
  { id: "minimal", swatch: "bg-neutral-300 text-neutral-900", free: true },
  { id: "simple", swatch: "bg-neutral-700", free: true },
  { id: "corporate", swatch: "bg-neutral-200 text-neutral-900", free: true },
  { id: "studio", swatch: "bg-neutral-900", free: true },
  { id: "geometric", swatch: "bg-neutral-600", free: true },
  { id: "swiss", swatch: "bg-neutral-100 text-neutral-900", free: true },
] as const;

const WHY_KEYS = ["w1", "w2", "w3", "w4", "w5"] as const;

const ROLE_ICONS: Record<string, LucideIcon> = {
  r1: Palette,
  r2: Code2,
  r3: PenLine,
  r4: Briefcase,
};

const ROLE_KEYS = ["r1", "r2", "r3", "r4"] as const;

const GET_PAID_ICONS = [Wallet, CalendarClock, Banknote] as const;
const GET_PAID_KEYS = ["g1", "g2", "g3"] as const;

const COUNTRY_LINKS = [
  { code: "US", href: "/invoice-for-freelance-us", key: "us" },
  { code: "GB", href: "/invoice-for-freelance-uk", key: "uk" },
  { code: "IN", href: "/india", key: "india" },
  { code: "EU", href: "/global-freelance-invoicing-compliance", key: "global" },
] as const;

const RESOURCE_LINKS = [
  { href: "/invoice-generator-for-freelancers", key: "freelancers" },
  { href: "/gst-invoice-generator-india", key: "india" },
  { href: "/invoice-software-for-designers", key: "designers" },
  { href: "/invoice-template-for-agencies", key: "agencies" },
  { href: "/guide", key: "guides" },
] as const;

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingRichContent() {
  const { t } = useTranslation();
  const name = siteConfig.name;

  return (
    <>
      <section className="py-12" aria-labelledby="templates-heading">
        <FadeIn>
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <LayoutTemplate className="h-3.5 w-3.5" aria-hidden />
              {t("landing.rich.templates.title").split("-")[0]?.trim()}
            </div>
            <h2 id="templates-heading" className="text-3xl font-bold">
              {t("landing.rich.templates.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              {t("landing.rich.templates.subtitle")}
            </p>
          </div>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_SWATCHES.map((tpl, index) => (
            <FadeIn key={tpl.id} delay={index * 0.06}>
              <article className="group glass flex h-full flex-col rounded-2xl border border-border/50 p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-inner",
                    tpl.swatch
                  )}
                  aria-hidden
                >
                  <Sparkles className="h-5 w-5 opacity-90" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {t(`landing.rich.templates.${tpl.id}.name`)}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      tpl.free
                        ? "bg-foreground/10 text-foreground"
                        : "bg-primary/15 text-primary"
                    )}
                  >
                    {t(`landing.rich.templates.${tpl.id}.tag`)}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.rich.templates.${tpl.id}.description`)}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-8 text-center">
          <Button asChild className="gap-2">
            <Link href="/signup">
              {t("landing.rich.templates.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </section>

      <section className="py-12" aria-labelledby="why-template-heading">
        <FadeIn>
          <div className="glass rounded-2xl border border-border/50 p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h2 id="why-template-heading" className="text-2xl font-bold md:text-3xl">
                  {t("landing.rich.whyTemplate.title")}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("landing.rich.whyTemplate.intro")}
                </p>
              </div>
              <ul className="space-y-3">
                {WHY_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{t(`landing.rich.whyTemplate.points.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="py-12" aria-labelledby="who-needs-heading">
        <FadeIn>
          <h2 id="who-needs-heading" className="text-center text-3xl font-bold">
            {t("landing.rich.whoNeeds.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("landing.rich.whoNeeds.intro")}
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_KEYS.map((key, index) => {
            const Icon = ROLE_ICONS[key];
            return (
              <FadeIn key={key} delay={index * 0.05}>
                <article className="rounded-2xl border border-border/50 bg-card/50 p-6 transition-shadow hover:shadow-md">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                  </div>
                  <h3 className="font-semibold">
                    {t(`landing.rich.whoNeeds.roles.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`landing.rich.whoNeeds.roles.${key}.body`)}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>

      <section className="py-12" aria-labelledby="get-paid-heading">
        <FadeIn>
          <h2 id="get-paid-heading" className="text-center text-3xl font-bold">
            {t("landing.rich.getPaid.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            {t("landing.rich.getPaid.subtitle")}
          </p>
        </FadeIn>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {GET_PAID_KEYS.map((key, index) => {
            const Icon = GET_PAID_ICONS[index];
            return (
              <FadeIn key={key} delay={index * 0.08}>
                <li className="glass rounded-2xl border border-border/50 p-6">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" aria-hidden />
                    <h3 className="font-semibold">
                      {t(`landing.rich.getPaid.steps.${key}.title`)}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`landing.rich.getPaid.steps.${key}.body`)}
                  </p>
                </li>
              </FadeIn>
            );
          })}
        </ol>
      </section>

      <section className="py-12" aria-labelledby="compare-heading">
        <FadeIn>
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center md:p-12">
            <h2 id="compare-heading" className="text-2xl font-bold md:text-3xl">
              {t("landing.rich.compare.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              {formatMessage(t("landing.rich.compare.body"), { name })}
            </p>
            <Button size="lg" className="mt-8 gap-2" asChild>
              <Link href="/signup">
                {t("landing.rich.compare.cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      <section className="py-12" aria-labelledby="countries-heading">
        <FadeIn>
          <div className="mb-8 flex items-center justify-center gap-2 text-primary">
            <Globe2 className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium uppercase tracking-wide">
              {t("locale.chooseCountry")}
            </span>
          </div>
          <h2 id="countries-heading" className="text-center text-3xl font-bold">
            {t("landing.rich.countries.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            {t("landing.rich.countries.subtitle")}
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRY_LINKS.map((country, index) => (
            <FadeIn key={country.key} delay={index * 0.05}>
              <Link
                href={country.href}
                className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {countryFlagEmoji(country.code)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold group-hover:text-primary">
                    {t(`landing.rich.countries.${country.key}.label`)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(`landing.rich.countries.${country.key}.hint`)}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="py-8" aria-labelledby="resources-heading">
        <FadeIn>
          <h2 id="resources-heading" className="mb-6 text-center text-xl font-bold">
            {t("landing.rich.resources.title")}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {RESOURCE_LINKS.map((link) => (
              <Button key={link.key} variant="outline" size="sm" asChild>
                <Link href={link.href}>{t(`landing.rich.resources.${link.key}`)}</Link>
              </Button>
            ))}
          </div>
        </FadeIn>
      </section>
    </>
  );
}
