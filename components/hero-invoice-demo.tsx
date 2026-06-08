"use client";

import dynamic from "next/dynamic";
import { Download, Save } from "lucide-react";
import { demoInvoice } from "@/data/demo-invoice";
import { siteConfig } from "@/data/site";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="min-h-[320px] w-full rounded-md" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="min-h-[320px] w-full rounded-md" /> }
);

export function HeroInvoiceDemo() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/30 via-primary/15 to-primary/5 blur-2xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-md bg-background/80 px-3 py-1 text-center text-xs text-muted-foreground">
            {siteConfig.url.replace(/^https?:\/\//, "")}/create-invoice
          </div>
        </div>

        <div className="border-b border-border/40 bg-background/50 px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">New invoice</p>
              <p className="text-xs text-muted-foreground">Live preview</p>
            </div>
            <div className="flex shrink-0 gap-1.5" aria-hidden>
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">
                <Download className="h-3 w-3" />
                PDF
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                <Save className="h-3 w-3" />
                Save
              </span>
            </div>
          </div>
        </div>

        <div className="grid bg-muted/20 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="hidden space-y-3 border-r border-border/40 p-4 sm:block">
            <div className="space-y-1.5">
              <div className="h-2 w-16 rounded bg-muted-foreground/20" />
              <div className="h-8 rounded-md border border-border/50 bg-background/80" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-12 rounded bg-muted-foreground/20" />
              <div className="h-8 rounded-md border border-border/50 bg-background/80" />
              <div className="h-8 rounded-md border border-border/50 bg-background/60" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-20 rounded bg-muted-foreground/20" />
              <div className="h-7 rounded-md border border-border/50 bg-background/80" />
              <div className="h-7 rounded-md border border-border/50 bg-background/60" />
              <div className="h-7 rounded-md border border-primary/30 bg-primary/5" />
            </div>
          </div>

          <div className="p-2 sm:p-3">
            <InvoicePreviewFrame pageSize={demoInvoice.pageSize}>
              <InvoicePreview
                invoice={demoInvoice}
                previewId="hero-invoice-demo"
                showBranding
              />
            </InvoicePreviewFrame>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-3 left-6 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium shadow-lg sm:left-8"
        aria-hidden
      >
        <span className="text-muted-foreground">Total due</span>{" "}
        <span className="text-foreground">$7,000.00</span>
      </div>
    </div>
  );
}
