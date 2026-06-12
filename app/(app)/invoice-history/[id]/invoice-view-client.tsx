"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Pencil,
  Printer,
  Receipt,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { InvoicePreview } from "@/components/invoice-preview";
import { InvoicePreviewFrame } from "@/components/invoice-preview-frame";
import { PageTransition } from "@/components/page-transition";
import {
  InvoicePdfDialog,
  type InvoicePdfDialogPhase,
} from "@/components/invoice-pdf-dialog";
import { RemoveBrandingDialog } from "@/components/remove-branding-dialog";
import { TemplateUnlockDialog } from "@/components/template-unlock-dialog";
import { useInvoiceBrandingRemoval } from "@/hooks/use-invoice-branding-removal";
import { useTemplateCheckout } from "@/hooks/use-template-checkout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { invoiceActionState } from "@/lib/invoice-actions";
import {
  deleteInvoiceClient,
  fetchInvoiceByIdClient,
  updateInvoiceStatusClient,
} from "@/lib/api/invoices-client";
import { deriveInvoiceStatus } from "@/lib/calculations";
import { printInvoice } from "@/lib/invoice-print";
import { invoicePayUrl } from "@/lib/invoice-pay-url";
import { invoiceReceiptUrl } from "@/lib/invoice-receipt-url";
import { downloadInvoiceReceiptPdf, shareInvoiceReceipt } from "@/lib/invoice-receipt-pdf";
import type { InvoiceReceiptData } from "@/lib/invoice-receipt";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import { getInvoiceTemplate } from "@/lib/invoice-templates";
import type { MarketRegion } from "@/lib/geo-market";
import { requiresTemplatePayment } from "@/lib/template-export-guard";

type InvoiceViewClientProps = {
  invoiceId: string;
};

