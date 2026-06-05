"use client";

import dynamic from "next/dynamic";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { Download, Loader2, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/invoice-form";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createDefaultInvoice } from "@/data/defaults";
import { saveInvoiceAction } from "@/lib/actions/invoices";
import { updateProfileAction } from "@/lib/actions/profile";
import { mergeProfileIntoInvoice } from "@/lib/invoice-mapper";
import type { CompanySettings, Invoice } from "@/types/invoice";

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="min-h-[480px] w-full rounded-lg" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="min-h-[480px] w-full rounded-lg" /> }
);

type CreateInvoiceClientProps = {
  editId: string | null;
  initialSettings: CompanySettings | null;
  initialInvoice: Invoice | null;
};

function buildInitialInvoice(
  settings: CompanySettings | null,
  existing: Invoice | null
): Invoice | null {
  if (existing) return existing;
  if (!settings) return null;
  return mergeProfileIntoInvoice(createDefaultInvoice(settings), settings);
}

export function CreateInvoiceClient({
  editId,
  initialSettings,
  initialInvoice,
}: CreateInvoiceClientProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(() =>
    buildInitialInvoice(initialSettings, initialInvoice)
  );
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const deferredInvoice = useDeferredValue(invoice);
  const previewPending = deferredInvoice !== invoice;

  useEffect(() => {
    if (initialInvoice) return;
    if (!initialSettings) return;
    setInvoice((prev) => {
      if (prev) return prev;
      return mergeProfileIntoInvoice(
        createDefaultInvoice(initialSettings),
        initialSettings
      );
    });
  }, [initialInvoice, initialSettings]);

  const handleSave = useCallback(async () => {
    if (!invoice) return;
    setSaving(true);
    try {
      const { id } = await saveInvoiceAction(invoice);
      if (invoice.company.logoHeight !== undefined) {
        await updateProfileAction({ logoHeight: invoice.company.logoHeight });
      }
      setInvoice((prev) => (prev ? { ...prev, id } : prev));
      toast.success("Invoice saved!", {
        description: `${invoice.invoice.invoiceNumber} synced to the cloud.`,
      });
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }, [invoice]);

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    setExporting(true);
    try {
      const { downloadInvoicePdf } = await import("@/lib/pdf");
      await downloadInvoicePdf(invoice, `${invoice.invoice.invoiceNumber}.pdf`, {
        previewId: "invoice-preview",
      });
      toast.success("PDF downloaded successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate PDF";
      toast.error("PDF export failed", { description: message });
      console.error("PDF export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = async () => {
    toast.info("Opening print dialog…");
    try {
      const { printInvoice } = await import("@/lib/pdf");
      await printInvoice();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not open print dialog.";
      toast.error("Print failed", { description: message });
    }
  };

  if (!invoice) {
    return (
      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-2">
        <Skeleton className="h-[600px] rounded-2xl" />
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  const actionButtons = (
    <>
      <Button variant="outline" onClick={handlePrint} className="gap-2">
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button
        variant="outline"
        onClick={handleDownloadPdf}
        disabled={exporting}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {exporting ? "Generating…" : "Download PDF"}
      </Button>
      <Button onClick={handleSave} disabled={saving} className="gap-2">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Invoice
      </Button>
    </>
  );

  const previewInvoice = deferredInvoice ?? invoice;

  return (
    <PageTransition instant className="mx-auto w-full max-w-[1920px]">
      <div className="grid gap-5 xl:grid-cols-[minmax(340px,0.92fr)_minmax(480px,1.08fr)] xl:items-start xl:gap-6">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:block">
            <div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                {editId ? "Edit Invoice" : "Create Invoice"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in details — preview updates in real time
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:hidden">{actionButtons}</div>
          </div>
          <InvoiceForm invoice={invoice} onChange={setInvoice} />
        </div>

        <aside className="min-w-0 xl:sticky xl:top-[4.5rem] xl:z-10 xl:max-h-[calc(100vh-5rem)] xl:self-start">
          <div className="mb-3 hidden flex-col gap-2 xl:flex">
            <div className="flex flex-wrap justify-end gap-2">{actionButtons}</div>
            <p className="text-sm font-medium text-muted-foreground">
              Live Preview
              {previewPending && (
                <span className="ml-2 text-xs font-normal text-muted-foreground/70">
                  Updating…
                </span>
              )}
            </p>
          </div>
          <p className="mb-3 text-sm font-medium text-muted-foreground xl:hidden">
            Live Preview
          </p>
          <div
            className={`overflow-y-auto rounded-xl border border-border/40 bg-muted/30 p-3 md:p-4 xl:max-h-[calc(100vh-7rem)] transition-opacity duration-150 ${previewPending ? "opacity-90" : "opacity-100"}`}
          >
            <InvoicePreviewFrame pageSize={previewInvoice.pageSize}>
              <InvoicePreview invoice={previewInvoice} />
            </InvoicePreviewFrame>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
