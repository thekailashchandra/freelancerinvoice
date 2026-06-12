import { NextResponse } from "next/server";
import { uploadInvoiceAsset, uploadProfileAsset } from "@/lib/profile-assets-repository";

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
