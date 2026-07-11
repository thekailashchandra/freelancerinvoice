"use client";

import type { CSSProperties } from "react";
import type { InvoiceTotals } from "@/types/invoice";
import { InvoiceMoney } from "@/components/invoice-money";
import { getInvoiceSummaryTaxLines } from "@/lib/invoice-tax-display";

type InvoiceSummaryTaxRowsProps = {
  totals: InvoiceTotals;
  currency: string;
  taxOn: boolean;
  taxLabel?: string;
  taxAmt: number;
  taxPct?: number;
  rowStyle?: CSSProperties;
};

export function InvoiceSummaryTaxRows({
  totals,
  currency,
  taxOn,
  taxLabel,
  taxAmt,
  taxPct,
  rowStyle,
}: InvoiceSummaryTaxRowsProps) {
  const lines = getInvoiceSummaryTaxLines({
    totals,
    taxOn,
    taxLabel,
    taxAmt,
    taxPct,
  });

  const baseRow: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    ...rowStyle,
  };

  return (
    <>
      {lines.map((line) => (
        <div key={line.key} style={baseRow}>
          <span>{line.label}</span>
          <InvoiceMoney amount={line.amount} currencyCode={currency} />
        </div>
      ))}
    </>
  );
}
