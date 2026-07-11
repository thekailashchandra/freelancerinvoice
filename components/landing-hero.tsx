"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  FileText,
  Globe,
  History,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { HeroInvoiceDemo } from "@/components/hero-invoice-demo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { formatMessage } from "@/lib/i18n/format-message";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUpVariant(delay: number) {
  return {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  };
}

const stats = [
  { valueKey: "landing.hero.statFree", labelKey: "landing.hero.statFreeLabel" },
  { valueKey: "landing.hero.statSpeed", labelKey: "landing.hero.statSpeedLabel" },
  { valueKey: "landing.hero.statExport", labelKey: "landing.hero.statExportLabel" },
] as const;

const marqueeItems = [
  { icon: FileText, key: "landing.hero.marqueePdf" },
  { icon: Cloud, key: "landing.hero.marqueeCloud" },
  { icon: Globe, key: "landing.hero.marqueeCurrency" },
  { icon: Sparkles, key: "landing.hero.marqueeBranding" },
  { icon: CheckCircle2, key: "landing.hero.marqueeGst" },
  { icon: History, key: "landing.hero.marqueeHistory" },
] as const;

export function LandingHero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const name = siteConfig.name;

  return (
    <section
      className="relative overflow-hidden pb-8 pt-6 md:pb-12 md:pt-10 lg:pb-16 lg:pt-14"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="hero-aurora absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-80" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[min(100%,900px)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm shadow-primary/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="h-4 w-4" aria-hidden />
            {t("landing.hero.badge")}
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.08)}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08] xl:text-6xl"
          >
            {t("landing.hero.titlePrefix")}{" "}
            <span className="hero-gradient-text">{t("landing.hero.titleHighlight")}</span>
            <span className="block text-foreground/95 sm:inline">
              {t("landing.hero.titleSuffix")}
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.16)}
            className="seo-hero-summary mt-6 text-lg leading-relaxed text-muted-foreground lg:max-w-xl"
          >
            {formatMessage(t("landing.hero.description"), { name })}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.24)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              size="lg"
              asChild
              className="group relative h-12 overflow-hidden px-8 text-base shadow-lg shadow-primary/20"
            >
              <Link href="/signup">
                <span className="hero-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {t("landing.hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base backdrop-blur-sm">
              <Link href="/features">{t("landing.hero.ctaFeatures")}</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="h-12 px-6 text-base">
              <a href="#sample-invoice-preview">{t("landing.hero.ctaSample")}</a>
            </Button>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.3)}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground lg:justify-start"
          >
            <Link href="/login" className="font-medium text-foreground/80 hover:text-foreground hover:underline">
              {t("landing.hero.ctaSignIn")}
            </Link>
            <span className="hidden text-border sm:inline">·</span>
            <span>{t("landing.hero.metaFree")}</span>
            <span className="text-border">·</span>
            <Link href="/pricing" className="hover:text-foreground hover:underline">
              {t("landing.hero.metaPricing")}
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.36)}
            className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 lg:max-w-lg"
          >
            {stats.map((stat) => (
              <div
                key={stat.valueKey}
                className="rounded-2xl border border-border/60 bg-card/60 p-3 text-center shadow-sm backdrop-blur-md sm:p-4 lg:text-left"
              >
                <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {t(stat.valueKey)}
                </p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          id="sample-invoice-preview"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : fadeUpVariant(0.2)}
          className="relative mx-auto w-full max-w-xl scroll-mt-28 lg:max-w-none"
        >
          <div className="hero-float">
            <HeroInvoiceDemo />
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, x: -12 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease: EASE_OUT }}
            className="hero-float-delayed absolute -left-2 top-[18%] hidden rounded-2xl border border-border/60 bg-card/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block lg:-left-6"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              {t("landing.hero.floatPaid")}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9, x: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: EASE_OUT }}
            className="hero-float absolute -right-2 bottom-[22%] hidden rounded-2xl border border-border/60 bg-card/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block lg:-right-4"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Zap className="h-4 w-4" />
              </span>
              {t("landing.hero.floatPdf")}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mt-14 overflow-hidden border-y border-border/40 bg-card/30 py-4 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="hero-marquee-track flex w-max items-center gap-3">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div
              key={`${item.key}-${index}`}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm"
              )}
            >
              <item.icon className="h-4 w-4 text-primary" aria-hidden />
              {t(item.key)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
