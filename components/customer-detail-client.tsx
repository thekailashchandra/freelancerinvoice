"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { InvoiceTable } from "@/components/invoice-table";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteInvoiceClient } from "@/lib/api/invoices-client";
import { formatMoney } from "@/lib/currency";
import { downloadClientStatementPdf } from "@/lib/client-statement-pdf";
import {
  clientDisplayName,
  type ClientSummary,
} from "@/lib/customer-invoices";
import type { SavedClient } from "@/lib/client-mapper";
import type { Invoice } from "@/types/invoice";

type CustomerDetailClientProps = {
  client: SavedClient;
  summary: ClientSummary;
  invoices: Invoice[];
  issuerName: string;
  currencyCode: string;
};

export function CustomerDetailClient({
  client,
  summary,
  invoices: initialInvoices,
  issuerName,
  currencyCode,
}: CustomerDetailClientProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [downloading, setDownloading] = useState(false);
  const [busyInvoiceId, setBusyInvoiceId] = useState<string | null>(null);

  const handleDownloadStatement = async () => {
    setDownloading(true);
    try {
      await downloadClientStatementPdf(client, invoices, issuerName);
      toast.success("Statement downloaded");
    } catch (err) {
      toast.error("Could not download statement", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyInvoiceId(id);
    try {
      await deleteInvoiceClient(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      toast.success("Invoice deleted");
      router.refresh();
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyInvoiceId(null);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
              All customers
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {clientDisplayName(client)}
            </h1>
            {client.company && client.name ? (
              <p className="text-muted-foreground">{client.name}</p>
            ) : null}
            <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
              {client.email ? <p>{client.email}</p> : null}
              {client.phone ? <p>{client.phone}</p> : null}
              {client.address ? <p>{client.address}</p> : null}
              {client.gstin ? <p>GSTIN: {client.gstin}</p> : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadStatement}
            disabled={downloading || invoices.length === 0}
            className="gap-2"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            Download statement
          </Button>
          <Button asChild className="gap-2">
            <Link href="/create-invoice">
              <PlusCircle className="h-4 w-4" />
              New invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total invoiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatMoney(summary.totalInvoiced, currencyCode)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatMoney(summary.totalPaid, currencyCode)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatMoney(summary.totalOutstanding, currencyCode)}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Invoices</h2>
          <p className="text-sm text-muted-foreground">
            {invoices.length} invoice{invoices.length === 1 ? "" : "s"}
          </p>
        </div>

        {invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices for this customer"
            description="Create an invoice and link it to this customer from the invoice editor."
            actionLabel="Create invoice"
            actionHref="/create-invoice"
          />
        ) : (
          <InvoiceTable
            invoices={invoices}
            onDelete={handleDelete}
            busyInvoiceId={busyInvoiceId}
            busyAction={busyInvoiceId ? "delete" : null}
            currencyCode={currencyCode}
          />
        )}
      </section>
    </PageTransition>
  );
}
