import type { Invoice, InvoiceTotals, ServiceItem, TaxDiscount } from "@/types/invoice";

export function calculateSubtotal(services: ServiceItem[]): number {
  return services.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateTotals(
  services: ServiceItem[],
  taxDiscount: TaxDiscount
): InvoiceTotals {
  const subtotal = calculateSubtotal(services);
  const discountAmount = Math.min(taxDiscount.discount, subtotal);
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = taxDiscount.gstEnabled
    ? (afterDiscount * taxDiscount.gstPercentage) / 100
    : 0;
  const total = afterDiscount + gstAmount;

  return {
    subtotal,
    gstAmount,
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
  if (status === "paid") return "paid";
  if (!dueDate) return status;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  if (due < today) return "overdue";
  return status === "overdue" ? "pending" : status;
}
