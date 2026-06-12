"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import {
  deleteInvoiceClient,
  fetchInvoicesClient,
  saveInvoiceClient,
} from "@/lib/api/invoices-client";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInvoicesClient();
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsert = useCallback(
    async (invoice: Invoice) => {
      const { id } = await saveInvoiceClient(invoice);
      await refresh();
      return id;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteInvoiceClient(id);
      await refresh();
    },
    [refresh]
  );

  return { invoices, loading, refresh, upsert, remove };
}
