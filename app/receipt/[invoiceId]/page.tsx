import type { Metadata } from "next";
import { InvoiceReceiptClient } from "./invoice-receipt-client";

export const metadata: Metadata = {
  title: "Payment receipt",
  robots: { index: false, follow: false },
};

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <InvoiceReceiptClient invoiceId={invoiceId} />
    </main>
  );
}
