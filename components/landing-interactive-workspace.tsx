"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Cloud, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/invoice-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createDefaultInvoiceForCountry } from "@/data/defaults";
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
  /** ISO country from geo IP cookie — sets default currency and payment fields. */
  initialCountryCode?: string;
};

export function LandingInteractiveWorkspace({
  initialCountryCode = "US",
}: LandingInteractiveWorkspaceProps) {
  const [invoice, setInvoice] = useState<Invoice>(() =>
    createDefaultInvoiceForCountry(initialCountryCode)
  );
  const [exporting, setExporting] = useState(false);
  const deferredInvoice = useDeferredValue(invoice);
  const previewPending = deferredInvoice !== invoice;
  const previewInvoice = deferredInvoice;

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      const { downloadInvoicePdf } = await import("@/lib/pdf");
      const filename = invoice.invoice.invoiceNumber
        ? `${invoice.invoice.invoiceNumber}.pdf`
        : "invoice.pdf";
      await downloadInvoicePdf(invoice, filename, {
        previewId: LANDING_PREVIEW_ID,
      });
      toast.success("PDF downloaded", {
        description: "Sign up free to save invoices to your cloud history.",
      });
    } catch (err) {
      toast.error("PDF export failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      id="invoice-builder"
      className="scroll-mt-20 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-primary/5"
    >
      <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold">Live interactive workspace</p>
          <p className="text-xs text-muted-foreground">
            Edit below — preview updates instantly. No account required.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="lg"
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            {exporting ? "Generating PDF…" : "Generate PDF / Download"}
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/signup">
              <Cloud className="h-4 w-4" aria-hidden />
              Save to cloud
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(300px,1fr)_minmax(360px,1.05fr)] lg:items-start">
        <div className="border-b border-border/40 lg:border-b-0 lg:border-r">
          <InvoiceForm
            invoice={invoice}
            onChange={setInvoice}
            guestMode
          />
        </div>

        <aside className="bg-muted/15 p-3 sm:p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live preview
            {previewPending ? " · updating…" : ""}
          </p>
          <div
            className={`overflow-y-auto rounded-lg border border-border/50 bg-background/80 p-2 transition-opacity duration-100 sm:p-3 ${previewPending ? "opacity-80" : "opacity-100"}`}
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
