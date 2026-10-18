"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoiceTemplatePicker } from "@/components/invoice-template-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createDefaultInvoiceForCountry } from "@/data/defaults";
import { useMarketContext } from "@/hooks/use-market-context";
import type { InvoiceTemplateId } from "@/lib/invoice-templates";
import type { Invoice } from "@/types/invoice";

const LANDING_PREVIEW_ID = "landing-invoice-preview";

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="min-h-[420px] w-full rounded-lg" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="min-h-[420px] w-full rounded-lg" /> }
);

type LandingInteractiveWorkspaceProps = {
  initialCountryCode?: string;
};

export function LandingInteractiveWorkspace({
  initialCountryCode = "US",
}: LandingInteractiveWorkspaceProps) {
  const marketContext = useMarketContext();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    setInvoice(createDefaultInvoiceForCountry(initialCountryCode));
  }, [initialCountryCode]);

  const deferredInvoice = useDeferredValue(invoice);
  const previewPending = deferredInvoice !== invoice;
  const previewInvoice = deferredInvoice;

  const setTemplateId = (templateId: InvoiceTemplateId) => {
    setInvoice((prev) => (prev ? { ...prev, templateId } : prev));
  };

  if (!invoice || !previewInvoice) {
    return (
      <div
        id="invoice-builder"
        className="@container scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="flex flex-col @min-[720px]:grid @min-[720px]:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)]">
          <Skeleton className="min-h-[420px] rounded-none" aria-hidden />
          <Skeleton className="min-h-[420px] rounded-none" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div
      id="invoice-builder"
      className="@container scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold">Live interactive workspace</p>
          <p className="text-xs text-muted-foreground">
            Edit below - the preview updates instantly. No account required.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/signup">
              <ArrowRight className="h-4 w-4" aria-hidden />
              Save &amp; download
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/pricing">
              <Download className="h-4 w-4" aria-hidden />
              Export on Cloud
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6 border-b border-border px-4 py-5 sm:px-6 lg:px-8">
        <InvoiceTemplatePicker
          value={invoice.templateId ?? "classic"}
          market={marketContext.market}
          onChange={setTemplateId}
        />
      </div>

      <div className="flex flex-col @min-[720px]:grid @min-[720px]:grid-cols-[minmax(0,1.4fr)_minmax(300px,1fr)] @min-[720px]:items-start">
        <div className="border-b border-border @min-[720px]:border-b-0 @min-[720px]:border-r">
          <InvoiceForm invoice={invoice} onChange={setInvoice} guestMode />
        </div>

        <aside className="bg-muted/15 p-4 sm:p-5 lg:p-6 @min-[720px]:sticky @min-[720px]:top-24 @min-[720px]:max-h-[calc(100vh-7rem)] @min-[720px]:overflow-y-auto">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live preview
            {previewPending ? " · updating…" : ""}
          </p>
          <div
            className={`overflow-y-auto rounded-lg border border-border bg-background p-2 transition-opacity duration-100 sm:p-3 ${previewPending ? "opacity-80" : "opacity-100"}`}
          >
            <InvoicePreviewFrame pageSize={previewInvoice.pageSize}>
              <InvoicePreview
                invoice={previewInvoice}
                previewId={LANDING_PREVIEW_ID}
                showBranding
              />
            </InvoicePreviewFrame>
          </div>
        </aside>
      </div>
    </div>
  );
}
