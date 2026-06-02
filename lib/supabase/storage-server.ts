import { createClient } from "@/lib/supabase/server";
import {
  buildAssetObjectPath,
  getAssetColumn,
  INVOICE_ASSETS_BUCKET,
  type AssetKind,
} from "@/lib/supabase/asset-storage";

export async function uploadUserAsset(
  kind: AssetKind,
  file: File
): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const path = buildAssetObjectPath(user.id, kind, file.name);

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

export async function saveProfileAssetUrl(
  kind: AssetKind,
  publicUrl: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const column = getAssetColumn(kind);
  const { error } = await supabase
    .from("profiles")
    .update({ [column]: publicUrl })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadAndSaveProfileAsset(
  kind: AssetKind,
  file: File
): Promise<string> {
  const publicUrl = await uploadUserAsset(kind, file);
  await saveProfileAssetUrl(kind, publicUrl);
  return publicUrl;
}
