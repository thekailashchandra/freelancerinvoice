import { NextResponse } from "next/server";
import { getAuthenticatedRazorpayAccess } from "@/lib/razorpay-access";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";

export async function GET() {
  const access = await getAuthenticatedRazorpayAccess();

  return NextResponse.json({
    enabled: isRazorpayEnabled(),
    isOwner: access.isOwner,
    templateCheckout: access.templateCheckout,
    invoiceCheckout: access.invoiceCheckout,
  });
}
