import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  const rawBody = await request.text();

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook");
    return NextResponse.json(
      { error: "Webhook verification is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (
    !signature ||
    !verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)
  ) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string; status?: string } };
      refund?: { entity?: { payment_id?: string; id?: string } };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const admin = createAdminClient();
  const eventName = event.event ?? "";

  if (eventName === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    if (orderId && paymentId) {
      await admin
        .from("razorpay_payments")
        .update({
          razorpay_payment_id: paymentId,
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", orderId);

      const { data: row } = await admin
        .from("razorpay_payments")
        .select("invoice_id, user_id, purpose")
        .eq("razorpay_order_id", orderId)
        .single();

      if (row?.purpose === "invoice" && row.invoice_id) {
        await admin
          .from("invoices")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", row.invoice_id)
          .eq("user_id", row.user_id);
      }

      void logActivity({
        actorId: row?.user_id ?? null,
        action: "payment.completed",
        resourceType: "payment",
        resourceId: paymentId,
        metadata: {
          orderId,
          purpose: row?.purpose,
          invoiceId: row?.invoice_id,
        },
      });
    }
  }

  if (eventName === "payment.failed") {
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    if (orderId) {
      await admin
        .from("razorpay_payments")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", orderId);

      const { data: row } = await admin
        .from("razorpay_payments")
        .select("user_id, purpose, invoice_id")
        .eq("razorpay_order_id", orderId)
        .maybeSingle();

      void logActivity({
        actorId: row?.user_id ?? null,
        action: "payment.failed",
        resourceType: "payment",
        resourceId: paymentId ?? orderId,
        metadata: {
          orderId,
          purpose: row?.purpose,
          invoiceId: row?.invoice_id,
        },
      });
    }
  }

  if (eventName === "refund.processed") {
    const refund = event.payload?.refund?.entity;
    const paymentId = refund?.payment_id;
    if (paymentId) {
      await admin
        .from("razorpay_payments")
        .update({
          status: "refunded",
          updated_at: new Date().toISOString(),
          metadata: { refund_id: refund?.id },
        })
        .eq("razorpay_payment_id", paymentId);
    }
  }

  return NextResponse.json({ ok: true });
}
