"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPaymentFieldsForCountry } from "@/lib/country";
import type { PaymentDetails } from "@/types/invoice";

type PaymentFieldsFormProps = {
  countryCode: string;
  payment: PaymentDetails;
  onChange: (payment: PaymentDetails) => void;
  idPrefix?: string;
};

export function PaymentFieldsForm({
  countryCode,
  payment,
  onChange,
  idPrefix = "pay",
}: PaymentFieldsFormProps) {
  const fields = getPaymentFieldsForCountry(countryCode);

  const update = (key: keyof PaymentDetails, value: string) => {
    onChange({ ...payment, [key]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-accountName`}>Account holder name</Label>
        <Input
          id={`${idPrefix}-accountName`}
          placeholder="Name as it appears on your bank account"
          value={payment.accountName ?? ""}
          onChange={(e) => update("accountName", e.target.value)}
        />
      </div>
      {fields.map((field) => (
        <div
          key={field.key}
          className={
            field.key === "iban" || field.key === "upiId"
              ? "space-y-2 sm:col-span-2"
              : "space-y-2"
          }
        >
          <Label htmlFor={`${idPrefix}-${field.key}`}>{field.label}</Label>
          <Input
            id={`${idPrefix}-${field.key}`}
            placeholder={field.placeholder}
            value={payment[field.key] ?? ""}
            onChange={(e) => update(field.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
