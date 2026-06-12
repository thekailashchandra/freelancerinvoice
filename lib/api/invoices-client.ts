import type { Invoice } from "@/types/invoice";

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Invoice request failed"
    );
  }
  return data as T;
}

export async function fetchInvoicesClient(): Promise<Invoice[]> {
  const res = await fetch("/api/invoices", { cache: "no-store" });
  return parseJson<Invoice[]>(res);
}

export async function fetchInvoiceByIdClient(
  id: string
): Promise<Invoice | null> {
  const res = await fetch(`/api/invoices/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  return parseJson<Invoice>(res);
}

export async function saveInvoiceClient(invoice: Invoice): Promise<{ id: string }> {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoice),
  });
  return parseJson<{ id: string }>(res);
}

export async function updateInvoiceStatusClient(
  id: string,
  status: Invoice["status"]
): Promise<Invoice | null> {
  const res = await fetch(`/api/invoices/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return parseJson<Invoice>(res);
}

export async function deleteInvoiceClient(id: string): Promise<void> {
  const res = await fetch(`/api/invoices/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await parseJson<{ ok: boolean }>(res);
}
