"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Circle,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useTranslation } from "@/components/locale-provider";
import { demoInvoice } from "@/data/demo-invoice";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const InvoicePreviewFrame = dynamic(
  () =>
    import("@/components/invoice-preview-frame").then((m) => ({
      default: m.InvoicePreviewFrame,
    })),
  { loading: () => <Skeleton className="h-[260px] w-full rounded-md" /> }
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice-preview").then((m) => ({
      default: m.InvoicePreview,
    })),
  { loading: () => <Skeleton className="h-[260px] w-full rounded-md" /> }
);

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Invoices", icon: FileText, active: false },
  { label: "Clients", icon: Users, active: false },
  { label: "Payments", icon: CreditCard, active: false },
] as const;

const ROWS = [
  { client: "Ellery Studio", number: "INV-1042", amount: "$4,200", status: "Paid" },
  { client: "Northline Co.", number: "INV-1041", amount: "$2,150", status: "Sent" },
  { client: "Mira & Field", number: "INV-1040", amount: "$980", status: "Draft" },
] as const;

/** Browser-framed workspace mock with a live invoice document floating over it. */
export function HeroInvoiceDemo() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,oklch(0.11_0_0/0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,oklch(0.985_0_0/0.08),transparent_70%)]"
        aria-hidden
      />

      <motion.figure
        initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.975 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.16, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_90px_-30px_rgba(0,0,0,0.35)]"
      >
        <figcaption className="sr-only">{t("landing.hero.demoLabel")}</figcaption>

        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3.5 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden>
            <Circle className="h-2.5 w-2.5 fill-foreground/20 text-foreground/20" />
            <Circle className="h-2.5 w-2.5 fill-foreground/15 text-foreground/15" />
            <Circle className="h-2.5 w-2.5 fill-foreground/10 text-foreground/10" />
          </div>
          <div className="mx-auto hidden max-w-[65%] flex-1 items-center justify-center rounded-md border border-border/70 bg-background px-3 py-1 text-[10px] text-muted-foreground sm:flex">
            app.invoiceforfreelance.com
          </div>
          <span className="eyebrow text-[8px] text-muted-foreground sm:hidden">
            Workspace
          </span>
        </div>

        <div className="grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[132px_minmax(0,1fr)]">
          {/* Mini sidebar */}
          <aside className="hidden border-r border-border bg-muted/25 p-3 sm:block">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-foreground text-[8px] font-bold text-background">
                IF
              </span>
              <span className="text-[9px] font-semibold tracking-tight">
                Freelance
              </span>
            </div>
            <nav className="mt-5 space-y-0.5">
              {SIDEBAR_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[9px]",
                    item.active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </div>
              ))}
            </nav>
            <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-3 text-[9px] text-muted-foreground">
              <Settings className="h-3 w-3" />
              Settings
            </div>
          </aside>

          {/* Mini workspace */}
          <div className="min-w-0 p-3.5 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow text-[7px] text-muted-foreground">
                  Workspace
                </p>
                <h3 className="display-serif mt-0.5 text-lg leading-none sm:text-xl">
                  Invoices
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-1.5 text-[8px] font-medium text-background">
                <Plus className="h-2.5 w-2.5" />
                New invoice
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                ["Paid", "$12.4k"],
                ["Outstanding", "$3.8k"],
                ["Drafts", "04"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-border/70 bg-background p-2"
                >
                  <p className="text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold tabular-nums sm:text-xs">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 overflow-hidden rounded-md border border-border/70">
              <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-border/70 bg-muted/40 px-2.5 py-1.5 text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>Client</span>
                <span>Status</span>
              </div>
              {ROWS.map((row) => (
                <div
                  key={row.number}
                  className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-border/50 px-2.5 py-2 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-medium">{row.client}</p>
                    <p className="font-mono text-[7px] text-muted-foreground">
                      {row.number} · {row.amount}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-1.5 py-0.5 text-[7px] font-medium",
                      row.status === "Paid" &&
                        "border-foreground bg-foreground text-background",
                      row.status === "Sent" &&
                        "border-border text-foreground",
                      row.status === "Draft" &&
                        "border-dashed border-border text-muted-foreground"
                    )}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[7px] text-muted-foreground">
              <span>Showing 3 of 18 invoices</span>
              <span className="inline-flex items-center gap-0.5">
                View all
                <ArrowUpRight className="h-2.5 w-2.5" />
              </span>
            </div>
          </div>
        </div>
      </motion.figure>

      {/* Floating live invoice */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24, rotate: -5 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: -3.5 }}
        transition={{ duration: 0.7, delay: 0.42, ease: EASE_OUT }}
        className="absolute -bottom-12 -left-2 hidden w-[190px] sm:block lg:-left-6 lg:w-[210px]"
      >
        <div className="mb-1.5 flex items-center justify-between px-1">
          <span className="eyebrow text-[7px] text-muted-foreground">
            Live document
          </span>
          <span className="rounded border border-border bg-card px-1 py-0.5 font-mono text-[7px] text-muted-foreground">
            PDF
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]">
          <InvoicePreviewFrame pageSize={demoInvoice.pageSize} maxScale={0.3}>
            <InvoicePreview
              invoice={demoInvoice}
              previewId="hero-invoice-demo"
              showBranding
            />
          </InvoicePreviewFrame>
        </div>
      </motion.div>

      {/* Floating status chip */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: EASE_OUT }}
        className="absolute right-0 top-14 hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-lg md:flex lg:-right-2"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-3 w-3" />
        </span>
        <div>
          <p className="text-[9px] font-semibold leading-none">Payment received</p>
          <p className="mt-0.5 text-[8px] text-muted-foreground">$4,200 · just now</p>
        </div>
      </motion.div>
    </div>
  );
}
