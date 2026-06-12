import type { ClientSummary } from "@/lib/customer-invoices";

export async function fetchClientSummariesClient(): Promise<ClientSummary[]> {
  const res = await fetch("/api/clients/summaries", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Failed to load customers"
    );
  }
  return data as ClientSummary[];
}
