export const INVOICE_ASSETS_BUCKET = "invoice-assets";

export type AssetKind = "logo" | "signature";

export function buildAssetObjectPath(
  userId: string,
  kind: AssetKind,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "png";
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)
    ? ext
    : "png";
  return `${userId}/${kind}.${safeExt}`;
}

export function getAssetColumn(kind: AssetKind): "logo_url" | "signature_url" {
  return kind === "logo" ? "logo_url" : "signature_url";
}
