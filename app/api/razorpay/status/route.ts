import { NextResponse } from "next/server";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";
import { isPlatformRazorpayConfigured } from "@/lib/razorpay-server";

export async function GET() {
  const enabled = isRazorpayEnabled();
  return NextResponse.json({
    enabled,
    templateCheckout: enabled && isPlatformRazorpayConfigured(),
  });
}
