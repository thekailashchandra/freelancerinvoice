import { notFound } from "next/navigation";
import { CustomerDetailClient } from "@/components/customer-detail-client";
import { fetchClientDetailAction } from "@/lib/actions/clients";
import { fetchProfileAction } from "@/lib/actions/profile";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [detail, profile] = await Promise.all([
    fetchClientDetailAction(id),
    fetchProfileAction(),
  ]);

  if (!detail) notFound();

  return (
    <CustomerDetailClient
      client={detail.client}
      summary={detail.summary}
      invoices={detail.invoices}
      issuerName={profile?.companyName ?? ""}
      currencyCode={profile?.currencyCode ?? "USD"}
    />
  );
}
