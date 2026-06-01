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
import { useCompanySettings } from "@/hooks/use-company-settings";
import { useInvoices } from "@/hooks/use-invoices";
import { downloadInvoicePdf, printInvoice } from "@/lib/pdf";
import { getInvoiceById } from "@/lib/storage";
import type { Invoice } from "@/types/invoice";

export function CreateInvoiceClient() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { settings, loading: settingsLoading } = useCompanySettings();
  const { upsert } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (settingsLoading) return;

    if (editId) {
      const existing = getInvoiceById(editId);
      if (existing) {
        setInvoice(existing);
        return;
      }
    }

    setInvoice(createDefaultInvoice(settings));
  }, [editId, settings, settingsLoading]);

  const handleSave = useCallback(() => {
    if (!invoice) return;
    setSaving(true);
    upsert(invoice);
    toast.success("Invoice saved!", {
      description: `${invoice.invoice.invoiceNumber} stored locally.`,
    });
    setTimeout(() => setSaving(false), 600);
  }, [invoice, upsert]);

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    setExporting(true);
    try {
      await downloadInvoicePdf(
        invoice,
        `${invoice.invoice.invoiceNumber}.pdf`
      );
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
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <Skeleton className="h-[600px] rounded-2xl" />
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            {editId ? "Edit Invoice" : "Create Invoice"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in details — preview updates in real time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="min-w-0">
          <InvoiceForm invoice={invoice} onChange={setInvoice} />
        </div>
        <div className="xl:sticky xl:top-24 xl:self-start">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Live Preview
          </p>
          <motion.div
            layout
            className="rounded-2xl border border-border/50 bg-slate-100/80 p-4 md:p-8 dark:bg-slate-900/40"
          >
            <InvoicePreview invoice={invoice} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
