"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { getInvoiceTotals } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { deriveInvoiceStatus } from "@/lib/calculations";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDelete: (id: string) => void;
}

export function InvoiceTable({ invoices, onDelete }: InvoiceTableProps) {
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

              return (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/30 transition-colors hover:bg-accent/20"
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
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/create?id=${invoice.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
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
