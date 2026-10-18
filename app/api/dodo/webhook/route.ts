import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDodoProductId, getDodoWebhookKey } from "@/lib/dodo-payments";
import type { SubscriptionBillingInterval, SubscriptionPlanId } from "@/lib/subscription";
import { activateSubscription } from "@/lib/subscription-server";

export const dynamic = "force-dynamic";

type DodoPaymentPayload = {
  payment_id: string;
  status?: string;
  metadata?: Record<string, string> | null;
  customer?: { email?: string; customer_id?: string } | null;
  product_cart?: Array<{ product_id?: string }> | null;
};

function resolvePlan(
  metadata: Record<string, string> | null | undefined,
  productId: string | undefined
): { plan: SubscriptionPlanId; interval: SubscriptionBillingInterval } | null {
  if (metadata?.plan === "cloud_yearly") {
    return { plan: "cloud_yearly", interval: "yearly" };
  }
  if (metadata?.plan === "cloud_monthly") {
    return { plan: "cloud_monthly", interval: "monthly" };
  }
  if (productId && productId === getDodoProductId("yearly")) {
    return { plan: "cloud_yearly", interval: "yearly" };
  }
  if (productId && productId === getDodoProductId("monthly")) {
    return { plan: "cloud_monthly", interval: "monthly" };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const webhookKey = getDodoWebhookKey();
  if (!webhookKey) {
    console.error("DODO_PAYMENTS_WEBHOOK_KEY is not set");
    return NextResponse.json(
      { error: "Webhook verification is not configured." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
  };

  try {
    await new Webhook(webhookKey).verify(rawBody, headers);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: { type?: string; data?: DodoPaymentPayload };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded" || !event.data?.payment_id) {
    return NextResponse.json({ ok: true });
  }

  const data = event.data;
  const resolved = resolvePlan(data.metadata, data.product_cart?.[0]?.product_id);

  if (!resolved) {
    console.error("Dodo payment did not include a recognized Cloud plan", {
      paymentId: data.payment_id,
      productId: data.product_cart?.[0]?.product_id,
    });
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  let userId = data.metadata?.user_id?.trim() || null;

  if (!userId && data.customer?.email) {
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", data.customer.email)
      .maybeSingle();
    userId = profile?.id ?? null;
  }

  if (!userId) {
    console.error("Dodo payment could not match a user", {
      paymentId: data.payment_id,
      customerId: data.customer?.customer_id,
    });
    return NextResponse.json({ ok: true });
  }

  await activateSubscription(
    userId,
    data.payment_id,
    resolved.interval,
    "dodo"
  );

  return NextResponse.json({ ok: true });
}
