"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/types/invoice";
import { fetchDashboardStatsAction } from "@/lib/actions/dashboard";

const emptyStats: DashboardStats = {
  totalInvoices: 0,
  paidInvoices: 0,
  pendingAmount: 0,
  totalRevenue: 0,
  currencyCode: "USD",
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStatsAction();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}
