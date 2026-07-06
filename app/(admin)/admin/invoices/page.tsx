"use client";

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { fetchAdminInvoicesClient } from "@/lib/api/superadmin-client";
import type { AdminInvoiceRow, Paginated } from "@/types/superadmin";
import type { InvoiceStatus } from "@/types/invoice";

const STATUSES: Array<InvoiceStatus | "all"> = [
  "all",
  "draft",
  "pending",
  "sent",
  "paid",
  "overdue",
  "void",
];

export default function SuperadminInvoicesPage() {
  const [data, setData] = useState<Paginated<AdminInvoiceRow> | null>(null);
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchAdminInvoicesClient({
          page,
          status: status === "all" ? undefined : status,
        });
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every invoice across all users.
          </p>
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All statuses" : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Currency</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/70">
                      <td className="px-4 py-3 font-medium">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p>{invoice.companyName || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.userEmail}
                        </p>
                      </td>
                      <td className="px-4 py-3">{invoice.clientName || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={invoice.status as InvoiceStatus} />
                      </td>
                      <td className="px-4 py-3">{invoice.currencyCode}</td>
                      <td className="px-4 py-3">
                        {new Date(invoice.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} invoices total` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
