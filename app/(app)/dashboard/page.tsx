"use client";

import { useMemo, useState } from "react";
import { ArrowRight, FileText, Receipt, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/nav-link";
import { AnalyticsCard } from "@/components/analytics-card";
import { EmptyState } from "@/components/empty-state";
import { InvoiceTable } from "@/components/invoice-table";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices } from "@/hooks/use-invoices";
import { useProfile } from "@/hooks/use-profile";
import { useTranslation } from "@/components/locale-provider";
import { updateInvoiceStatusClient } from "@/lib/api/invoices-client";
import { computeDashboardStats } from "@/lib/dashboard-stats";
import { getCurrencySymbol } from "@/lib/currency";

export default function DashboardPage() {
  const { invoices, loading, remove, refresh } = useInvoices();
  const { settings } = useProfile();
  const { t } = useTranslation();
  const [busyInvoiceId, setBusyInvoiceId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"paid" | "void" | "delete" | null>(
    null
  );

  const stats = useMemo(
    () => computeDashboardStats(invoices, settings.currencyCode),
    [invoices, settings.currencyCode]
  );

  const recent = invoices.slice(0, 5);
  const symbol = getCurrencySymbol(stats.currencyCode);

  const handleDelete = async (id: string) => {
    setBusyInvoiceId(id);
    setBusyAction("delete");
    try {
      await remove(id);
      toast.success(t("dashboard.invoiceDeleted"));
    } catch (err) {
      toast.error(t("dashboard.deleteFailed"), {
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
      await updateInvoiceStatusClient(id, "paid");
      await refresh();
      toast.success(t("dashboard.markedPaid"));
    } catch (err) {
      toast.error(t("dashboard.markPaidFailed"), {
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
      await updateInvoiceStatusClient(id, "void");
      await refresh();
      toast.success(t("dashboard.voided"));
    } catch (err) {
      toast.error(t("dashboard.voidFailed"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusyInvoiceId(null);
      setBusyAction(null);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("dashboard.title")}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <NavLink href="/create-invoice" showSpinner={false}>
            {t("dashboard.newInvoice")}
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            title={t("dashboard.totalInvoices")}
            value={stats.totalInvoices}
            icon={FileText}
            gradient="from-primary to-primary/80"
          />
          <AnalyticsCard
            title={t("dashboard.paid")}
            value={stats.paidInvoices}
            icon={Receipt}
            gradient="from-foreground to-foreground/80"
            iconClassName="text-background"
          />
          <AnalyticsCard
            title={t("dashboard.pending")}
            value={stats.pendingAmount}
            icon={Wallet}
            prefix={symbol}
            decimals={0}
            gradient="from-primary/90 to-primary/70"
          />
          <AnalyticsCard
            title={t("dashboard.revenue")}
            value={stats.totalRevenue}
            icon={TrendingUp}
            prefix={symbol}
            decimals={0}
            gradient="from-primary to-primary/75"
          />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">
            {t("dashboard.recentInvoices")}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="h-8 text-muted-foreground">
            <NavLink href="/invoice-history" showSpinner={false}>
              {t("dashboard.viewAll")}
            </NavLink>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t("dashboard.emptyTitle")}
              description={t("dashboard.emptyDescription")}
              actionLabel={t("nav.createInvoice")}
              actionHref="/create-invoice"
            />
          ) : (
            <InvoiceTable
              invoices={recent}
              onDelete={handleDelete}
              onMarkPaid={handleMarkPaid}
              onVoid={handleVoid}
              busyInvoiceId={busyInvoiceId}
              busyAction={busyAction}
              currencyCode={stats.currencyCode}
            />
          )}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
