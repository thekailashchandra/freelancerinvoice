"use server";

import { createClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/types/invoice";

function itemLineTotal(qty: number, price: number): number {
  return qty * Number(price);
}

export async function fetchDashboardStatsAction(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalInvoices: 0,
      paidInvoices: 0,
      pendingAmount: 0,
      totalRevenue: 0,
      currencyCode: "USD",
    };
  }

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, status, tax_percent, discount_amount, invoice_items(qty, price)")
    .eq("user_id", user.id);

  if (error || !invoices) {
    return {
      totalInvoices: 0,
      paidInvoices: 0,
      pendingAmount: 0,
      totalRevenue: 0,
      currencyCode: "USD",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("currency_code")
    .eq("id", user.id)
    .single();

  let paidInvoices = 0;
  let pendingAmount = 0;
  let totalRevenue = 0;

  for (const inv of invoices) {
    const items = inv.invoice_items ?? [];
    const subtotal = items.reduce(
      (sum, item) =>
        sum + itemLineTotal(item.qty, Number(item.price)),
      0
    );
    const discount = Math.min(Number(inv.discount_amount), subtotal);
    const afterDiscount = subtotal - discount;
    const tax =
      Number(inv.tax_percent) > 0
        ? (afterDiscount * Number(inv.tax_percent)) / 100
        : 0;
    const total = afterDiscount + tax;

    if (inv.status === "paid") {
      paidInvoices += 1;
      totalRevenue += total;
    } else {
      pendingAmount += total;
    }
  }

  return {
    totalInvoices: invoices.length,
    paidInvoices,
    pendingAmount,
    totalRevenue,
    currencyCode: profile?.currency_code ?? "USD",
  };
}
