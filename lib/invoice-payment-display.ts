import type { PaymentDetails } from "@/types/invoice";

export type PaymentInfoLine = { label: string; value: string };

export type InvoicePaymentDisplayOptions = {
  /** Used when payment.accountName is empty (e.g. company name on file) */
  accountNameFallback?: string;
};

/** Payment lines for invoice preview — shows any filled field regardless of country. */
export function getInvoicePaymentInfo(
  payment: PaymentDetails,
  options?: InvoicePaymentDisplayOptions
): PaymentInfoLine[] {
  const lines: PaymentInfoLine[] = [];
  const accountName =
    payment.accountName?.trim() || options?.accountNameFallback?.trim();

  if (accountName) {
    lines.push({ label: "Account name", value: accountName });
  }
  if (payment.bankName?.trim()) {
    lines.push({ label: "Bank", value: payment.bankName.trim() });
  }
  if (payment.accountNumber?.trim()) {
    lines.push({
      label: "Account number",
      value: payment.accountNumber.trim(),
    });
  }
  if (payment.upiId?.trim()) {
    lines.push({ label: "UPI ID", value: payment.upiId.trim() });
  }
  if (payment.routingNumber?.trim()) {
    lines.push({
      label: "Routing / BSB",
      value: payment.routingNumber.trim(),
    });
  }
  if (payment.sortCode?.trim()) {
    lines.push({ label: "Sort code", value: payment.sortCode.trim() });
  }
  if (payment.iban?.trim()) {
    lines.push({ label: "IBAN", value: payment.iban.trim() });
  }
  if (payment.swiftCode?.trim()) {
    lines.push({ label: "SWIFT / BIC", value: payment.swiftCode.trim() });
  }
  if (payment.bankAddress?.trim()) {
    lines.push({ label: "Bank address", value: payment.bankAddress.trim() });
  }

  return lines;
}

export function hasInvoicePaymentInfo(
  payment: PaymentDetails,
  options?: InvoicePaymentDisplayOptions
): boolean {
  return getInvoicePaymentInfo(payment, options).length > 0;
}

export function invoicePaymentDisplayOptions(companyName?: string) {
  return companyName?.trim()
    ? { accountNameFallback: companyName.trim() }
    : undefined;
}
