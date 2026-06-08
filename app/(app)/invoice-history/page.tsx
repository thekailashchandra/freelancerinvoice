"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Search, History } from "lucide-react";
import { NavLink } from "@/components/nav-link";
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
import { useInvoices } from "@/hooks/use-invoices";
import { useProfile } from "@/hooks/use-profile";
import { updateInvoiceStatusAction } from "@/lib/actions/invoices";
import { deriveInvoiceStatus } from "@/lib/calculations";
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

type StatusFilter = InvoiceStatus | "all" | "unpaid";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "void", label: "Void" },
];

export default function InvoiceHistoryPage() {
  const { invoices, loading, remove, refresh } = useInvoices();
  const { settings } = useProfile();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [busyInvoiceId, setBusyInvoiceId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"paid" | "void" | "delete" | null>(
    null
  );

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
    setBusyInvoiceId(id);
    setBusyAction("delete");
    try {
      await remove(id);
      toast.success("Invoice deleted");
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyInvoiceId(null);
      setBusyAction(null);
    }
  };

  const handleMarkPaid = async (id: string) => {
    setBusyInvoiceId(id);
    setBusyAction("paid");
    try {
      await updateInvoiceStatusAction(id, "paid");
      await refresh();
      toast.success("Invoice marked as paid");
    } catch (err) {
      toast.error("Could not mark as paid", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyInvoiceId(null);
      setBusyAction(null);
    }
  };

  const handleVoid = async (id: string) => {
    setBusyInvoiceId(id);
    setBusyAction("void");
    try {
      await updateInvoiceStatusAction(id, "void");
      await refresh();
      toast.success("Invoice voided");
    } catch (err) {
      toast.error("Could not void invoice", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyInvoiceId(null);
      setBusyAction(null);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Invoice history
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {invoices.length} saved invoice{invoices.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <NavLink href="/create-invoice" showSpinner={false}>
            New invoice
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search client or invoice #"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={statusFilter === f.value ? "default" : "outline"}
              className={cn(
                "shrink-0 rounded-full",
                f.value === "paid" &&
                  statusFilter === "paid" &&
                  "bg-emerald-600 hover:bg-emerald-600",
                f.value === "overdue" &&
                  statusFilter === "overdue" &&
                  "bg-destructive hover:bg-destructive",
                f.value === "void" &&
                  statusFilter === "void" &&
                  "bg-zinc-600 hover:bg-zinc-600"
              )}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title={invoices.length === 0 ? "No saved invoices" : "No matches"}
          description={
            invoices.length === 0
              ? "Invoices you save will appear here."
              : "Try a different search or filter."
          }
          actionLabel={invoices.length === 0 ? "Create invoice" : undefined}
          actionHref={invoices.length === 0 ? "/create-invoice" : undefined}
        />
      ) : (
        <InvoiceTable
          invoices={filtered}
          onDelete={handleDelete}
          onMarkPaid={handleMarkPaid}
          onVoid={handleVoid}
          busyInvoiceId={busyInvoiceId}
          busyAction={busyAction}
          currencyCode={settings.currencyCode}
        />
      )}
    </PageTransition>
  );
}
