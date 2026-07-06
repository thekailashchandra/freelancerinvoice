import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchInvoiceReceiptData } from "@/lib/invoice-receipt";
import { verifyReceiptToken } from "@/lib/receipt-token";

type RouteContext = { params: Promise<{ invoiceId: string }> };

async function canAccessReceipt(
  invoiceId: string,
  token: string | null
): Promise<boolean> {
  if (verifyReceiptToken(invoiceId, token)) return true;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .maybeSingle();

  return Boolean(data);
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { invoiceId } = await context.params;
    const token = request.nextUrl.searchParams.get("token");

    if (!(await canAccessReceipt(invoiceId, token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
