import type { Invoice } from "@/types/invoice";

export function isValidUpiId(upiId: string): boolean {
  const trimmed = upiId.trim();
  if (!trimmed) return false;
  return /^[\w.-]+@[\w.-]+$/.test(trimmed) || /^\+?[0-9]{8,15}$/.test(trimmed);
}

export function buildUpiPaymentLink(options: {
  upiId: string;
  payeeName: string;
  amount: number;
  currency?: string;
}): string {
  const params = new URLSearchParams();
  params.set("pa", options.upiId.trim());
  const name = options.payeeName.trim().slice(0, 50);
  if (name) params.set("pn", name);
  if (options.amount > 0) {
    params.set("am", options.amount.toFixed(2));
  }
  params.set("cu", options.currency ?? "INR");
  return `upi://pay?${params.toString()}`;
}

export function buildInvoiceUpiLink(invoice: Invoice, grandTotal: number): string | null {
  const upiId = invoice.payment.upiId?.trim();
  if (!isValidUpiId(upiId ?? "") || grandTotal <= 0) return null;
  return buildUpiPaymentLink({
    upiId: upiId!,
    payeeName: invoice.company.companyName || "Merchant",
    amount: grandTotal,
    currency: invoice.currencyCode || "INR",
  });
}
