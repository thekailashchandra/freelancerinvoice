import type { ClientDetails } from "@/types/invoice";
import type { SavedClient } from "@/lib/client-mapper";
import type { AssetUploadResult } from "@/lib/profile-assets-repository";

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

export async function signOutClient(): Promise<void> {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  await parseJson<{ ok: boolean }>(res);
}
