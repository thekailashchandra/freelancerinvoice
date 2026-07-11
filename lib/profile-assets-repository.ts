import { revalidatePath } from "next/cache";
import {
  clearProfileAsset,
  uploadAndSaveProfileAsset,
  uploadUserAsset,
} from "@/lib/supabase/storage-server";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import type { AssetKind } from "@/lib/supabase/asset-storage";

export type AssetUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export type AssetDeleteResult = { ok: true } | { ok: false; error: string };

const MAX_ASSET_BYTES = 2 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (file.size > MAX_ASSET_BYTES) {
    return "Image must be 2 MB or smaller.";
  }
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }
  return null;
}

function parseKind(value: FormDataEntryValue | null): AssetKind | null {
  if (value === "logo" || value === "signature") return value;
  return null;
}

export async function uploadProfileAsset(
  formData: FormData
): Promise<AssetUploadResult> {
  try {
    const kind = parseKind(formData.get("kind"));
    const file = formData.get("file");

    if (!kind) {
      return { ok: false, error: "Invalid asset type." };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Please choose an image file." };
    }

    const fileError = validateImageFile(file);
    if (fileError) return { ok: false, error: fileError };

    const url = await uploadAndSaveProfileAsset(kind, file);

    revalidatePath("/settings");
    revalidatePath("/create-invoice");

    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: formatAuthError(err) };
  }
}

export async function uploadInvoiceAsset(
  formData: FormData
): Promise<AssetUploadResult> {
  try {
    const kind = parseKind(formData.get("kind"));
    const file = formData.get("file");

    if (!kind) {
      return { ok: false, error: "Invalid asset type." };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Please choose an image file." };
    }

    const fileError = validateImageFile(file);
    if (fileError) return { ok: false, error: fileError };

    const url = await uploadUserAsset(kind, file);
    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: formatAuthError(err) };
  }
}

export async function deleteProfileAsset(
  kind: AssetKind
): Promise<AssetDeleteResult> {
  try {
    await clearProfileAsset(kind);

    revalidatePath("/settings");
    revalidatePath("/create-invoice");
    revalidatePath("/onboarding");

    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatAuthError(err) };
  }
}
