"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Printer, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createDefaultInvoice } from "@/data/defaults";
import { useProfile } from "@/hooks/use-profile";
import { fetchInvoiceByIdAction } from "@/lib/actions/invoices";
import { saveInvoiceAction } from "@/lib/actions/invoices";
import { mergeProfileIntoInvoice } from "@/lib/invoice-mapper";
import { downloadInvoicePdf, printInvoice } from "@/lib/pdf";
import type { Invoice } from "@/types/invoice";

export function CreateInvoiceClient() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { settings, loading: settingsLoading } = useProfile();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (settingsLoading) return;

    async function load() {
      if (editId) {
        const existing = await fetchInvoiceByIdAction(editId);
        if (existing) {
          setInvoice(existing);
          return;
        }
      }
      setInvoice(mergeProfileIntoInvoice(createDefaultInvoice(settings), settings));
    }

    load();
  }, [editId, settings, settingsLoading]);

  const handleSave = useCallback(async () => {
    if (!invoice) return;
    setSaving(true);
    try {
      const { id } = await saveInvoiceAction(invoice);
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

  const handlePrint = () => {
    printInvoice();
    toast.info("Opening print dialog…");
  };

  if (settingsLoading || !invoice) {
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
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.span>
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Invoice
      </Button>
    </>
  );

  return (
    <PageTransition className="mx-auto max-w-[1600px]">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0 space-y-6">
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

        <aside className="lg:sticky lg:top-20 lg:z-10 lg:max-h-[calc(100vh-5.5rem)] lg:self-start">
          <div className="mb-4 hidden flex-col gap-3 lg:flex">
            <div className="flex flex-wrap justify-end gap-2">{actionButtons}</div>
            <p className="text-sm font-medium text-muted-foreground">Live Preview</p>
          </div>
          <p className="mb-4 text-sm font-medium text-muted-foreground lg:hidden">
            Live Preview
          </p>
          <div className="overflow-y-auto rounded-2xl border border-border/50 bg-slate-100/80 p-4 md:p-6 dark:bg-slate-900/40 lg:max-h-[calc(100vh-12rem)]">
            <InvoicePreview invoice={invoice} />
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
