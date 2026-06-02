import { InvoiceViewClient } from "./invoice-view-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceViewPage({ params }: PageProps) {
  const { id } = await params;
  return <InvoiceViewClient invoiceId={id} />;
}
