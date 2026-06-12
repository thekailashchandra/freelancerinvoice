import { NextResponse } from "next/server";
import { fetchInvoiceReceiptData } from "@/lib/invoice-receipt";

type RouteContext = { params: Promise<{ invoiceId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { invoiceId } = await context.params;
    const receipt = await fetchInvoiceReceiptData(invoiceId);

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not available. Invoice must be paid." },
        { status: 404 }
      );
    }

    return NextResponse.json(receipt);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not load receipt",
      },
      { status: 500 }
    );
  }
}
