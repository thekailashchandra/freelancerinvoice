"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientSummary } from "@/lib/customer-invoices";
import { fetchClientSummariesClient } from "@/lib/api/customers-client";

export function useCustomers() {
  const [summaries, setSummaries] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClientSummariesClient();
      setSummaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summaries, loading, error, refresh };
}
