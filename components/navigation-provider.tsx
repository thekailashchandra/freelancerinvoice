"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { NavigationProgress } from "@/components/navigation-progress";

type NavigationContextValue = {
  pending: boolean;
  pendingHref: string | null;
  startNavigation: (href: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return ctx;
}

export function useNavPending(href: string) {
  const ctx = useContext(NavigationContext);
  return ctx?.pendingHref === href;
}

export function useNavigationOptional() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPending(false);
    setPendingHref(null);
  }, [pathname]);

  const startNavigation = useCallback(
    (href: string) => {
      const target = href.split("?")[0]?.split("#")[0] ?? href;
      const current = pathname.split("?")[0];
      if (target === current) return;
      setPendingHref(href);
      setPending(true);
    },
    [pathname]
  );

  return (
    <NavigationContext.Provider
      value={{ pending, pendingHref, startNavigation }}
    >
      <NavigationProgress pending={pending} />
      {children}
    </NavigationContext.Provider>
  );
}
