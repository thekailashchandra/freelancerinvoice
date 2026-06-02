import type { Invoice, InvoiceTotals, ServiceItem, TaxDiscount } from "@/types/invoice";

function normalizeTax(taxDiscount: TaxDiscount): {
  enabled: boolean;
  percent: number;
  discount: number;
} {
  const enabled = taxDiscount.taxEnabled ?? taxDiscount.gstEnabled ?? false;
  const percent =
    taxDiscount.taxPercentage ?? taxDiscount.gstPercentage ?? 0;
  return { enabled, percent, discount: taxDiscount.discount };
}

export function calculateSubtotal(services: ServiceItem[]): number {
  return services.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateTotals(
  services: ServiceItem[],
  taxDiscount: TaxDiscount
): InvoiceTotals {
  const { enabled, percent, discount } = normalizeTax(taxDiscount);
  const subtotal = calculateSubtotal(services);
  const discountAmount = Math.min(discount, subtotal);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = enabled ? (afterDiscount * percent) / 100 : 0;
  const total = afterDiscount + taxAmount;

  return {
    subtotal,
    taxAmount,
    gstAmount: taxAmount,
    discountAmount,
    total,
  };
}

export function getInvoiceTotals(invoice: Invoice): InvoiceTotals {
  return calculateTotals(invoice.services, invoice.taxDiscount);
}

export function deriveInvoiceStatus(
  status: Invoice["status"],
  dueDate: string
): Invoice["status"] {
  if (status === "paid" || status === "draft" || status === "sent") {
    return status;
  }
  if (!dueDate) return status;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  if (due < today) return "overdue";
  return status === "overdue" ? "pending" : status;
}
