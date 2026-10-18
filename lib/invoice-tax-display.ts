import { invoiceMoneyHtml } from "@/lib/currency-display";
import type { InvoiceTotals } from "@/types/invoice";

export type InvoiceSummaryTaxLine = {
  key: string;
  label: string;
  amount: number;
};

/** Tax rows after discount - CGST/SGST, IGST, or a single tax line. */
export function getInvoiceSummaryTaxLines(options: {
  totals: InvoiceTotals;
  taxOn: boolean;
  taxLabel?: string;
  taxAmt: number;
  taxPct?: number;
}): InvoiceSummaryTaxLine[] {
  const { totals, taxOn, taxLabel, taxAmt, taxPct } = options;
  if (!taxOn) return [];

  if (totals.gstBreakdown?.type === "intra") {
    return [
      {
        key: "cgst",
        label: `CGST (@${totals.gstBreakdown.cgst?.rate.toFixed(1)}%)`,
        amount: totals.gstBreakdown.cgst?.amount ?? 0,
      },
      {
        key: "sgst",
        label: `SGST (@${totals.gstBreakdown.sgst?.rate.toFixed(1)}%)`,
        amount: totals.gstBreakdown.sgst?.amount ?? 0,
      },
    ];
  }

  if (totals.gstBreakdown?.type === "inter") {
    return [
      {
        key: "igst",
        label: `IGST (@${totals.gstBreakdown.igst?.rate.toFixed(1)}%)`,
        amount: totals.gstBreakdown.igst?.amount ?? 0,
      },
    ];
  }

  const label =
    taxPct != null && taxPct > 0
      ? `${taxLabel?.trim() || "Tax"} ${taxPct.toFixed(2)}%`
      : taxLabel?.trim() || "Total Tax";

  return [{ key: "tax", label, amount: taxAmt }];
}

export function buildInvoiceSummaryTaxLinesHtml(
  lines: InvoiceSummaryTaxLine[],
  currency: string,
  rowStyle: string,
  escape: (text: string) => string = (text) => text
): string {
  return lines
    .map(
      (line) =>
        `<div style="${rowStyle}"><span>${escape(line.label)}</span>${invoiceMoneyHtml(line.amount, currency)}</div>`
    )
    .join("");
}
