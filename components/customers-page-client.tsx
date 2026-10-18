"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { PageFaqSection } from "@/components/page-faq-section";
import { PageTransition } from "@/components/page-transition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/hooks/use-customers";
import { useProfile } from "@/hooks/use-profile";
import { useTranslation } from "@/components/locale-provider";
import { deleteClientClient } from "@/lib/api/app-client";
import { confirmDeleteCustomer } from "@/lib/customer-delete";
import { customerFaqs } from "@/data/customer-faqs";
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
  const router = useRouter();
  const { summaries, loading, error, refresh } = useCustomers();
  const { settings } = useProfile();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDeleteCustomer = async (client: ClientSummary) => {
    const label = clientDisplayName(client);
    if (!confirmDeleteCustomer(label, client.invoiceCount)) return;

    setDeletingId(client.id);
    try {
      await deleteClientClient(client.id);
      toast.success(t("customers.deleted"));
      await refresh();
      router.refresh();
    } catch (err) {
      toast.error(t("customers.deleteFailed"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setDeletingId(null);
    }
  };

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
          <h1 className="text-2xl font-semibold tracking-tight">{t("customers.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("customers.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/create-invoice">{t("customers.createInvoice")}</Link>
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
          placeholder={t("customers.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            initialSummariesList.length === 0
              ? t("customers.emptyTitle")
              : t("customers.emptyMatches")
          }
          description={
            initialSummariesList.length === 0
              ? t("customers.emptyDescription")
              : t("customers.emptySearch")
          }
          actionLabel={
            initialSummariesList.length === 0 ? t("customers.createInvoice") : undefined
          }
          actionHref={initialSummariesList.length === 0 ? "/create-invoice" : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <CustomerCard
              key={client.id}
              client={client}
              currencyCode={currencyCode}
              deleting={deletingId === client.id}
              onDelete={() => void handleDeleteCustomer(client)}
            />
          ))}
        </div>
      )}

      <PageFaqSection
        faqItems={customerFaqs}
        heading={t("customers.helpTitle")}
        includeSchema={false}
      />
    </PageTransition>
  );
}

function CustomerCard({
  client,
  currencyCode,
  deleting,
  onDelete,
}: {
  client: ClientSummary;
  currencyCode: string;
  deleting: boolean;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/20">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/customers/${client.id}`} className="min-w-0 flex-1">
          <p className="truncate font-semibold">{clientDisplayName(client)}</p>
          {client.company && client.name ? (
            <p className="truncate text-sm text-muted-foreground">{client.name}</p>
          ) : null}
          {client.email ? (
            <p className="truncate text-sm text-muted-foreground">{client.email}</p>
          ) : null}
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            disabled={deleting}
            aria-label={`Delete ${clientDisplayName(client)}`}
            onClick={onDelete}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
          <Link
            href={`/customers/${client.id}`}
            className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            aria-label={`View ${clientDisplayName(client)}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Link href={`/customers/${client.id}`} className="block">
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">{t("customers.invoices")}</dt>
            <dd className="font-medium">{client.invoiceCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("customers.balanceDue")}</dt>
            <dd className="font-medium tabular-nums">
              {formatMoney(client.totalOutstanding, currencyCode)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t("customers.lastInvoice")}</dt>
            <dd className="font-medium">
              {client.lastInvoiceDate
                ? formatDate(client.lastInvoiceDate)
                : "-"}
            </dd>
          </div>
        </dl>
      </Link>
    </div>
  );
}
