"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { PageTransition } from "@/components/page-transition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/use-customers";
import { useProfile } from "@/hooks/use-profile";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { clientDisplayName, type ClientSummary } from "@/lib/customer-invoices";

type CustomersPageClientProps = {
  initialSummaries?: ClientSummary[];
  currencyCode?: string;
};

export function CustomersPageClient({
  initialSummaries,
  currencyCode: currencyCodeProp,
}: CustomersPageClientProps) {
  const { summaries, loading, error, refresh } = useCustomers();
  const { settings } = useProfile();
  const [search, setSearch] = useState("");

  const initialSummariesList = initialSummaries ?? summaries;
  const currencyCode = currencyCodeProp ?? settings.currencyCode ?? "USD";
  const showLoading = loading && initialSummariesList.length === 0;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return initialSummariesList;
    return initialSummariesList.filter((client) => {
      const haystack = [
        client.name,
        client.company,
        client.email,
        client.phone,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [initialSummariesList, search]);

  if (showLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View saved customers, their invoices, and download statements.
          </p>
        </div>
        <Button asChild>
          <Link href="/create-invoice">Create invoice</Link>
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}{" "}
          <button
            type="button"
            className="font-medium underline"
            onClick={() => void refresh()}
          >
            Retry
          </button>
        </p>
      ) : null}

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          placeholder="Search customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={initialSummariesList.length === 0 ? "No customers yet" : "No matches"}
          description={
            initialSummariesList.length === 0
              ? "Add customers while creating an invoice, then manage them here."
              : "Try a different name, email, or company."
          }
          actionLabel={initialSummariesList.length === 0 ? "Create invoice" : undefined}
          actionHref={initialSummariesList.length === 0 ? "/create-invoice" : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <CustomerCard
              key={client.id}
              client={client}
              currencyCode={currencyCode}
            />
          ))}
        </div>
      )}
    </PageTransition>
  );
}

function CustomerCard({
  client,
  currencyCode,
}: {
  client: ClientSummary;
  currencyCode: string;
}) {
  return (
    <Link
      href={`/customers/${client.id}`}
      className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{clientDisplayName(client)}</p>
          {client.company && client.name ? (
            <p className="truncate text-sm text-muted-foreground">{client.name}</p>
          ) : null}
          {client.email ? (
            <p className="truncate text-sm text-muted-foreground">{client.email}</p>
          ) : null}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Invoices</dt>
          <dd className="font-medium">{client.invoiceCount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Balance due</dt>
          <dd className="font-medium tabular-nums">
            {formatMoney(client.totalOutstanding, currencyCode)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Last invoice</dt>
          <dd className="font-medium">
            {client.lastInvoiceDate
              ? formatDate(client.lastInvoiceDate)
              : "—"}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
