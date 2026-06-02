"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Pencil,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { InvoicePreview } from "@/components/invoice-preview";
import { PageTransition } from "@/components/page-transition";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchInvoiceByIdAction,
  updateInvoiceStatusAction,
} from "@/lib/actions/invoices";
import { deriveInvoiceStatus } from "@/lib/calculations";
import { downloadInvoicePdf, printInvoice } from "@/lib/pdf";
import type { Invoice } from "@/types/invoice";

type InvoiceViewClientProps = {
  invoiceId: string;
};

export function InvoiceViewClient({ invoiceId }: InvoiceViewClientProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchInvoiceByIdAction(invoiceId);
        if (!cancelled) setInvoice(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[700px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <PageTransition className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold">Invoice not found</h2>
        <p className="mt-2 text-muted-foreground">
          It may have been deleted or you do not have access.
        </p>
        <Button asChild className="mt-6">
          <Link href="/invoice-history">Back to history</Link>
        </Button>
      </PageTransition>
    );
  }

  const displayStatus = deriveInvoiceStatus(
    invoice.status,
    invoice.invoice.dueDate
  );
  const isPaid = displayStatus === "paid";
  const canMarkPaid = !isPaid && displayStatus !== "draft";

  const handleDownloadPdf = async () => {
    setExporting(true);
    try {
      await downloadInvoicePdf(invoice, `${invoice.invoice.invoiceNumber}.pdf`, {
        previewId: "invoice-preview",
      });
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("PDF export failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      await updateInvoiceStatusAction(invoice.id, "paid");
      setInvoice((prev) => (prev ? { ...prev, status: "paid" } : prev));
      toast.success("Invoice marked as paid");
      router.refresh();
    } catch (err) {
      toast.error("Could not update status", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setMarkingPaid(false);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
            <Link href="/invoice-history">
              <ArrowLeft className="h-4 w-4" />
              Invoice history
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight font-mono">
              {invoice.invoice.invoiceNumber}
            </h2>
            <StatusBadge status={displayStatus} />
          </div>
          <p className="text-sm text-muted-foreground">
            {isPaid
              ? "Paid invoice — view and download only."
              : "Read-only preview. Use Edit to change line items or details."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => printInvoice()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>
          {!isPaid && (
            <Button size="sm" className="gap-2" asChild>
              <Link href={`/create-invoice?id=${invoice.id}`}>
                <Pencil className="h-4 w-4" />
                Edit invoice
              </Link>
            </Button>
          )}
          {canMarkPaid && (
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={handleMarkPaid}
              disabled={markingPaid}
            >
              {markingPaid ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Mark as paid
            </Button>
          )}
        </div>
      </div>

      <InvoicePreview invoice={invoice} previewId="invoice-preview" />
    </PageTransition>
  );
}
