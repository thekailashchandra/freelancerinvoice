"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import {
  deleteInvoiceAction,
  fetchInvoicesAction,
  saveInvoiceAction,
} from "@/lib/actions/invoices";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInvoicesAction();
      setInvoices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsert = useCallback(
    async (invoice: Invoice) => {
      const { id } = await saveInvoiceAction(invoice);
      await refresh();
      return id;
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteInvoiceAction(id);
      await refresh();
    },
    [refresh]
  );

  return { invoices, loading, refresh, upsert, remove };
}
