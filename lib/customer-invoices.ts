import type { Invoice } from "@/types/invoice";
import { deriveInvoiceStatus, getInvoiceTotals } from "@/lib/calculations";
import type { SavedClient } from "@/lib/client-mapper";

export type ClientSummary = SavedClient & {
  invoiceCount: number;
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  lastInvoiceDate: string | null;
};

/** Match invoices saved with client_id or legacy snapshot data. */
export function invoiceBelongsToClient(
  invoice: Invoice,
  client: SavedClient
): boolean {
  if (invoice.clientId) {
    return invoice.clientId === client.id;
  }

  const invoiceName = invoice.client.name.trim().toLowerCase();
  const clientName = client.name.trim().toLowerCase();
  if (!invoiceName || invoiceName !== clientName) return false;

  const invoiceEmail = invoice.client.email.trim().toLowerCase();
  const clientEmail = client.email.trim().toLowerCase();
  if (clientEmail && invoiceEmail) {
    return invoiceEmail === clientEmail;
  }

  return true;
}

export function getInvoicesForClient(
  client: SavedClient,
  invoices: Invoice[]
): Invoice[] {
  return invoices
    .filter((invoice) => invoiceBelongsToClient(invoice, client))
    .sort(
      (a, b) =>
        new Date(b.invoice.invoiceDate).getTime() -
        new Date(a.invoice.invoiceDate).getTime()
    );
}

export function summarizeClient(
  client: SavedClient,
  invoices: Invoice[]
): ClientSummary {
  const clientInvoices = getInvoicesForClient(client, invoices);

  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;
  let lastInvoiceDate: string | null = null;

  for (const invoice of clientInvoices) {
    const { total } = getInvoiceTotals(invoice);
    totalInvoiced += total;

    const status = deriveInvoiceStatus(
      invoice.status,
      invoice.invoice.dueDate
    );
    if (status === "paid") {
      totalPaid += total;
    } else if (status !== "void") {
      totalOutstanding += total;
    }

    if (
      !lastInvoiceDate ||
      invoice.invoice.invoiceDate > lastInvoiceDate
    ) {
      lastInvoiceDate = invoice.invoice.invoiceDate;
    }
  }

  return {
    ...client,
    invoiceCount: clientInvoices.length,
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    lastInvoiceDate,
  };
}

export function clientDisplayName(client: SavedClient): string {
  if (client.company) return client.company;
  return client.name;
}
