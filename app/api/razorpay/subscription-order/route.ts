import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createRazorpayClient,
  getPlatformRazorpayCredentials,
} from "@/lib/razorpay-server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getSubscriptionPricing,
  isCloudBillingEnabled,
  isSelfHostedMode,
  type SubscriptionBillingInterval,
} from "@/lib/subscription";
import { isSubscriptionSchemaReady } from "@/lib/subscription-server";
import type { MarketRegion } from "@/lib/geo-market";
import { readCountryFromHeaders, resolveMarketFromCountry } from "@/lib/geo-market";
import { siteConfig } from "@/data/site";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (isSelfHostedMode() || !isCloudBillingEnabled()) {
    return NextResponse.json(
      {
        error: "Cloud billing is disabled on this deployment.",
        code: "BILLING_DISABLED",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to subscribe.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  const schemaReady = await isSubscriptionSchemaReady();
  const credentials = getPlatformRazorpayCredentials();
  if (!credentials) {
    return NextResponse.json(
      {
        error: "Cloud billing is not configured on the server.",
        code: "RAZORPAY_PLATFORM_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  let body: {
    market?: MarketRegion;
    interval?: SubscriptionBillingInterval;
  } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const detectedCountry = readCountryFromHeaders(request.headers);
  const market: MarketRegion = detectedCountry
    ? resolveMarketFromCountry(detectedCountry)
    : body.market === "IN"
      ? "IN"
      : "GLOBAL";
  const interval: SubscriptionBillingInterval =
    body.interval === "yearly" ? "yearly" : "monthly";
  const pricing = getSubscriptionPricing(market, interval);
  const razorpay = createRazorpayClient(credentials);

  const order = await razorpay.orders.create({
    amount: pricing.amountMinor,
    currency: pricing.currency,
    receipt: `sub_${user.id.slice(0, 8)}_${Date.now()}`.slice(0, 40),
    notes: {
      purpose: "subscription",
      plan: pricing.planId,
      interval,
      user_id: user.id,
      market,
    },
  });

  const admin = createAdminClient();
  const { error } = await admin.from("razorpay_payments").insert({
    user_id: user.id,
    purpose: schemaReady ? "subscription" : "template",
    template_id: schemaReady ? null : "cloud_monthly",
    razorpay_order_id: order.id,
    amount_paise: pricing.amountMinor,
    currency: pricing.currency,
    status: "created",
    metadata: {
      kind: "cloud_subscription",
      plan: pricing.planId,
      interval,
      market,
      displayAmount: pricing.displayAmount,
      periodDays: pricing.periodDays,
      schemaReady,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    keyId: credentials.keyId,
    orderId: order.id,
    amountPaise: pricing.amountMinor,
    currency: pricing.currency,
    merchantName: siteConfig.name,
    description: `Cloud plan · ${pricing.displayAmount}${pricing.intervalLabel}`,
    market,
    interval,
    planId: pricing.planId,
    displayAmount: pricing.displayAmount,
  });
}
