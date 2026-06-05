import type { PaymentDetails } from "@/types/invoice";

export type PaymentInfoLine = { label: string; value: string };

/** Payment lines for invoice preview — shows any filled field regardless of country. */
export function getInvoicePaymentInfo(
  payment: PaymentDetails
): PaymentInfoLine[] {
  const lines: PaymentInfoLine[] = [];

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

  return lines;
}

export function hasInvoicePaymentInfo(payment: PaymentDetails): boolean {
  return getInvoicePaymentInfo(payment).length > 0;
}
