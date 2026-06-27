"use client";

import { useEffect, useState } from "react";

type RazorpayAccessState = {
  loading: boolean;
  isOwner: boolean;
  templateCheckout: boolean;
  invoiceCheckout: boolean;
};

const defaultState: RazorpayAccessState = {
  loading: true,
  isOwner: false,
  templateCheckout: false,
  invoiceCheckout: false,
};

export function useRazorpayAccess(): RazorpayAccessState {
  const [state, setState] = useState<RazorpayAccessState>(defaultState);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/razorpay/status", { cache: "no-store" });
        const data = (await res.json()) as {
          isOwner?: boolean;
          templateCheckout?: boolean;
          invoiceCheckout?: boolean;
        };
        if (!cancelled) {
          setState({
            loading: false,
            isOwner: Boolean(data.isOwner),
            templateCheckout: Boolean(data.templateCheckout),
            invoiceCheckout: Boolean(data.invoiceCheckout),
          });
        }
      } catch {
        if (!cancelled) {
          setState({ ...defaultState, loading: false });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
