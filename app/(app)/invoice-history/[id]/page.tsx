import { getSubscriptionAccess } from "@/lib/subscription-server";
import { InvoiceViewClient } from "./invoice-view-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceViewPage({ params }: PageProps) {
  const { id } = await params;
  const subscription = await getSubscriptionAccess();

  return <InvoiceViewClient invoiceId={id} subscription={subscription} />;
}
