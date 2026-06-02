"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, History } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import {
  InvoiceTable,
  matchesHistoryFilter,
} from "@/components/invoice-table";
import { PageTransition } from "@/components/page-transition";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoices } from "@/hooks/use-invoices";
import { useProfile } from "@/hooks/use-profile";
import { updateInvoiceStatusAction } from "@/lib/actions/invoices";
import { deriveInvoiceStatus } from "@/lib/calculations";
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

type StatusFilter = InvoiceStatus | "all" | "unpaid";

const QUICK_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export default function InvoiceHistoryPage() {
  const { invoices, loading, remove, refresh } = useInvoices();
  const { settings } = useProfile();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const status = deriveInvoiceStatus(inv.status, inv.invoice.dueDate);
      const matchesStatus = matchesHistoryFilter(status, statusFilter);
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        inv.client.name.toLowerCase().includes(q) ||
        inv.client.company.toLowerCase().includes(q) ||
        inv.invoice.invoiceNumber.toLowerCase().includes(q) ||
        inv.client.email.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [invoices, search, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Invoice deleted");
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleMarkPaid = async (id: string) => {
    setMarkingPaidId(id);
    try {
      await updateInvoiceStatusAction(id, "paid");
      await refresh();
      toast.success("Invoice marked as paid");
    } catch (err) {
      toast.error("Could not update status", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setMarkingPaidId(null);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoice History</h2>
          <p className="text-muted-foreground">
            View invoices read-only, edit unpaid ones, or mark them paid
          </p>
        </div>
        <Button asChild className="gap-2 sm:self-auto">
          <Link href="/create-invoice">
            Create Invoice
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by client, company, or invoice #…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="unpaid">Unpaid (all)</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={statusFilter === f.value ? "default" : "outline"}
              className={cn(
                f.value === "paid" &&
                  statusFilter === "paid" &&
                  "bg-emerald-600 hover:bg-emerald-600",
                f.value === "pending" &&
                  statusFilter === "pending" &&
                  "bg-amber-600 hover:bg-amber-600"
              )}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title={invoices.length === 0 ? "No saved invoices" : "No matches found"}
          description={
            invoices.length === 0
              ? "Invoices you save will appear here for quick access."
              : "Try adjusting your search or filter."
          }
          actionLabel={invoices.length === 0 ? "Create Invoice" : undefined}
          actionHref={invoices.length === 0 ? "/create-invoice" : undefined}
        />
      ) : (
        <InvoiceTable
          invoices={filtered}
          onDelete={handleDelete}
          onMarkPaid={handleMarkPaid}
          markingPaidId={markingPaidId}
          currencyCode={settings.currencyCode}
        />
      )}
    </PageTransition>
  );
}
