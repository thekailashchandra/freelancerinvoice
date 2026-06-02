import { getPaymentFieldsForCountry } from "@/lib/country";
import type { PaymentDetails } from "@/types/invoice";

export function getPaymentLinesForDisplay(
  payment: PaymentDetails,
  countryCode: string
): { label: string; value: string }[] {
  const fields = getPaymentFieldsForCountry(countryCode);
  return fields
    .map((field) => ({
      label: field.label,
      value: payment[field.key]?.trim() ?? "",
    }))
    .filter((line) => line.value.length > 0);
}
