import { calculateTotals } from "@/lib/calculations";
import {
  getInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import { buildInvoiceUpiLink } from "@/lib/upi";
import {
  brandShade,
  brandTint,
  normalizeBrandColor,
  readableOnColor,
} from "@/lib/brand-color";
import type { Invoice } from "@/types/invoice";

export type SignatureInvoiceData = ReturnType<typeof getSignatureInvoiceData>;

/** Shared derived values for the four signature invoice layouts. */
export function getSignatureInvoiceData(invoice: Invoice) {
  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );
  const paymentOptions = invoicePaymentDisplayOptions(
    invoice.company.companyName
  );
  const paymentLines = getInvoicePaymentInfo(invoice.payment, paymentOptions);
  const upiLink = buildInvoiceUpiLink(invoice, totals.total);
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxPct =
    invoice.taxDiscount.taxPercentage ??
    invoice.taxDiscount.gstPercentage ??
    0;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;
  const clientLines = [
    invoice.client.address,
    invoice.client.email,
    invoice.client.phone,
  ].filter(Boolean) as string[];

  const accent = normalizeBrandColor(invoice.company.brandColor);

  return {
    totals,
    paymentLines,
    upiLink,
    taxOn,
    taxPct,
    taxAmt,
    additionalCharges: totals.additionalCharges,
    currency: invoice.currencyCode,
    clientLines,
    accent,
    accentSoft: brandTint(accent, 0.88),
    accentShade: brandShade(accent, 0.6),
    accentText: readableOnColor(accent),
    paymentTerms: invoice.invoice.paymentTerms?.trim() || "Due on receipt",
  };
}
