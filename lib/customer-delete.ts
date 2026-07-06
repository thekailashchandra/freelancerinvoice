export function confirmDeleteCustomer(
  displayName: string,
  invoiceCount = 0
): boolean {
  const invoiceNote =
    invoiceCount > 0
      ? ` ${invoiceCount} linked invoice${invoiceCount === 1 ? "" : "s"} will stay in your history.`
      : "";
  return window.confirm(
    `Delete ${displayName}? They will be removed from your customer list.${invoiceNote} This cannot be undone.`
  );
}
