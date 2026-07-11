import { NextResponse } from "next/server";
import {
  deleteProfileAsset,
  uploadInvoiceAsset,
  uploadProfileAsset,
} from "@/lib/profile-assets-repository";
import type { AssetKind } from "@/lib/supabase/asset-storage";

function parseKindParam(value: string | null): AssetKind | null {
  if (value === "logo" || value === "signature") return value;
  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const scope = formData.get("scope");
    const result =
      scope === "invoice"
        ? await uploadInvoiceAsset(formData)
        : await uploadProfileAsset(formData);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const kind = parseKindParam(new URL(request.url).searchParams.get("kind"));
    if (!kind) {
      return NextResponse.json({ error: "Invalid asset type." }, { status: 400 });
    }

    const result = await deleteProfileAsset(kind);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
