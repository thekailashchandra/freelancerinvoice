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
    <div className="relative mx-auto w-full max-w-xl xl:max-w-none">
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/25 via-primary/10 to-transparent blur-xl"
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

        <div className="bg-muted/20 p-2 sm:p-3">
          <InvoicePreviewFrame pageSize={demoInvoice.pageSize}>
            <InvoicePreview
              invoice={demoInvoice}
              previewId="hero-invoice-demo"
              showBranding
            />
          </InvoicePreviewFrame>
        </div>
      </div>

      <p
        className="mt-4 inline-flex rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium shadow-sm"
        aria-hidden
      >
        <span className="text-muted-foreground">Total due</span>{" "}
        <span className="ml-1 text-foreground">$7,000.00</span>
      </p>
    </div>
  );
}
