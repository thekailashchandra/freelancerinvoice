import { createAdminClient } from "@/lib/supabase/admin";
import { createDodoClient, isDodoConfigured } from "@/lib/dodo-payments";
import { formatMoney } from "@/lib/currency-display";
import type { BillingHistoryItem, BillingPaymentStatus } from "@/lib/billing-types";
import type { SubscriptionBillingInterval, SubscriptionPlanId } from "@/lib/subscription";
import type { DodoPaymentRow } from "@/types/database";

const dodoSyncCache = new Set<string>();

type RazorpayHistoryRow = {
  id: string;
  user_id: string;
  purpose: string | null;
  template_id: string | null;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount_paise: number;
  currency: string;
  status: string;
  customer_email: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

function planFromInterval(
  interval: SubscriptionBillingInterval | null
): SubscriptionPlanId | null {
  if (interval === "monthly") return "cloud_monthly";
  if (interval === "yearly") return "cloud_yearly";
  return null;
}

function intervalFromMetadata(
  metadata: Record<string, unknown> | null | undefined
): SubscriptionBillingInterval | null {
  const raw = metadata?.interval;
  return raw === "monthly" || raw === "yearly" ? raw : null;
}

function planFromMetadata(
  metadata: Record<string, unknown> | null | undefined
): SubscriptionPlanId | null {
  const raw = metadata?.plan;
  return raw === "cloud_monthly" || raw === "cloud_yearly" ? raw : null;
}

function planLabel(
  plan: SubscriptionPlanId | null,
  interval: SubscriptionBillingInterval | null
): string {
  const resolved = plan ?? planFromInterval(interval);
  if (resolved === "cloud_yearly") return "Cloud yearly pass";
  if (resolved === "cloud_monthly") return "Cloud monthly pass";
  return "Cloud pass";
}

function paymentMethodLabel(value: string | null | undefined): string | null {
  const method = value?.trim();
  if (!method) return null;
  if (method === "credit" || method === "debit" || method === "card") {
    return "Card";
  }
  return method;
}

function paymentStatus(
  provider: "dodo" | "razorpay",
  status: string
): { status: BillingPaymentStatus; label: string } {
  if (status === "refunded") return { status: "refunded", label: "Refunded" };
  if (status === "failed" || status === "cancelled") {
    return { status: "failed", label: "Failed" };
  }
  if (status === "paid" || status === "succeeded") {
    return { status: "paid", label: "Paid" };
  }
  return {
    status: "pending",
    label: provider === "dodo" ? "Processing" : "Pending",
  };
}

function mapDodoRow(row: DodoPaymentRow): BillingHistoryItem {
  const state = paymentStatus("dodo", row.status);
  const plan = row.plan ?? planFromInterval(row.interval);
  const interval = row.interval ?? null;

  return {
    id: `dodo-${row.id}`,
    provider: "dodo",
    providerLabel: "Dodo Payments",
    paymentId: row.payment_id,
    description: planLabel(plan, interval),
    amount: row.amount / 100,
    currencyCode: row.currency,
    amountDisplay: formatMoney(row.amount / 100, row.currency),
    status: state.status,
    statusLabel: state.label,
    paidAt: row.paid_at,
    customerEmail: row.customer_email,
    paymentMethod: paymentMethodLabel(row.payment_method),
    plan,
    interval,
    receiptUrl: row.invoice_url,
  };
}

function mapRazorpayRow(row: RazorpayHistoryRow): BillingHistoryItem {
  const interval = intervalFromMetadata(row.metadata);
  const plan = planFromMetadata(row.metadata) ?? planFromInterval(interval);
  const state = paymentStatus("razorpay", row.status);

  return {
    id: `razorpay-${row.id}`,
    provider: "razorpay",
    providerLabel: "Razorpay",
    paymentId: row.razorpay_payment_id ?? row.razorpay_order_id,
    description: planLabel(plan, interval),
    amount: row.amount_paise / 100,
    currencyCode: row.currency,
    amountDisplay: formatMoney(row.amount_paise / 100, row.currency),
    status: state.status,
    statusLabel: state.label,
    paidAt: row.updated_at || row.created_at,
    customerEmail: row.customer_email,
    paymentMethod: "Razorpay",
    plan,
    interval,
    receiptUrl: null,
  };
}

async function syncDodoPayments(userId: string, email: string): Promise<boolean> {
  if (dodoSyncCache.has(userId) || !isDodoConfigured()) return false;

  const client = createDodoClient();
  if (!client) return false;

  try {
    const page = await client.payments.list({
      page_size: 100,
      status: "succeeded",
    });
    const admin = createAdminClient();
    const rows = (page.items ?? [])
      .filter((payment) => {
        const metadata = payment.metadata as Record<string, unknown> | undefined;
        const metadataUserId =
          typeof metadata?.user_id === "string" ? metadata.user_id : null;
        const source = typeof metadata?.source === "string" ? metadata.source : null;
        const sameEmail =
          payment.customer.email?.toLowerCase() === email.toLowerCase();
        return metadataUserId === userId || (source === "invoice-for-freelance" && sameEmail);
      })
      .map((payment) => {
        const metadata = (payment.metadata ?? {}) as Record<string, unknown>;
        const interval = intervalFromMetadata(metadata);
        const plan = planFromMetadata(metadata) ?? planFromInterval(interval);
        return {
          user_id: userId,
          payment_id: payment.payment_id,
          status: payment.refund_status ? "refunded" : payment.status ?? "succeeded",
          amount: payment.total_amount,
          currency: payment.currency,
          plan,
          interval,
          customer_email: payment.customer.email ?? null,
          invoice_url: payment.invoice_url ?? null,
          payment_method: paymentMethodLabel(
            payment.payment_method_type ?? payment.payment_method
          ),
          metadata,
          paid_at: payment.created_at,
          updated_at: new Date().toISOString(),
        };
      });

    if (rows.length > 0) {
      const { error } = await admin
        .from("dodo_payments")
        .upsert(rows, { onConflict: "payment_id" });
      if (error) throw new Error(error.message);
    }

    dodoSyncCache.add(userId);
    return true;
  } catch (error) {
    console.error(
      "Could not sync Dodo payment history",
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

export async function fetchBillingHistory(
  userId: string,
  email: string | null
): Promise<BillingHistoryItem[]> {
  const admin = createAdminClient();

  const [dodoResult, razorpayResult] = await Promise.all([
    admin
      .from("dodo_payments")
      .select("*")
      .eq("user_id", userId)
      .order("paid_at", { ascending: false })
      .limit(25),
    admin
      .from("razorpay_payments")
      .select(
        "id, user_id, purpose, template_id, razorpay_order_id, razorpay_payment_id, amount_paise, currency, status, customer_email, metadata, created_at, updated_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  let dodoRows = (dodoResult.data ?? []) as DodoPaymentRow[];

  const needsDodoSync =
    dodoRows.length === 0 || dodoRows.some((row) => !row.invoice_url);

  if (!dodoResult.error && needsDodoSync && email) {
    const synced = await syncDodoPayments(userId, email);
    if (synced) {
      const { data } = await admin
        .from("dodo_payments")
        .select("*")
        .eq("user_id", userId)
        .order("paid_at", { ascending: false })
        .limit(25);
      dodoRows = (data ?? []) as DodoPaymentRow[];
    }
  }

  const razorpayRows = ((razorpayResult.data ?? []) as RazorpayHistoryRow[]).filter(
    (row) =>
      row.purpose === "subscription" ||
      (row.purpose === "template" && row.template_id === "cloud_monthly")
  );

  return [...dodoRows.map(mapDodoRow), ...razorpayRows.map(mapRazorpayRow)]
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    )
    .slice(0, 25);
}
