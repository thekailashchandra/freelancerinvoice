import type { InvoiceStatus } from "@/types/invoice";

export function invoiceActionState(status: InvoiceStatus) {
  const isPaid = status === "paid";
  const isVoid = status === "void";
  const isLocked = isPaid || isVoid;

  return {
    isPaid,
    isVoid,
    isLocked,
    canEdit: !isLocked,
    canMarkPaid: !isPaid && !isVoid,
    canVoid: !isPaid && !isVoid,
    canDelete: true,
  };
}
