"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { HeroInvoiceDemo } from "@/components/hero-invoice-demo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { formatMessage } from "@/lib/i18n/format-message";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUpVariant(delay: number) {
  return {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  };
}

export function LandingHero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const name = siteConfig.name;

  return (
    <section
      className="relative overflow-hidden pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-24 lg:pt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="hero-aurora absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[min(100%,720px)] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0)}
            className="mb-4 text-sm font-medium tracking-wide text-muted-foreground"
          >
            {name}
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.06)}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
          >
            <span className="hero-gradient-text">
              {t("landing.hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.12)}
            className="mt-5 text-lg leading-relaxed text-muted-foreground lg:max-w-md"
          >
            {formatMessage(t("landing.hero.description"), { name })}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.18)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button
              size="lg"
              asChild
              className="h-11 px-7 text-base shadow-md shadow-primary/15"
            >
              <Link href="/signup">
                {t("landing.hero.ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-11 px-5 text-base text-muted-foreground"
            >
              <Link href="/login">{t("landing.hero.ctaSignIn")}</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.24)}
            className="mt-5 text-sm text-muted-foreground/80"
          >
            {t("landing.hero.metaFree")}
            <span className="mx-2 text-border">·</span>
            <Link
              href="/pricing"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("landing.hero.metaPricing")}
            </Link>
          </motion.p>
        </div>

        <motion.div
          id="sample-invoice-preview"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : fadeUpVariant(0.14)}
          className="relative mx-auto w-full max-w-lg scroll-mt-28 lg:max-w-none"
        >
          <HeroInvoiceDemo />
        </motion.div>
      </div>
    </section>
  );
}