export function InvoiceViewClient({ invoiceId }: InvoiceViewClientProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Awaited<
    ReturnType<typeof fetchInvoiceByIdClient>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfDialogPhase, setPdfDialogPhase] =
    useState<InvoicePdfDialogPhase>("generating");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState<
    "paid" | "void" | "delete" | null
  >(null);
  const [receiptBusy, setReceiptBusy] = useState(false);
  const [receiptData, setReceiptData] = useState<InvoiceReceiptData | null>(
    null
  );

  const {
    hideBranding,
    dialogOpen: brandingDialogOpen,
    setDialogOpen: setBrandingDialogOpen,
    requestRemoval: requestBrandingRemoval,
    confirmKofiRemoval,
    confirming: brandingConfirming,
    pricing: brandingPricing,
  } = useInvoiceBrandingRemoval(invoice, setInvoice);

  const market: MarketRegion =
    invoice?.company.countryCode === "IN" ? "IN" : "GLOBAL";

  const {
    unlockDialogOpen,
    setUnlockDialogOpen,
    pendingTemplateId,
    pricing: templatePricing,
    payWithRazorpay,
    razorpayEnabled,
    payingRazorpay,
    startCheckout: startTemplateCheckout,
  } = useTemplateCheckout({ market });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchInvoiceByIdClient(invoiceId);
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

  useEffect(() => {
    if (!invoice || invoice.status !== "paid") {
      setReceiptData(null);
      return;
    }

    let cancelled = false;

    async function loadReceipt() {
      try {
        const res = await fetch(`/api/receipt/${encodeURIComponent(invoice!.id)}`);
        if (!res.ok) return;
        const data = (await res.json()) as InvoiceReceiptData;
        if (!cancelled) setReceiptData(data);
      } catch {
        /* receipt optional */
      }
    }

    void loadReceipt();
    return () => {
      cancelled = true;
    };
  }, [invoice]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
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
  const { canEdit, canMarkPaid, canVoid, isLocked } =
    invoiceActionState(displayStatus);
  const showRazorpayLink =
    isRazorpayEnabled() &&
    Boolean(invoice.company.razorpayConfigured) &&
    canMarkPaid &&
    displayStatus !== "paid";
  const isPaid = displayStatus === "paid";
  const receiptUrl = invoiceReceiptUrl(invoice.id);

  const handleCopyReceiptLink = async () => {
    try {
      await navigator.clipboard.writeText(receiptUrl);
      toast.success("Receipt link copied", {
        description: "Share this link with your client as proof of payment.",
      });
    } catch {
      toast.error("Could not copy link", { description: receiptUrl });
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptData) {
      toast.error("Receipt not ready", { description: "Try again in a moment." });
      return;
    }
    setReceiptBusy(true);
    try {
      await downloadInvoiceReceiptPdf(receiptData);
      toast.success("Receipt downloaded");
    } catch (err) {
      toast.error("Could not download receipt", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setReceiptBusy(false);
    }
  };

  const handleShareReceipt = async () => {
    if (!receiptData) {
      await handleCopyReceiptLink();
      return;
    }
    const shared = await shareInvoiceReceipt(receiptData, receiptUrl);
    if (!shared) await handleCopyReceiptLink();
  };

  const handleCopyPayLink = async () => {
    const url = invoicePayUrl(invoice.id);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Razorpay payment link copied", {
        description: "Share this link with your client to collect payment.",
      });
    } catch {
      toast.error("Could not copy link", { description: url });
    }
  };

  const promptTemplateUnlock = (action: "print" | "download") => {
    const template = getInvoiceTemplate(invoice.templateId);
    toast.message(`Unlock ${template.name} to ${action}`, {
      description: `One-time ${templatePricing.displayAmount} payment required.`,
      action: {
        label: `Pay ${templatePricing.displayAmount}`,
        onClick: () => void startTemplateCheckout(invoice.templateId ?? "modern"),
      },
    });
  };

  const handleDownloadPdf = async () => {
    if (requiresTemplatePayment(invoice.templateId)) {
      promptTemplateUnlock("download");
      return;
    }

    setExporting(true);
    setPdfError(null);
    setPdfDialogPhase("generating");
    setPdfDialogOpen(true);
    try {
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
      const { downloadInvoicePdf } = await import("@/lib/pdf");
      await downloadInvoicePdf(invoice, `${invoice.invoice.invoiceNumber}.pdf`, {
        previewId: "invoice-preview",
      });
      setPdfDialogPhase("success");
    } catch (err) {
      setPdfError(
        err instanceof Error ? err.message : "Unknown error"
      );
      setPdfDialogPhase("error");
    } finally {
      setExporting(false);
    }
  };

  const handleMarkPaid = async () => {
    setActionBusy("paid");
    try {
      await updateInvoiceStatusClient(invoice.id, "paid");
      setInvoice((prev) => (prev ? { ...prev, status: "paid" } : prev));
      toast.success("Invoice marked as paid", {
        description: "You can download or share a payment receipt now.",
        action: {
          label: "View receipt",
          onClick: () => window.open(`/receipt/${invoice.id}`, "_blank"),
        },
      });
      router.refresh();
    } catch (err) {
      toast.error("Could not mark as paid", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setActionBusy(null);
    }
  };

  const handleVoid = async () => {
    if (
      !window.confirm(
        `Void ${invoice.invoice.invoiceNumber}? It will be locked from editing.`
      )
    ) {
      return;
    }
    setActionBusy("void");
    try {
      await updateInvoiceStatusClient(invoice.id, "void");
      setInvoice((prev) => (prev ? { ...prev, status: "void" } : prev));
      toast.success("Invoice voided");
      router.refresh();
    } catch (err) {
      toast.error("Could not void invoice", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setActionBusy(null);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete ${invoice.invoice.invoiceNumber}? This cannot be undone.`
      )
    ) {
      return;
    }
    setActionBusy("delete");
    try {
      await deleteInvoiceClient(invoice.id);
      toast.success("Invoice deleted");
      router.push("/invoice-history");
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setActionBusy(null);
    }
  };

  const statusMessage = isLocked
    ? displayStatus === "void"
      ? "Voided invoice: view and download only."
      : "Paid invoice: download the invoice or share a payment receipt."
    : "Read-only preview. Use Edit to change details.";

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
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={async () => {
              if (requiresTemplatePayment(invoice.templateId)) {
                promptTemplateUnlock("print");
                return;
              }
              try {
                await printInvoice({ previewId: "invoice-preview" });
              } catch (err) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Could not open print dialog.";
                toast.error("Print failed", { description: message });
              }
            }}
          >
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
          {isPaid ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => void handleDownloadReceipt()}
                disabled={receiptBusy}
              >
                {receiptBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Receipt className="h-4 w-4" />
                )}
                Receipt
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                asChild
              >
                <Link href={`/receipt/${invoice.id}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View receipt
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => void handleShareReceipt()}
              >
                <Share2 className="h-4 w-4" />
                Share receipt
              </Button>
            </>
          ) : null}
          {canEdit && (
            <Button size="sm" className="gap-2" asChild>
              <Link href={`/create-invoice?id=${invoice.id}`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
          {canMarkPaid && (
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={handleMarkPaid}
              disabled={actionBusy !== null}
            >
              {actionBusy === "paid" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Mark as paid
            </Button>
          )}
          {showRazorpayLink && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => void handleCopyPayLink()}
            >
              <Copy className="h-4 w-4" />
              Copy Razorpay link
            </Button>
          )}
          {canVoid && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={handleVoid}
              disabled={actionBusy !== null}
            >
              {actionBusy === "void" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              Void
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={actionBusy !== null}
          >
            {actionBusy === "delete" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
        <InvoicePreviewFrame
          pageSize={invoice.pageSize}
          exportLocked={requiresTemplatePayment(invoice.templateId)}
        >
          <InvoicePreview
            invoice={invoice}
            previewId="invoice-preview"
            onRemoveBranding={
              hideBranding ? undefined : requestBrandingRemoval
            }
          />
        </InvoicePreviewFrame>
      </div>

      <InvoicePdfDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        phase={pdfDialogPhase}
        errorMessage={pdfError}
      />
      <RemoveBrandingDialog
        open={brandingDialogOpen}
        onOpenChange={setBrandingDialogOpen}
        displayAmount={brandingPricing.displayAmount}
        onConfirmPaid={() => void confirmKofiRemoval()}
        confirming={brandingConfirming}
      />
      <TemplateUnlockDialog
        open={unlockDialogOpen}
        onOpenChange={setUnlockDialogOpen}
        templateId={pendingTemplateId}
        templateName={getInvoiceTemplate(pendingTemplateId).name}
        displayAmount={templatePricing.displayAmount}
        razorpayEnabled={razorpayEnabled}
        onPayWithRazorpay={() => void payWithRazorpay()}
        payingRazorpay={payingRazorpay}
      />
    </PageTransition>
  );
}
