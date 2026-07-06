import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ActivityLogRow,
  AdminInvoiceRow,
  AdminUserRow,
  CountryCount,
  Paginated,
  PlatformStats,
  TrendPoint,
} from "@/types/superadmin";

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function lastNDaysLabels(days: number): string[] {
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    labels.push(d.toISOString().slice(0, 10));
  }
  return labels;
}

function countByDay(
  rows: { created_at: string }[],
  days: number
): TrendPoint[] {
  const labels = lastNDaysLabels(days);
  const counts = new Map(labels.map((d) => [d, 0]));

  for (const row of rows) {
    const day = row.created_at.slice(0, 10);
    if (counts.has(day)) {
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }

  return labels.map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

function countOrZero(result: { count: number | null; error: unknown }): number {
  if (result.error) return 0;
  return result.count ?? 0;
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const admin = createAdminClient();
  const since7 = daysAgoIso(7);
  const since30 = daysAgoIso(30);

  const [
    profilesRes,
    invoicesRes,
    clientsRes,
    paidRes,
    pendingRes,
    draftRes,
    pdfRes,
    receiptRes,
    paymentsRes,
    signups7Res,
    signups30Res,
    invoices7Res,
    activeUsersRes,
    invoiceTrendRes,
    signupTrendRes,
    countriesRes,
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("invoices").select("id", { count: "exact", head: true }),
    admin.from("clients").select("id", { count: "exact", head: true }),
    admin
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid"),
    admin
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "sent", "overdue"]),
    admin
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    admin
      .from("activity_logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "invoice.pdf_downloaded"),
    admin
      .from("activity_logs")
      .select("id", { count: "exact", head: true })
      .eq("action", "invoice.receipt_downloaded"),
    admin
      .from("razorpay_payments")
      .select("amount_paise, status")
      .eq("status", "paid"),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since30),
    admin
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7),
    admin
      .from("invoices")
      .select("user_id")
      .gte("created_at", since30),
    admin
      .from("invoices")
      .select("created_at")
      .gte("created_at", since7)
      .order("created_at", { ascending: true }),
    admin
      .from("profiles")
      .select("created_at")
      .gte("created_at", since7)
      .order("created_at", { ascending: true }),
    admin.from("profiles").select("country_code"),
  ]);

  const payments = paymentsRes.data ?? [];
  const paymentsTotalInr =
    payments.reduce((sum, row) => sum + (row.amount_paise ?? 0), 0) / 100;

  const activeUserIds = new Set(
    (activeUsersRes.data ?? []).map((row) => row.user_id)
  );

  const countryMap = new Map<string, number>();
  for (const row of countriesRes.data ?? []) {
    const code = row.country_code || "OTHER";
    countryMap.set(code, (countryMap.get(code) ?? 0) + 1);
  }

  const topCountries: CountryCount[] = [...countryMap.entries()]
    .map(([countryCode, count]) => ({ countryCode, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalUsers: profilesRes.count ?? 0,
    totalInvoices: invoicesRes.count ?? 0,
    totalClients: clientsRes.count ?? 0,
    invoicesPaid: paidRes.count ?? 0,
    invoicesPending: pendingRes.count ?? 0,
    invoicesDraft: draftRes.count ?? 0,
    pdfDownloads: countOrZero(pdfRes),
    receiptDownloads: countOrZero(receiptRes),
    paymentsPaidCount: payments.length,
    paymentsTotalInr,
    signupsLast7Days: signups7Res.count ?? 0,
    signupsLast30Days: signups30Res.count ?? 0,
    invoicesLast7Days: invoices7Res.count ?? 0,
    activeUsersLast30Days: activeUserIds.size,
    invoiceTrend: countByDay(invoiceTrendRes.data ?? [], 7),
    signupTrend: countByDay(signupTrendRes.data ?? [], 7),
    topCountries,
  };
}

export async function fetchAdminUsers(options: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<Paginated<AdminUserRow>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, options.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  let query = admin
    .from("profiles")
    .select("id, email, company_name, country_code, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  const search = options.search?.trim();
  if (search) {
    query = query.or(
      `email.ilike.%${search}%,company_name.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  const userIds = (data ?? []).map((row) => row.id);
  const invoiceCounts = new Map<string, number>();
  const clientCounts = new Map<string, number>();
  const lastActive = new Map<string, string>();

  if (userIds.length > 0) {
    const [invoicesRes, clientsRes, activityRes] = await Promise.all([
      admin.from("invoices").select("user_id").in("user_id", userIds),
      admin.from("clients").select("user_id").in("user_id", userIds),
      admin
        .from("activity_logs")
        .select("actor_id, created_at")
        .in("actor_id", userIds)
        .order("created_at", { ascending: false }),
    ]);

    for (const row of invoicesRes.data ?? []) {
      invoiceCounts.set(row.user_id, (invoiceCounts.get(row.user_id) ?? 0) + 1);
    }
    for (const row of clientsRes.data ?? []) {
      clientCounts.set(row.user_id, (clientCounts.get(row.user_id) ?? 0) + 1);
    }
    for (const row of activityRes.data ?? []) {
      if (!row.actor_id || lastActive.has(row.actor_id)) continue;
      lastActive.set(row.actor_id, row.created_at);
    }
  }

  const items: AdminUserRow[] = (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    companyName: row.company_name,
    countryCode: row.country_code,
    createdAt: row.created_at,
    invoiceCount: invoiceCounts.get(row.id) ?? 0,
    clientCount: clientCounts.get(row.id) ?? 0,
    lastActiveAt: lastActive.get(row.id) ?? null,
  }));

  return { items, total: count ?? 0, page, pageSize };
}

export async function fetchAdminInvoices(options: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<Paginated<AdminInvoiceRow>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, options.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  let query = admin
    .from("invoices")
    .select(
      "id, invoice_number, status, currency_code, user_id, client_name_snapshot, created_at, updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options.status?.trim()) {
    query = query.eq("status", options.status.trim());
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  const userIds = [...new Set((data ?? []).map((row) => row.user_id))];
  const profileMap = new Map<string, { email: string | null; company_name: string | null }>();

  if (userIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email, company_name")
      .in("id", userIds);

    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, {
        email: profile.email,
        company_name: profile.company_name,
      });
    }
  }

  const items: AdminInvoiceRow[] = (data ?? []).map((row) => {
    const profile = profileMap.get(row.user_id);
    return {
      id: row.id,
      invoiceNumber: row.invoice_number,
      status: row.status,
      currencyCode: row.currency_code,
      userId: row.user_id,
      userEmail: profile?.email ?? null,
      companyName: profile?.company_name ?? null,
      clientName: row.client_name_snapshot,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  return { items, total: count ?? 0, page, pageSize };
}

export async function fetchActivityLogs(options: {
  page?: number;
  pageSize?: number;
  action?: string;
}): Promise<Paginated<ActivityLogRow>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(10, options.pageSize ?? 30));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const admin = createAdminClient();
  let query = admin
    .from("activity_logs")
    .select(
      "id, actor_id, action, resource_type, resource_id, metadata, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options.action?.trim()) {
    query = query.eq("action", options.action.trim());
  }

  const { data, count, error } = await query;
  if (error) {
    return { items: [], total: 0, page, pageSize };
  }

  const actorIds = [
    ...new Set(
      (data ?? [])
        .map((row) => row.actor_id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const emailMap = new Map<string, string | null>();
  if (actorIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, email")
      .in("id", actorIds);

    for (const profile of profiles ?? []) {
      emailMap.set(profile.id, profile.email);
    }
  }

  const items: ActivityLogRow[] = (data ?? []).map((row) => ({
    id: row.id,
    actorId: row.actor_id,
    actorEmail: row.actor_id ? (emailMap.get(row.actor_id) ?? null) : null,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: row.created_at,
  }));

  return { items, total: count ?? 0, page, pageSize };
}
