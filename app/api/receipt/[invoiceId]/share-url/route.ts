import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createReceiptToken } from "@/lib/receipt-token";
import { invoiceReceiptUrl } from "@/lib/invoice-receipt-url";
import { siteConfig } from "@/data/site";

type RouteContext = { params: Promise<{ invoiceId: string }> };

/** Authenticated invoice owner - returns a shareable receipt URL with signed token. */
export async function GET(_request: Request, context: RouteContext) {
  const { invoiceId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status !== "paid") {
    return NextResponse.json(
      { error: "Receipt is available for paid invoices only." },
      { status: 400 }
    );
  }

  const token = createReceiptToken(invoiceId);
  const origin = siteConfig.url.replace(/\/$/, "");

  return NextResponse.json({
    ok: true,
    url: invoiceReceiptUrl(invoiceId, { origin, token }),
    token,
  });
}
