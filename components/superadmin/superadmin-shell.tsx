"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

export function SuperadminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-muted-foreground">
                Platform analytics & operations
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Back to app</Link>
          </Button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

export function SuperadminSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TrendBars({
  data,
  colorClass = "bg-primary",
}: {
  data: { date: string; count: number }[];
  colorClass?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-32 items-end gap-1.5">
      {data.map((point) => (
        <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            className={cn("w-full rounded-t-md transition-all", colorClass)}
            style={{ height: `${Math.max(8, (point.count / max) * 100)}%` }}
            title={`${point.date}: ${point.count}`}
          />
          <span className="text-[10px] text-muted-foreground">
            {point.date.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ExternalAnalyticsPanel({
  umamiConfigured,
  umamiStats,
  umamiDashboardUrl,
  gaConfigured,
  gaDashboardUrl,
  gaMeasurementId,
}: {
  umamiConfigured: boolean;
  umamiStats: {
    pageviews: number;
    visitors: number;
    visits: number;
  } | null;
  umamiDashboardUrl: string | null;
  gaConfigured: boolean;
  gaDashboardUrl: string | null;
  gaMeasurementId: string | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Umami (open source)</h3>
        </div>
        {umamiConfigured && umamiStats ? (
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Pageviews</p>
              <p className="text-xl font-semibold">{umamiStats.pageviews}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Visitors</p>
              <p className="text-xl font-semibold">{umamiStats.visitors}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Visits</p>
              <p className="text-xl font-semibold">{umamiStats.visits}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Set UMAMI_API_URL, UMAMI_WEBSITE_ID, and UMAMI_USERNAME +
            UMAMI_PASSWORD (self-hosted) or UMAMI_API_TOKEN (Umami Cloud) to
            pull traffic stats here.
          </p>
        )}
        {umamiDashboardUrl ? (
          <Button asChild variant="link" className="mt-2 h-auto px-0">
            <a href={umamiDashboardUrl} target="_blank" rel="noreferrer">
              Open Umami dashboard
            </a>
          </Button>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Google Analytics 4</h3>
        </div>
        {gaConfigured ? (
          <p className="text-sm text-muted-foreground">
            Measurement ID:{" "}
            <span className="font-mono text-foreground">{gaMeasurementId}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Set NEXT_PUBLIC_GA_MEASUREMENT_ID to enable site traffic tracking.
          </p>
        )}
        {gaDashboardUrl ? (
          <Button asChild variant="link" className="mt-2 h-auto px-0">
            <a href={gaDashboardUrl} target="_blank" rel="noreferrer">
              Open GA4 dashboard
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
