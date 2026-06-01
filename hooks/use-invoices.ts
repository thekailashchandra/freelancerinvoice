"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import {
  deleteInvoice as removeInvoice,
  getInvoices,
  saveInvoice,
} from "@/lib/storage";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setInvoices(getInvoices());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsert = useCallback(
    (invoice: Invoice) => {
      saveInvoice({ ...invoice, updatedAt: new Date().toISOString() });
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeInvoice(id);
      refresh();
    },
    [refresh]
  );

  return { invoices, loading, refresh, upsert, remove };
}
