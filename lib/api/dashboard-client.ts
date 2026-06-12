import type { DashboardStats } from "@/types/invoice";

export async function fetchDashboardStatsClient(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Failed to load dashboard stats"
    );
  }
  return data as DashboardStats;
}
