import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFreelancerInvoicePaymentEnabled, isRazorpayEnabled } from "@/lib/razorpay-feature";
import { InvoicePayClient } from "./invoice-pay-client";

export const metadata: Metadata = {
  title: "Pay invoice",
  robots: { index: false, follow: false },
};

export default async function PayInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  if (!isRazorpayEnabled() || !isFreelancerInvoicePaymentEnabled()) notFound();

  const { invoiceId } = await params;
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <InvoicePayClient invoiceId={invoiceId} />
    </main>
  );
}
