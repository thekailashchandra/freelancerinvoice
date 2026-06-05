import type {
  GstBreakdown,
  Invoice,
  InvoiceTotals,
  ServiceItem,
  TaxDiscount,
} from "@/types/invoice";

function normalizeTax(taxDiscount: TaxDiscount): {
  enabled: boolean;
  percent: number;
  discount: number;
  gstSupplyType: TaxDiscount["gstSupplyType"];
} {
  const enabled = taxDiscount.taxEnabled ?? taxDiscount.gstEnabled ?? false;
  const percent =
    taxDiscount.taxPercentage ?? taxDiscount.gstPercentage ?? 0;
  return {
    enabled,
    percent,
    discount: taxDiscount.discount,
    gstSupplyType: taxDiscount.gstSupplyType ?? "intra",
  };
}

export function isIndianGstInvoice(taxLabel: string): boolean {
  return taxLabel.trim().toUpperCase() === "GST";
}

function buildGstBreakdown(
  taxAmount: number,
  percent: number,
  supplyType: TaxDiscount["gstSupplyType"],
  useGstSplit: boolean
): GstBreakdown | undefined {
  if (!useGstSplit || taxAmount <= 0) return undefined;

  if (supplyType === "inter") {
    return {
      type: "inter",
      igst: { rate: percent, amount: taxAmount },
    };
  }

  const halfRate = percent / 2;
  const halfAmount = taxAmount / 2;
  return {
    type: "intra",
    cgst: { rate: halfRate, amount: halfAmount },
    sgst: { rate: halfRate, amount: halfAmount },
  };
}

export function calculateSubtotal(services: ServiceItem[]): number {
  return services.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

export function calculateTotals(
  services: ServiceItem[],
  taxDiscount: TaxDiscount,
  taxLabel = ""
): InvoiceTotals {
  const { enabled, percent, discount, gstSupplyType } = normalizeTax(taxDiscount);
  const shipping = Math.max(0, taxDiscount.shippingFee ?? 0);
  const subtotal = calculateSubtotal(services);
  const discountAmount = Math.min(discount, subtotal);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = enabled ? (afterDiscount * percent) / 100 : 0;
  const total = afterDiscount + taxAmount + shipping;
  const useGstSplit = enabled && isIndianGstInvoice(taxLabel);

  return {
    subtotal,
    taxAmount,
    gstAmount: taxAmount,
    discountAmount,
    shippingFee: shipping,
    total,
    gstBreakdown: buildGstBreakdown(
      taxAmount,
      percent,
      gstSupplyType,
      useGstSplit
    ),
  };
}

export function getInvoiceTotals(invoice: Invoice): InvoiceTotals {
  return calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );
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
