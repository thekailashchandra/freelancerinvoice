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
import { fetchActivityLogsClient } from "@/lib/api/superadmin-client";
import type { ActivityLogRow, Paginated } from "@/types/superadmin";

const ACTION_FILTERS = [
  "all",
  "user.signup",
  "invoice.created",
  "invoice.updated",
  "invoice.deleted",
  "invoice.status_changed",
  "invoice.pdf_downloaded",
  "invoice.receipt_downloaded",
  "payment.completed",
  "payment.failed",
  "superadmin.view",
] as const;

function formatAction(action: string): string {
  return action.replace(/\./g, " · ");
}

export default function SuperadminActivityPage() {
  const [data, setData] = useState<Paginated<ActivityLogRow> | null>(null);
  const [action, setAction] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchActivityLogsClient({
          page,
          action: action === "all" ? undefined : action,
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
  }, [page, action]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signups, invoice actions, PDF downloads, and payments.
          </p>
        </div>
        <Select
          value={action}
          onValueChange={(value) => {
            setAction(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter action" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_FILTERS.map((value) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "All actions" : formatAction(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Resource</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((row) => (
                    <tr key={row.id} className="border-b border-border/70 align-top">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatAction(row.action)}
                      </td>
                      <td className="px-4 py-3">{row.actorEmail ?? "—"}</td>
                      <td className="px-4 py-3">
                        {row.resourceType ?? "—"}
                        {row.resourceId ? (
                          <p className="font-mono text-xs text-muted-foreground">
                            {row.resourceId}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {Object.keys(row.metadata).length > 0 ? (
                          <pre className="max-w-xs overflow-x-auto rounded bg-muted p-2 text-xs">
                            {JSON.stringify(row.metadata, null, 2)}
                          </pre>
                        ) : (
                          "—"
                        )}
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
          {data ? `${data.total} events total` : ""}
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
