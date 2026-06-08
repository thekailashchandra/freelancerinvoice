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
import { invoiceActionState } from "@/lib/invoice-actions";
import { deriveInvoiceStatus } from "@/lib/calculations";
import type { CompanySettings, Invoice } from "@/types/invoice";
import Link from "next/link";

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

  const displayStatus = deriveInvoiceStatus(
    invoice.status,
    invoice.invoice.dueDate
  );
  const { isLocked } = invoiceActionState(displayStatus);

  if (editId && isLocked) {
    return (
      <PageTransition className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold">This invoice cannot be edited</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {displayStatus === "void"
            ? "Voided invoices are locked. View or download instead."
            : "Paid invoices are locked. View or download instead."}
        </p>
        <Button asChild className="mt-6">
          <Link href={`/invoice-history/${editId}`}>View invoice</Link>
        </Button>
      </PageTransition>
    );
  }

  const previewInvoice = deferredInvoice ?? invoice;

  return (
    <PageTransition className="mx-auto w-full max-w-6xl pb-28 xl:max-w-[1600px] xl:pb-0">
      <div className="relative -mx-4 mb-4 hidden border-border bg-background/95 px-4 py-3 backdrop-blur-sm xl:sticky xl:top-16 xl:z-30 xl:-mt-4 xl:flex xl:items-center xl:justify-between xl:gap-4 xl:border-b md:-mx-5 md:px-5 lg:-mx-6 lg:px-6">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">
            {editId ? "Edit invoice" : "New invoice"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Preview updates as you type
            {previewPending && " · updating…"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? "Generating…" : "PDF"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
        {previewPending && (
          <div
            className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-primary/15"
            aria-hidden
          >
            <div className="h-full w-1/3 bg-primary calm-progress-bar" />
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(320px,1fr)_minmax(420px,1.1fr)] xl:items-start xl:gap-6">
        <div className="min-w-0 space-y-4">
          <div className="xl:hidden">
            <h2 className="text-xl font-semibold tracking-tight">
              {editId ? "Edit invoice" : "New invoice"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Preview updates as you type
            </p>
          </div>
          <InvoiceForm invoice={invoice} onChange={setInvoice} />
        </div>

        <aside className="min-w-0 xl:sticky xl:top-[7.75rem] xl:max-h-[calc(100vh-8.75rem)] xl:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview
          </p>
          <div
            className={`overflow-y-auto rounded-lg border border-border bg-muted/20 p-2 sm:p-3 xl:max-h-[calc(100vh-9.5rem)] transition-opacity duration-100 ${previewPending ? "opacity-80" : "opacity-100"}`}
          >
            <InvoicePreviewFrame pageSize={previewInvoice.pageSize}>
              <InvoicePreview invoice={previewInvoice} />
            </InvoicePreviewFrame>
          </div>
        </aside>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-14 z-40 border-t border-border bg-background/95 px-3 py-2 backdrop-blur-sm xl:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button size="sm" className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
