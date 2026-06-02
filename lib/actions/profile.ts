"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileToCompanySettings } from "@/lib/invoice-mapper";
import { sanitizePaymentForCountry } from "@/lib/country";
import type { CompanySettings } from "@/types/invoice";
import type { ProfileRow } from "@/types/database";

export async function fetchProfileAction(): Promise<CompanySettings | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return profileToCompanySettings(data as ProfileRow);
}

export async function updateProfileAction(
  settings: Partial<CompanySettings> & {
    companyName?: string;
    currencyCode?: string;
    taxLabel?: string;
  }
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const row: Record<string, string | null> = {};

  if (settings.companyName !== undefined) {
    row.company_name = settings.companyName || null;
  }
  if (settings.companyEmail !== undefined) row.email = settings.companyEmail;
  if (settings.companyPhone !== undefined) row.phone = settings.companyPhone;
  if (settings.companyAddress !== undefined) row.address = settings.companyAddress;
  if (settings.logo !== undefined) row.logo_url = settings.logo;
  if (settings.signature !== undefined) row.signature_url = settings.signature;
  if (settings.countryCode !== undefined) row.country_code = settings.countryCode;
  if (settings.currencyCode !== undefined) row.currency_code = settings.currencyCode;
  if (settings.taxLabel !== undefined) row.tax_label = settings.taxLabel;

  if (settings.defaultPayment !== undefined) {
    const country = settings.countryCode ?? "OTHER";
    const payment = sanitizePaymentForCountry(settings.defaultPayment, country);
    row.default_bank_name = payment.bankName;
    row.default_account_number = payment.accountNumber;
    row.default_upi_id = payment.upiId;
    row.default_routing_number = payment.routingNumber;
    row.default_iban = payment.iban;
    row.default_sort_code = payment.sortCode;
  }

  const { error } = await supabase
    .from("profiles")
    .update(row)
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/create-invoice");
}

export async function completeOnboardingAction(input: {
  companyName: string;
  countryCode: string;
  currencyCode: string;
  taxLabel: string;
}): Promise<void> {
  await updateProfileAction({
    companyName: input.companyName,
    countryCode: input.countryCode,
    currencyCode: input.currencyCode,
    taxLabel: input.taxLabel,
  });
}
