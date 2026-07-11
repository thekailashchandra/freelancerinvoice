import { revalidatePath } from "next/cache";
import { profileToCompanySettings } from "@/lib/invoice-mapper";
import { sanitizePaymentForCountry } from "@/lib/country";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import { isRazorpayOwnerEmail } from "@/lib/razorpay-access";
import { resolveProfileAssetUrls } from "@/lib/supabase/asset-url";
import { createClient } from "@/lib/supabase/server";
import type { CompanySettings } from "@/types/invoice";
import type { ProfileRow } from "@/types/database";

const PROFILE_SELECT_BASE =
  "id, company_name, email, phone, address, logo_url, signature_url, country_code, currency_code, tax_label, default_account_name, default_bank_name, default_account_number, default_upi_id, default_routing_number, default_iban, default_swift_code, default_bank_address, default_sort_code, logo_height, hide_invoice_branding, hide_signature_text_fallback, created_at, updated_at";

function profileSelectColumns(includeRazorpay: boolean): string {
  if (!includeRazorpay) return PROFILE_SELECT_BASE;
  return `${PROFILE_SELECT_BASE}, razorpay_key_id, razorpay_key_secret`;
}

export async function fetchProfile(): Promise<CompanySettings | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const includeRazorpay =
    isRazorpayEnabled() && isRazorpayOwnerEmail(user.email);

  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelectColumns(includeRazorpay))
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  const withAssetUrls = await resolveProfileAssetUrls(
    data as unknown as ProfileRow,
    supabase
  );

  return profileToCompanySettings(withAssetUrls);
}

export async function updateProfile(
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

  const includeRazorpay =
    isRazorpayEnabled() && isRazorpayOwnerEmail(user.email);

  const row: Record<string, string | number | boolean | null> = {};

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
  if (settings.logoHeight !== undefined) {
    row.logo_height = Math.min(
      200,
      Math.max(32, Math.round(settings.logoHeight))
    );
  }
  if (settings.hideInvoiceBranding !== undefined) {
    row.hide_invoice_branding = settings.hideInvoiceBranding;
  }
  if (settings.hideSignatureTextFallback !== undefined) {
    row.hide_signature_text_fallback = settings.hideSignatureTextFallback;
  }

  if (includeRazorpay) {
    if (settings.razorpayKeyId !== undefined) {
      row.razorpay_key_id = settings.razorpayKeyId.trim();
    }
    if (
      settings.razorpayKeySecret !== undefined &&
      settings.razorpayKeySecret.trim()
    ) {
      row.razorpay_key_secret = settings.razorpayKeySecret.trim();
    }
  }

  if (settings.defaultPayment !== undefined) {
    const country = settings.countryCode ?? "OTHER";
    const payment = sanitizePaymentForCountry(settings.defaultPayment, country);
    row.default_account_name = payment.accountName;
    row.default_bank_name = payment.bankName;
    row.default_account_number = payment.accountNumber;
    row.default_upi_id = payment.upiId;
    row.default_routing_number = payment.routingNumber;
    row.default_iban = payment.iban;
    row.default_swift_code = payment.swiftCode;
    row.default_bank_address = payment.bankAddress;
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
