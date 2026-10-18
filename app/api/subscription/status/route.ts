import { NextResponse } from "next/server";
import { getSubscriptionAccess } from "@/lib/subscription-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getSubscriptionAccess();
  return NextResponse.json({
    active: access.active,
    status: access.status,
    plan: access.plan,
    startedAt: access.startedAt,
    expiresAt: access.expiresAt,
    billingEnabled: access.billingEnabled,
    checkoutAvailable: access.checkoutAvailable,
    dodoCheckoutAvailable: access.dodoCheckoutAvailable,
    source: access.source,
  });
}
