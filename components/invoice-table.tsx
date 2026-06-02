"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { getInvoiceTotals, deriveInvoiceStatus } from "@/lib/calculations";
import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onMarkPaid?: (id: string) => Promise<void>;
  markingPaidId?: string | null;
  currencyCode?: string;
}

export function InvoiceTable({
  invoices,
  onDelete,
  onMarkPaid,
  markingPaidId = null,
  currencyCode = "USD",
}: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Invoice
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Client
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, i) => {
              const { total } = getInvoiceTotals(invoice);
              const status = deriveInvoiceStatus(
                invoice.status,
                invoice.invoice.dueDate
              );
              const isPaid = status === "paid";
              const canMarkPaid =
                !isPaid && status !== "draft" && Boolean(onMarkPaid);
              const isMarking = markingPaidId === invoice.id;

              return (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={
                    isPaid
                      ? "border-b border-border/30 bg-emerald-500/[0.03] transition-colors hover:bg-emerald-500/[0.06]"
                      : "border-b border-border/30 transition-colors hover:bg-amber-500/[0.04]"
                  }
                >
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                    {invoice.invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {invoice.client.name || "Unnamed client"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.client.company}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {formatDate(invoice.invoice.invoiceDate)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatMoney(total, currencyCode)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="View invoice"
                      >
                        <Link href={`/invoice-history/${invoice.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>

                      {!isPaid && (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit invoice"
                        >
                          <Link href={`/create-invoice?id=${invoice.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                      )}

                      {canMarkPaid && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-600 hover:text-emerald-600"
                          title="Mark as paid"
                          disabled={isMarking}
                          onClick={() => onMarkPaid?.(invoice.id)}
                        >
                          {isMarking ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Mark as paid</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                        onClick={() => onDelete(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function matchesHistoryFilter(
  status: InvoiceStatus,
  filter: InvoiceStatus | "all" | "unpaid"
): boolean {
  if (filter === "all") return true;
  if (filter === "unpaid") return status !== "paid";
  return status === filter;
}
