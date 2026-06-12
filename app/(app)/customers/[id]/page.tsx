import { notFound } from "next/navigation";
import { CustomerDetailClient } from "@/components/customer-detail-client";
import { fetchClientDetail } from "@/lib/clients-repository";
import { fetchProfile } from "@/lib/profile-repository";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [detail, profile] = await Promise.all([
    fetchClientDetail(id),
    fetchProfile(),
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
