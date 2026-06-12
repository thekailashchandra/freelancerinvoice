"use client";

import { useCallback } from "react";
import type { InvoiceTemplateId } from "@/lib/invoice-templates";
import { isTemplateUnlocked } from "@/lib/template-unlocks";
import { useMounted } from "@/hooks/use-mounted";

/** SSR-safe template unlock check (localStorage only after mount). */
export function useTemplateUnlocked(templateId: InvoiceTemplateId): boolean {
  const mounted = useMounted();
  if (templateId === "classic") return true;
  if (!mounted) return false;
  return isTemplateUnlocked(templateId);
}

/** Returns a lookup that is false for premium templates until after mount. */
export function useTemplateUnlockLookup() {
  const mounted = useMounted();
  return useCallback(
    (templateId: InvoiceTemplateId) => {
      if (templateId === "classic") return true;
      if (!mounted) return false;
      return isTemplateUnlocked(templateId);
    },
    [mounted]
  );
}
