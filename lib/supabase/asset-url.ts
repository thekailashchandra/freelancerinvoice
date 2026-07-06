import type { SupabaseClient } from "@supabase/supabase-js";
import {
  INVOICE_ASSETS_BUCKET,
} from "@/lib/supabase/asset-storage";

const PUBLIC_OBJECT_PREFIX = `/storage/v1/object/public/${INVOICE_ASSETS_BUCKET}/`;
const SIGNED_OBJECT_PREFIX = `/storage/v1/object/sign/${INVOICE_ASSETS_BUCKET}/`;

export function extractInvoiceAssetPath(
  stored: string | null | undefined
): string | null {
  if (!stored?.trim()) return null;
  const value = stored.trim();

  const publicIdx = value.indexOf(PUBLIC_OBJECT_PREFIX);
  if (publicIdx >= 0) {
    return decodeURIComponent(value.slice(publicIdx + PUBLIC_OBJECT_PREFIX.length));
  }

  const signedIdx = value.indexOf(SIGNED_OBJECT_PREFIX);
  if (signedIdx >= 0) {
    const rest = value.slice(signedIdx + SIGNED_OBJECT_PREFIX.length);
    return decodeURIComponent(rest.split("?")[0] ?? rest);
  }

  if (!value.includes("://") && value.includes("/")) {
    return value.replace(/^\/+/, "");
  }

  return null;
}

export async function resolveAssetDisplayUrl(
  stored: string | null | undefined,
  supabase: SupabaseClient
): Promise<string | null> {
  if (!stored?.trim()) return null;

  const path = extractInvoiceAssetPath(stored);
  if (!path) return stored;

  const { data, error } = await supabase.storage
    .from(INVOICE_ASSETS_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) return stored;
  return data.signedUrl;
}

export async function resolveProfileAssetUrls<
  T extends { logo_url?: string | null; signature_url?: string | null },
>(profile: T, supabase: SupabaseClient): Promise<T> {
  const [logo_url, signature_url] = await Promise.all([
    resolveAssetDisplayUrl(profile.logo_url, supabase),
    resolveAssetDisplayUrl(profile.signature_url, supabase),
  ]);

  return {
    ...profile,
    logo_url: logo_url ?? profile.logo_url,
    signature_url: signature_url ?? profile.signature_url,
  };
}
