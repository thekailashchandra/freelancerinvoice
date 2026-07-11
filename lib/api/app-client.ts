import type { ClientDetails } from "@/types/invoice";
import type { SavedClient } from "@/lib/client-mapper";
import type { AssetUploadResult, AssetDeleteResult } from "@/lib/profile-assets-repository";
import type { AssetKind } from "@/lib/supabase/asset-storage";

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed"
    );
  }
  return data as T;
}

export async function fetchClientsClient(): Promise<SavedClient[]> {
  const res = await fetch("/api/clients", { cache: "no-store" });
  return parseJson<SavedClient[]>(res);
}

export async function createClientClient(
  details: ClientDetails
): Promise<SavedClient> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
  return parseJson<SavedClient>(res);
}

export async function deleteClientClient(id: string): Promise<void> {
  const res = await fetch(`/api/clients/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await parseJson<{ ok: boolean }>(res);
}

export async function uploadProfileAssetClient(
  formData: FormData
): Promise<AssetUploadResult> {
  formData.set("scope", "profile");
  const res = await fetch("/api/profile/assets", {
    method: "POST",
    body: formData,
  });
  return parseJson<AssetUploadResult>(res);
}

export async function uploadInvoiceAssetClient(
  formData: FormData
): Promise<AssetUploadResult> {
  formData.set("scope", "invoice");
  const res = await fetch("/api/profile/assets", {
    method: "POST",
    body: formData,
  });
  return parseJson<AssetUploadResult>(res);
}

export async function deleteProfileAssetClient(
  kind: AssetKind
): Promise<AssetDeleteResult> {
  const res = await fetch(
    `/api/profile/assets?kind=${encodeURIComponent(kind)}`,
    { method: "DELETE" }
  );
  return parseJson<AssetDeleteResult>(res);
}

export async function signOutClient(): Promise<void> {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  await parseJson<{ ok: boolean }>(res);
}
