import { deriveInvoiceStatus, getInvoiceTotals } from "@/lib/calculations";
import type { DashboardStats, Invoice, InvoiceStatus } from "@/types/invoice";

type StatsAccumulator = {
  paidInvoices: number;
  pendingAmount: number;
  totalRevenue: number;
};

/** Whether an invoice total should count toward the dashboard "Pending" card. */
export function countsTowardPendingAmount(
  status: InvoiceStatus,
  dueDate: string
): boolean {
  const display = deriveInvoiceStatus(status, dueDate);
  return display !== "paid" && display !== "void" && display !== "draft";
}

export function applyInvoiceToDashboardStats(
  acc: StatsAccumulator,
  total: number,
  status: InvoiceStatus,
  dueDate: string
): void {
  const display = deriveInvoiceStatus(status, dueDate);

  if (display === "paid") {
    acc.paidInvoices += 1;
    acc.totalRevenue += total;
    return;
  }

  if (countsTowardPendingAmount(status, dueDate)) {
    acc.pendingAmount += total;
  }
}

export function computeDashboardStats(
  invoices: Invoice[],
  currencyCode: string
): DashboardStats {
  const acc: StatsAccumulator = {
    paidInvoices: 0,
    pendingAmount: 0,
    totalRevenue: 0,
  };

  for (const invoice of invoices) {
    const { total } = getInvoiceTotals(invoice);
    applyInvoiceToDashboardStats(
      acc,
      total,
      invoice.status,
      invoice.invoice.dueDate
    );
  }

  return {
    totalInvoices: invoices.length,
    ...acc,
    currencyCode,
  };
}
