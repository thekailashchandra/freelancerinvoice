"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Github, Sparkles } from "lucide-react";
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
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  };
}

export function LandingHero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const name = siteConfig.name;
  const githubUrl = siteConfig.githubUrl;

  return (
    <section
      className="relative overflow-hidden pb-24 pt-10 md:pb-28 md:pt-14 lg:pb-32 lg:pt-16"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="hairline-grid absolute inset-0 opacity-70" />
        <div className="hero-aurora absolute inset-0 opacity-80" />
      </div>

      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0)}
            className="flex justify-center lg:justify-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-foreground" aria-hidden />
              {t("landing.hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.06)}
            className="display-serif mt-6 text-[2.75rem] leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]"
          >
            <span className="block">{t("landing.hero.titlePrefix")}</span>
            <span className="mt-1 block text-foreground">
              {t("landing.hero.titleHighlight")}
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.12)}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            {formatMessage(t("landing.hero.description"), { name })}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.18)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button size="lg" asChild className="h-12 gap-2 px-6 text-[15px]">
              <Link href="/signup">
                {t("landing.hero.ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 gap-2 px-5 text-[15px]"
            >
              <Link href="/pricing">{t("landing.hero.metaPricing")}</Link>
            </Button>
          </motion.div>

          <motion.ul
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : fadeUpVariant(0.26)}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start"
          >
            {[
              t("landing.hero.metaFree"),
              t("landing.hero.metaPdf"),
              t("landing.hero.metaCloud"),
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-foreground" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>

          {githubUrl ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : fadeUpVariant(0.3)}
              className="mt-6 flex justify-center lg:justify-start"
            >
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <Github className="h-3.5 w-3.5" aria-hidden />
                Open source - self-host for free
              </a>
            </motion.div>
          ) : null}
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
