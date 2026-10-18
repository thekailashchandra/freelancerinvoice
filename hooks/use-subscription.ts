"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubscriptionAccess } from "@/lib/subscription";

export type SubscriptionClientState = SubscriptionAccess & {
  loading: boolean;
};

const INITIAL: SubscriptionClientState = {
  active: false,
  status: "none",
  plan: null,
  startedAt: null,
  expiresAt: null,
  billingEnabled: true,
  checkoutAvailable: false,
  source: "cloud",
  loading: true,
};

export function useSubscription() {
  const [state, setState] = useState<SubscriptionClientState>(INITIAL);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription/status", {
        cache: "no-store",
      });
      const data = (await res.json()) as Partial<SubscriptionAccess>;
      setState({
        active: Boolean(data.active),
        status: data.status ?? "none",
        plan: data.plan ?? null,
        startedAt: data.startedAt ?? null,
        expiresAt: data.expiresAt ?? null,
        billingEnabled: data.billingEnabled !== false,
        checkoutAvailable: Boolean(data.checkoutAvailable),
        source: data.source ?? "cloud",
        loading: false,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
