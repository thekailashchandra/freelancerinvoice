import { CustomersPageClient } from "@/components/customers-page-client";
import { fetchClientSummariesAction } from "@/lib/actions/clients";
import { fetchProfileAction } from "@/lib/actions/profile";

export default async function CustomersPage() {
  const [summaries, profile] = await Promise.all([
    fetchClientSummariesAction(),
    fetchProfileAction(),
  ]);

  return (
    <CustomersPageClient
      initialSummaries={summaries}
      currencyCode={profile?.currencyCode ?? "USD"}
    />
  );
}
