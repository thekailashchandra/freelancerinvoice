import type {
  ActivityLogRow,
  AdminInvoiceRow,
  AdminUserRow,
  ExternalAnalytics,
  Paginated,
  PlatformStats,
} from "@/types/superadmin";

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed"
    );
  }
  return data as T;
}

export async function fetchPlatformStatsClient(): Promise<PlatformStats> {
  const res = await fetch("/api/admin/stats", { cache: "no-store" });
  return parseJson<PlatformStats>(res);
}

export async function fetchExternalAnalyticsClient(): Promise<ExternalAnalytics> {
  const res = await fetch("/api/admin/analytics", { cache: "no-store" });
  return parseJson<ExternalAnalytics>(res);
}

export async function fetchAdminUsersClient(params: {
  page?: number;
  search?: string;
}): Promise<Paginated<AdminUserRow>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.search) qs.set("search", params.search);
  const res = await fetch(`/api/admin/users?${qs}`, { cache: "no-store" });
  return parseJson<Paginated<AdminUserRow>>(res);
}

export async function fetchAdminInvoicesClient(params: {
  page?: number;
  status?: string;
}): Promise<Paginated<AdminInvoiceRow>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.status) qs.set("status", params.status);
  const res = await fetch(`/api/admin/invoices?${qs}`, {
    cache: "no-store",
  });
  return parseJson<Paginated<AdminInvoiceRow>>(res);
}

export async function fetchActivityLogsClient(params: {
  page?: number;
  action?: string;
}): Promise<Paginated<ActivityLogRow>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.action) qs.set("action", params.action);
  const res = await fetch(`/api/admin/activity?${qs}`, {
    cache: "no-store",
  });
  return parseJson<Paginated<ActivityLogRow>>(res);
}
