import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchInvoices } from "@/lib/invoice-repository";
import {
  clientDetailsToClientRow,
  clientRowToSavedClient,
  type SavedClient,
} from "@/lib/client-mapper";
import {
  clientDisplayName,
  getInvoicesForClient,
  summarizeClient,
  type ClientSummary,
} from "@/lib/customer-invoices";
import type { ClientDetails, Invoice } from "@/types/invoice";
import type { ClientRow } from "@/types/database";

export async function fetchClients(): Promise<SavedClient[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data as ClientRow[]).map(clientRowToSavedClient);
}

export async function createSavedClient(
  details: ClientDetails
): Promise<SavedClient> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const name = details.name.trim();
  if (!name) throw new Error("Customer name is required");

  const row = clientDetailsToClientRow(details, user.id);

  const { data, error } = await supabase
    .from("clients")
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/create-invoice");
  revalidatePath("/customers");
  return clientRowToSavedClient(data as ClientRow);
}

export async function updateClient(
  id: string,
  details: ClientDetails
): Promise<SavedClient> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const name = details.name.trim();
  if (!name) throw new Error("Customer name is required");

  const row = clientDetailsToClientRow(details, user.id);

  const { data, error } = await supabase
    .from("clients")
    .update(row)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/create-invoice");
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  return clientRowToSavedClient(data as ClientRow);
}

export async function fetchClientSummaries(): Promise<ClientSummary[]> {
  const [clients, invoices] = await Promise.all([
    fetchClients(),
    fetchInvoices(),
  ]);

  return clients
    .map((client) => summarizeClient(client, invoices))
    .sort((a, b) => clientDisplayName(a).localeCompare(clientDisplayName(b)));
}

export async function fetchClientDetail(clientId: string): Promise<{
  client: SavedClient;
  summary: ClientSummary;
  invoices: Invoice[];
} | null> {
  const [clients, invoices] = await Promise.all([
    fetchClients(),
    fetchInvoices(),
  ]);

  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;

  return {
    client,
    summary: summarizeClient(client, invoices),
    invoices: getInvoicesForClient(client, invoices),
  };
}
