import type { ClientRow } from "@/types/database";
import type { ClientDetails } from "@/types/invoice";

export type SavedClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  gstin: string;
};

export function clientRowToSavedClient(row: ClientRow): SavedClient {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company_name,
    address: row.address,
    gstin: row.gstin ?? "",
  };
}

export function savedClientToClientDetails(client: SavedClient): ClientDetails {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    address: client.address,
    gstin: client.gstin,
  };
}

export function clientDetailsToClientRow(
  details: ClientDetails,
  userId: string
): Omit<ClientRow, "id" | "created_at"> {
  return {
    user_id: userId,
    name: details.name.trim(),
    email: details.email.trim(),
    phone: details.phone.trim(),
    company_name: details.company.trim(),
    address: details.address.trim(),
    gstin: details.gstin?.trim() ?? "",
  };
}
