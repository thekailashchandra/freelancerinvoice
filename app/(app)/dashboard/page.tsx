"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";
import { EmptyState } from "@/components/empty-state";
import { InvoiceTable } from "@/components/invoice-table";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvoices } from "@/hooks/use-invoices";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { getCurrencySymbol } from "@/lib/currency";

export default function DashboardPage() {
  const { invoices, loading: invoicesLoading, remove } = useInvoices();
  const { stats, loading: statsLoading } = useDashboardStats();
  const loading = invoicesLoading || statsLoading;
  const recent = invoices.slice(0, 5);
  const symbol = getCurrencySymbol(stats.currencyCode);

  return (
    <PageTransition className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Welcome back to{" "}
            <span className="gradient-text">Invoice for Freelance</span>
          </motion.h2>
          <p className="mt-1 text-muted-foreground">
            Your invoice overview at a glance
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/create-invoice">
            Create Invoice
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={FileText}
            gradient="from-amber-500 to-orange-500"
            delay={0}
          />
          <AnalyticsCard
            title="Paid Invoices"
            value={stats.paidInvoices}
            icon={Receipt}
            gradient="from-emerald-500 to-teal-500"
            delay={0.05}
          />
          <AnalyticsCard
            title="Pending Amount"
            value={stats.pendingAmount}
            icon={Wallet}
            prefix={symbol}
            decimals={0}
            gradient="from-amber-500 to-orange-500"
            delay={0.1}
          />
          <AnalyticsCard
            title="Total Revenue"
            value={stats.totalRevenue}
            icon={TrendingUp}
            prefix={symbol}
            decimals={0}
            gradient="from-yellow-500 to-amber-500"
            delay={0.15}
          />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoice-history">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices yet"
              description="Create your first professional invoice. Everything syncs to your cloud account."
              actionLabel="Create Invoice"
              actionHref="/create-invoice"
            />
          ) : (
            <InvoiceTable
              invoices={recent}
              onDelete={remove}
              currencyCode={stats.currencyCode}
            />
          )}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
