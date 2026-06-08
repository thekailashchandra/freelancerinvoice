"use client";

import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { getInvoiceTotals, deriveInvoiceStatus } from "@/lib/calculations";
import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";
import { StatusBadge } from "@/components/status-badge";
import { InvoiceActionsMenu } from "@/components/invoice-actions-menu";

type BusyAction = "paid" | "void" | "delete" | null;

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => void | Promise<void>;
  onMarkPaid?: (id: string) => void | Promise<void>;
  onVoid?: (id: string) => void | Promise<void>;
  busyInvoiceId?: string | null;
  busyAction?: BusyAction;
  currencyCode?: string;
}

export function InvoiceTable({
  invoices,
  onDelete,
  onMarkPaid,
  onVoid,
  busyInvoiceId = null,
  busyAction = null,
  currencyCode = "USD",
}: InvoiceTableProps) {
  return (
    <>
      {/* Mobile: card list */}
      <div className="space-y-2 md:hidden">
        {invoices.map((invoice) => {
          const { total } = getInvoiceTotals(invoice);
          const status = deriveInvoiceStatus(
            invoice.status,
            invoice.invoice.dueDate
          );
          const isBusy = busyInvoiceId === invoice.id;

          return (
            <div
              key={invoice.id}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {invoice.client.name || "Unnamed client"}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {invoice.invoice.invoiceNumber}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="font-medium">
                    {formatMoney(total, currencyCode)}
                  </span>
                  <span className="mx-1.5 text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {formatDate(invoice.invoice.invoiceDate)}
                  </span>
                </div>
                <InvoiceActionsMenu
                  invoice={invoice}
                  displayStatus={status}
                  busyAction={isBusy ? busyAction : null}
                  onMarkPaid={onMarkPaid}
                  onVoid={onVoid}
                  onDelete={onDelete}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Invoice
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Client
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const { total } = getInvoiceTotals(invoice);
                const status = deriveInvoiceStatus(
                  invoice.status,
                  invoice.invoice.dueDate
                );
                const isBusy = busyInvoiceId === invoice.id;

                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {invoice.invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-medium">
                        {invoice.client.name || "Unnamed client"}
                      </p>
                      {invoice.client.company && (
                        <p className="text-xs text-muted-foreground">
                          {invoice.client.company}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDate(invoice.invoice.invoiceDate)}
                    </td>
                    <td className="px-4 py-2.5 font-medium">
                      {formatMoney(total, currencyCode)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <InvoiceActionsMenu
                        invoice={invoice}
                        displayStatus={status}
                        busyAction={isBusy ? busyAction : null}
                        onMarkPaid={onMarkPaid}
                        onVoid={onVoid}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function matchesHistoryFilter(
  status: InvoiceStatus,
  filter: InvoiceStatus | "all" | "unpaid"
): boolean {
  if (filter === "all") return true;
  if (filter === "unpaid") {
    return status !== "paid" && status !== "void";
  }
  return status === filter;
}
