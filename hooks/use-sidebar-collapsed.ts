"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "invoice-sidebar-collapsed";

export function useSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCollapsedState(localStorage.getItem(STORAGE_KEY) === "true");
    setHydrated(true);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed: hydrated ? collapsed : false, setCollapsed, toggle, hydrated };
}
