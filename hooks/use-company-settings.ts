"use client";

import { useCallback, useEffect, useState } from "react";
import type { CompanySettings } from "@/types/invoice";
import {
  defaultCompanySettings,
  getCompanySettings,
  saveCompanySettings,
} from "@/lib/storage";

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(defaultCompanySettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings(getCompanySettings());
    setLoading(false);
  }, []);

  const update = useCallback((next: CompanySettings) => {
    saveCompanySettings(next);
    setSettings(next);
  }, []);

  return { settings, loading, update };
}
