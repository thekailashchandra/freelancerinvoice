"use client";

import dynamic from "next/dynamic";
import { demoInvoice } from "@/data/demo-invoice";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="min-h-[420px] w-full rounded-xl" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="min-h-[420px] w-full rounded-xl" /> }
);

/** Marketing hero visual — invoice preview only (not a fake app shell). */
export function HeroInvoiceDemo() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-2xl">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/20 via-primary/5 to-transparent blur-2xl"
        aria-hidden
      />
      <figure className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
        <figcaption className="sr-only">
          Example freelancer invoice preview
        </figcaption>
        <div className="border-b border-border/50 bg-muted/30 px-4 py-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Example invoice preview
          </p>
        </div>
        <div className="bg-muted/15 p-3 sm:p-4">
          <InvoicePreviewFrame pageSize={demoInvoice.pageSize}>
            <InvoicePreview
              invoice={demoInvoice}
              previewId="hero-invoice-demo"
              showBranding
            />
          </InvoicePreviewFrame>
        </div>
      </figure>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Professional PDF export · Live preview while you edit
      </p>
    </div>
  );
}
