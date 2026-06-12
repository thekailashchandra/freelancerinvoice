import { createClient } from "@/lib/supabase/server";
import { applyInvoiceToDashboardStats } from "@/lib/dashboard-stats";
import type { DashboardStats, InvoiceStatus } from "@/types/invoice";

function itemLineTotal(qty: number, price: number): number {
  return qty * Number(price);
}

const emptyStats: DashboardStats = {
  totalInvoices: 0,
  paidInvoices: 0,
  pendingAmount: 0,
  totalRevenue: 0,
  currencyCode: "USD",
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return emptyStats;

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(
      "id, status, due_date, tax_percent, discount_amount, invoice_items(qty, price)"
    )
    .eq("user_id", user.id);

  if (error || !invoices) return emptyStats;

  const { data: profile } = await supabase
    .from("profiles")
    .select("currency_code")
    .eq("id", user.id)
    .single();

  const acc = {
    paidInvoices: 0,
    pendingAmount: 0,
    totalRevenue: 0,
  };

  for (const inv of invoices) {
    const items = inv.invoice_items ?? [];
    const subtotal = items.reduce(
      (sum, item) => sum + itemLineTotal(item.qty, Number(item.price)),
      0
    );
    const discount = Math.min(Number(inv.discount_amount), subtotal);
    const afterDiscount = subtotal - discount;
    const tax =
      Number(inv.tax_percent) > 0
        ? (afterDiscount * Number(inv.tax_percent)) / 100
        : 0;
    const total = afterDiscount + tax;

    applyInvoiceToDashboardStats(
      acc,
      total,
      inv.status as InvoiceStatus,
      inv.due_date ?? ""
    );
  }

  return {
    totalInvoices: invoices.length,
    paidInvoices: acc.paidInvoices,
    pendingAmount: acc.pendingAmount,
    totalRevenue: acc.totalRevenue,
    currencyCode: profile?.currency_code ?? "USD",
  };
}
