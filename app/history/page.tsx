"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { InvoiceTable } from "@/components/invoice-table";
import { PageTransition } from "@/components/page-transition";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoices } from "@/hooks/use-invoices";
import { deriveInvoiceStatus } from "@/lib/calculations";
import type { InvoiceStatus } from "@/types/invoice";
import { History } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const { invoices, loading, remove } = useInvoices();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const status = deriveInvoiceStatus(inv.status, inv.invoice.dueDate);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
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

  const handleDelete = (id: string) => {
    remove(id);
    toast.success("Invoice deleted");
  };

  return (
    <PageTransition className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Invoice History</h2>
        <p className="text-muted-foreground">
          Search, filter, and manage saved invoices
        </p>
      </div>

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
          onValueChange={(v) =>
            setStatusFilter(v as InvoiceStatus | "all")
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
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
          actionHref={invoices.length === 0 ? "/create" : undefined}
        />
      ) : (
        <InvoiceTable invoices={filtered} onDelete={handleDelete} />
      )}
    </PageTransition>
  );
}
