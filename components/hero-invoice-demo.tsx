"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Circle, Maximize2, Minus } from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { demoInvoice } from "@/data/demo-invoice";
import { Skeleton } from "@/components/ui/skeleton";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="min-h-[380px] w-full rounded-xl" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="min-h-[380px] w-full rounded-xl" /> }
);

/** SaaS-style browser mockup with live invoice preview. */
export function HeroInvoiceDemo() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-2xl"
        aria-hidden
      />

      <motion.figure
        initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-2xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl"
      >
        <figcaption className="sr-only">{t("landing.hero.demoLabel")}</figcaption>

        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <Circle className="h-3 w-3 fill-red-500/90 text-red-500/90" />
            <Circle className="h-3 w-3 fill-amber-400/90 text-amber-400/90" />
            <Circle className="h-3 w-3 fill-emerald-500/90 text-emerald-500/90" />
          </div>
          <div className="mx-auto flex min-w-0 max-w-[70%] flex-1 items-center justify-center rounded-md border border-border/50 bg-background/70 px-3 py-1 text-[11px] text-muted-foreground sm:text-xs">
            <span className="truncate">{t("landing.hero.demoLabel")}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground/70" aria-hidden>
            <Minus className="h-3.5 w-3.5" />
            <Maximize2 className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-muted/20 to-muted/5 p-3 sm:p-4">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <InvoicePreviewFrame pageSize={demoInvoice.pageSize}>
            <InvoicePreview
              invoice={demoInvoice}
              previewId="hero-invoice-demo"
              showBranding
            />
          </InvoicePreviewFrame>
        </div>
      </motion.figure>

      <p className="mt-5 text-center text-sm text-muted-foreground lg:text-left">
        {t("landing.hero.demoCaption")}
      </p>
    </div>
  );
}
