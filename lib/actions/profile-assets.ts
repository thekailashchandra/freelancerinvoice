"use server";

import { revalidatePath } from "next/cache";
import {
  uploadAndSaveProfileAsset,
  uploadUserAsset,
} from "@/lib/supabase/storage-server";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import type { AssetKind } from "@/lib/supabase/asset-storage";

export type AssetUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

function parseKind(value: FormDataEntryValue | null): AssetKind | null {
  if (value === "logo" || value === "signature") return value;
  return null;
}

/** Upload logo/signature to storage and save URL on the user's profile. */
export async function uploadProfileAssetAction(
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

    if (!file.type.startsWith("image/")) {
      return { ok: false, error: "Only image files are allowed." };
    }

    const url = await uploadAndSaveProfileAsset(kind, file);

    revalidatePath("/settings");
    revalidatePath("/create-invoice");

    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: formatAuthError(err) };
  }
}

/** Upload to storage only (e.g. invoice editor); does not update profile defaults. */
export async function uploadInvoiceAssetAction(
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

    if (!file.type.startsWith("image/")) {
      return { ok: false, error: "Only image files are allowed." };
    }

    const url = await uploadUserAsset(kind, file);
    return { ok: true, url };
  } catch (err) {
    return { ok: false, error: formatAuthError(err) };
  }
}
