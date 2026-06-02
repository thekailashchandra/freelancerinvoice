/**
 * @deprecated Use server actions in `@/lib/actions/profile-assets` instead.
 * Client-side uploads fail when NEXT_PUBLIC_* env is not available in the browser bundle.
 */
import { createClient } from "@/lib/supabase/client";
import {
  buildAssetObjectPath,
  getAssetColumn,
  INVOICE_ASSETS_BUCKET,
  type AssetKind,
} from "@/lib/supabase/asset-storage";

export type { AssetKind } from "@/lib/supabase/asset-storage";

export async function uploadInvoiceAsset(
  userId: string,
  kind: AssetKind,
  file: File
): Promise<string> {
  const supabase = createClient();
  const path = buildAssetObjectPath(userId, kind, file.name);

  const { error: uploadError } = await supabase.storage
    .from(INVOICE_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(INVOICE_ASSETS_BUCKET).getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error("Could not resolve public URL for uploaded asset");
  }

  return data.publicUrl;
}

export async function updateProfileAssetUrl(
  kind: AssetKind,
  publicUrl: string
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const column = getAssetColumn(kind);
  const { error } = await supabase
    .from("profiles")
    .update({ [column]: publicUrl })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}

export async function uploadAndSaveProfileAsset(
  kind: AssetKind,
  file: File
): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const publicUrl = await uploadInvoiceAsset(user.id, kind, file);
  await updateProfileAssetUrl(kind, publicUrl);
  return publicUrl;
}
