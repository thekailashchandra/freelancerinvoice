"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { InvoiceMoney } from "@/components/invoice-money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaySummary = {
  invoice: {
    id: string;
    number: string;
    status: string;
    currencyCode: string;
    total: number;
    dueDate: string;
    clientName: string;
  };
  merchant: { name: string; email: string };
  keyId: string;
};

export function InvoicePayClient({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PaySummary | null>(null);
  const [paid, setPaid] = useState(false);
  const [receiptHref, setReceiptHref] = useState(`/receipt/${invoiceId}`);
  const [payerEmail, setPayerEmail] = useState("");
  const [payerName, setPayerName] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/razorpay/invoice-order?invoiceId=${encodeURIComponent(invoiceId)}`
        );
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Unable to load invoice");
          return;
        }
        if (!cancelled) {
          setSummary(data as PaySummary);
          setPayerEmail(data.invoice?.clientName ? "" : "");
        }
      } catch {
        if (!cancelled) setError("Network error loading invoice");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  const handlePay = useCallback(async () => {
    if (!summary) return;
    setPaying(true);
    setError(null);

    try {
      const orderRes = await fetch("/api/razorpay/invoice-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          customerEmail: payerEmail,
          customerName: payerName || summary.invoice.clientName,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error ?? "Could not start payment");
      }

      const payment = await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amountPaise: orderData.amountPaise,
        currency: orderData.currency,
        name: orderData.merchantName,
        description: orderData.description,
        prefill: {
          name: payerName || summary.invoice.clientName,
          email: payerEmail,
        },
        notes: {
          invoice_id: invoiceId,
          invoice_number: summary.invoice.number,
        },
      });

      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const verifyData = (await verifyRes.json()) as {
        error?: string;
        receiptToken?: string | null;
      };
      if (!verifyRes.ok) {
        throw new Error(verifyData.error ?? "Payment verification failed");
      }

      setPaid(true);
      const receiptToken =
        typeof verifyData.receiptToken === "string"
          ? verifyData.receiptToken
          : null;
      setReceiptHref(
        receiptToken
          ? `/receipt/${invoiceId}?token=${encodeURIComponent(receiptToken)}`
          : `/receipt/${invoiceId}`
      );
      toast.success("Payment successful", {
        description: `Invoice ${summary.invoice.number} is marked as paid.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment could not be completed";
      if (message !== "Payment cancelled") {
        setError(message);
        toast.error("Payment failed", { description: message });
      }
    } finally {
      setPaying(false);
    }
  }, [summary, invoiceId, payerEmail, payerName]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  if (paid) {
    return (
      <div className="mx-auto max-w-md space-y-6 rounded-xl border border-border bg-card p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold">Payment received</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Invoice {summary.invoice.number} has been marked as paid. Thank you!
          </p>
        </div>
        <Button asChild className="w-full gap-2">
          <Link href={receiptHref}>
            <Receipt className="h-4 w-4" />
            View &amp; download receipt
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border border-border bg-card p-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Pay invoice
        </p>
        <h1 className="mt-1 text-2xl font-bold">{summary.merchant.name}</h1>
        <p className="text-sm text-muted-foreground">
          Invoice #{summary.invoice.number}
        </p>
      </div>

      <div className="rounded-lg bg-muted/40 p-4">
        <p className="text-sm text-muted-foreground">Amount due</p>
        <p className="mt-1 text-3xl font-bold">
          <InvoiceMoney
            amount={summary.invoice.total}
            currencyCode={summary.invoice.currencyCode}
          />
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="payerName">Your name</Label>
          <Input
            id="payerName"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            placeholder={summary.invoice.clientName || "Client name"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payerEmail">Email (optional)</Label>
          <Input
            id="payerEmail"
            type="email"
            value={payerEmail}
            onChange={(e) => setPayerEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button className="w-full" size="lg" disabled={paying} onClick={handlePay}>
        {paying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          "Pay with Razorpay"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure checkout powered by Razorpay.
      </p>
    </div>
  );
}
