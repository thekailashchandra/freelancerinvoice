import { formatInvoiceMoney } from "@/lib/currency-display";

type InvoiceMoneyProps = {
  amount: number;
  currencyCode: string;
  className?: string;
  style?: React.CSSProperties;
};

/** Invoice preview amounts - currency symbol only (no flag or code prefix). */
export function InvoiceMoney({
  amount,
  currencyCode,
  className,
  style,
}: InvoiceMoneyProps) {
  return (
    <span className={className} style={style}>
      {formatInvoiceMoney(amount, currencyCode)}
    </span>
  );
}
