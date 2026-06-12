"use client";

import { useCallback, useEffect, useState } from "react";
import type { CompanySettings } from "@/types/invoice";
import { emptyPaymentDetails } from "@/lib/country";
import {
  fetchProfileClient,
  updateProfileClient,
} from "@/lib/api/profile-client";

const emptySettings: CompanySettings = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  companyAddress: "",
  logo: null,
  signature: null,
  countryCode: "US",
  currencyCode: "USD",
  taxLabel: "VAT",
  defaultPayment: emptyPaymentDetails(),
};

export function useProfile() {
  const [settings, setSettings] = useState<CompanySettings>(emptySettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await fetchProfileClient();
      if (profile) setSettings(profile);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (next: CompanySettings) => {
    const profile = await updateProfileClient(next);
    if (profile) setSettings(profile);
    else setSettings(next);
  }, []);

  return { settings, loading, refresh, update };
}

/** @deprecated Use useProfile */
export const useCompanySettings = useProfile;
