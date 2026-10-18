"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { InvoiceReceiptData } from "@/lib/invoice-receipt";
import { downloadInvoiceReceiptPdf, shareInvoiceReceipt } from "@/lib/invoice-receipt-pdf";
import { invoiceReceiptUrl } from "@/lib/invoice-receipt-url";

type InvoiceReceiptClientProps = {
  invoiceId: string;
  /** When true, show a compact toolbar only (embedded in pay success). */
  compact?: boolean;
};

export function InvoiceReceiptClient({
  invoiceId,
  compact = false,
}: InvoiceReceiptClientProps) {
  const searchParams = useSearchParams();
  const receiptToken = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<InvoiceReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = receiptToken
          ? `?token=${encodeURIComponent(receiptToken)}`
          : "";
        const res = await fetch(
          `/api/receipt/${encodeURIComponent(invoiceId)}${query}`
        );
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Receipt not found");
          return;
        }
        if (!cancelled) setReceipt(data as InvoiceReceiptData);
      } catch {
        if (!cancelled) setError("Could not load receipt");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [invoiceId, receiptToken]);

  const receiptUrl = invoiceReceiptUrl(invoiceId, {
    token: receiptToken ?? undefined,
  });

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(receiptUrl);
      toast.success("Receipt link copied");
    } catch {
      toast.error("Could not copy link", { description: receiptUrl });
    }
  }, [receiptUrl]);

  const handleDownload = useCallback(async () => {
    if (!receipt) return;
    setDownloading(true);
    try {
      await downloadInvoiceReceiptPdf(receipt);
      toast.success("Receipt downloaded");
    } catch (err) {
      toast.error("Download failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDownloading(false);
    }
  }, [receipt]);

  const handleShare = useCallback(async () => {
    if (!receipt) return;
    const shared = await shareInvoiceReceipt(receipt, receiptUrl);
    if (!shared) {
      await handleCopyLink();
    }
  }, [receipt, receiptUrl, handleCopyLink]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {error ?? "Receipt not available"}
        </p>
        {!compact ? (
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/">Go home</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  const paidDate = new Date(receipt.paidAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto w-full max-w-lg space-y-5">
      <article className="overflow-hidden rounded-2xl border border-border bg-card">
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">Payment receipt</p>
            <h1 className="display-serif mt-2 truncate text-2xl">
              {receipt.merchant.name}
            </h1>
          </div>
          <span className="shrink-0 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-background">
            PAID
          </span>
        </header>

        <div className="px-6 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Amount received
          </p>
          <p className="display-serif mt-1 text-4xl leading-none">
            {receipt.amountDisplay}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 text-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Received from
              </p>
              <p className="mt-1.5 font-medium">{receipt.client.name}</p>
              {receipt.client.company ? (
                <p className="text-muted-foreground">{receipt.client.company}</p>
              ) : null}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Invoice
              </p>
              <p className="mt-1.5 font-medium">{receipt.invoiceNumber}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {receipt.receiptNumber}
              </p>
            </div>
          </div>

          <dl className="mt-5 divide-y divide-border border-t border-border text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Payment date</dt>
              <dd className="text-right font-medium">{paidDate}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">Payment method</dt>
              <dd className="text-right font-medium">{receipt.paymentMethod}</dd>
            </div>
            {receipt.transactionId ? (
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground">Transaction ID</dt>
                <dd className="max-w-[60%] break-all text-right font-mono text-xs font-medium">
                  {receipt.transactionId}
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            This receipt confirms payment for invoice {receipt.invoiceNumber}.
          </p>
        </div>
      </article>

      <div className="flex flex-wrap gap-2">
        <Button className="gap-2" onClick={() => void handleDownload()} disabled={downloading}>
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => void handleShare()}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => void handleCopyLink()}>
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
      </div>
    </div>
  );
}
