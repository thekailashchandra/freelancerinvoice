"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  IndianRupee,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";
import { PageTransition } from "@/components/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalAnalyticsPanel,
  SuperadminSection,
  TrendBars,
} from "@/components/superadmin/superadmin-shell";
import {
  fetchActivityLogsClient,
  fetchExternalAnalyticsClient,
  fetchPlatformStatsClient,
} from "@/lib/api/superadmin-client";
import type { ActivityLogRow, PlatformStats } from "@/types/superadmin";
import type { ExternalAnalytics } from "@/types/superadmin";
import { countryFlagEmoji } from "@/lib/i18n/country-locale";

function formatAction(action: string): string {
  return action.replace(/\./g, " · ");
}

export default function SuperadminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [analytics, setAnalytics] = useState<ExternalAnalytics | null>(null);
  const [recent, setRecent] = useState<ActivityLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, analyticsData, activityData] = await Promise.all([
          fetchPlatformStatsClient(),
          fetchExternalAnalyticsClient(),
          fetchActivityLogsClient({ page: 1 }),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setAnalytics(analyticsData);
          setRecent(activityData.items.slice(0, 8));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <PageTransition className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </PageTransition>
    );
  }

  if (error || !stats) {
    return (
      <PageTransition>
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {error ?? "Could not load platform stats."}
          </CardContent>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live metrics from your database plus optional Umami and GA4 traffic analytics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          title="Total users"
          value={stats.totalUsers}
          icon={Users}
          gradient="from-foreground to-foreground/70"
        />
        <AnalyticsCard
          title="Invoices created"
          value={stats.totalInvoices}
          icon={FileText}
          gradient="from-foreground/80 to-foreground/50"
        />
        <AnalyticsCard
          title="Invoices paid"
          value={stats.invoicesPaid}
          icon={Wallet}
          gradient="from-foreground to-foreground/75"
        />
        <AnalyticsCard
          title="PDF downloads"
          value={stats.pdfDownloads}
          icon={Download}
          gradient="from-foreground/90 to-foreground/60"
        />
        <AnalyticsCard
          title="Receipt downloads"
          value={stats.receiptDownloads}
          icon={Receipt}
          gradient="from-foreground to-foreground/65"
        />
        <AnalyticsCard
          title="Signups (7d)"
          value={stats.signupsLast7Days}
          icon={TrendingUp}
          gradient="from-foreground/85 to-foreground/55"
        />
        <AnalyticsCard
          title="Active users (30d)"
          value={stats.activeUsersLast30Days}
          icon={Users}
          gradient="from-foreground to-foreground/70"
        />
        <AnalyticsCard
          title="Razorpay revenue"
          value={stats.paymentsTotalInr}
          icon={IndianRupee}
          prefix="₹"
          decimals={0}
          gradient="from-foreground to-foreground/80"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoices created (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendBars data={stats.invoiceTrend} colorClass="bg-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New signups (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendBars data={stats.signupTrend} colorClass="bg-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <SuperadminSection title="Traffic analytics">
        <ExternalAnalyticsPanel
          umamiConfigured={analytics?.umami.configured ?? false}
          umamiStats={analytics?.umami.stats ?? null}
          umamiDashboardUrl={analytics?.umami.dashboardUrl ?? null}
          gaConfigured={analytics?.ga4.configured ?? false}
          gaDashboardUrl={analytics?.ga4.dashboardUrl ?? null}
          gaMeasurementId={analytics?.ga4.measurementId ?? null}
        />
      </SuperadminSection>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Top countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              stats.topCountries.map((row) => (
                <div
                  key={row.countryCode}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {countryFlagEmoji(row.countryCode)} {row.countryCode}
                  </span>
                  <span className="font-medium">{row.count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Activity will appear here as users create invoices, download PDFs,
                and complete payments.
              </p>
            ) : (
              recent.map((row) => (
                <div
                  key={row.id}
                  className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{formatAction(row.action)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.actorEmail ?? "System"}
                      {row.resourceId ? ` · ${row.resourceId.slice(0, 8)}…` : ""}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(row.createdAt).toLocaleString()}
                  </time>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
