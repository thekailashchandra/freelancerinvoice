import { NextRequest, NextResponse } from "next/server";
import {
  getPlatformRazorpayCredentials,
  getUserRazorpayCredentials,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay-server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = body.razorpay_order_id?.trim();
  const paymentId = body.razorpay_payment_id?.trim();
  const signature = body.razorpay_signature?.trim();

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { error: "Missing Razorpay payment fields." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: paymentRow } = await admin
    .from("razorpay_payments")
    .select("*")
    .eq("razorpay_order_id", orderId)
    .single();

  if (!paymentRow) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const credentials =
    paymentRow.purpose === "template"
      ? getPlatformRazorpayCredentials()
      : await getUserRazorpayCredentials(paymentRow.user_id);
  if (!credentials) {
    return NextResponse.json(
      { error: "Payment verification unavailable." },
      { status: 400 }
    );
  }

  const valid = verifyRazorpayPaymentSignature(
    orderId,
    paymentId,
    signature,
    credentials.keySecret
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
  }

  await admin
    .from("razorpay_payments")
    .update({
      razorpay_payment_id: paymentId,
      status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentRow.id);

  if (paymentRow.purpose === "invoice" && paymentRow.invoice_id) {
    await admin
      .from("invoices")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", paymentRow.invoice_id)
      .eq("user_id", paymentRow.user_id);
  }

  return NextResponse.json({
    ok: true,
    purpose: paymentRow.purpose,
    invoiceId: paymentRow.invoice_id,
    templateId: paymentRow.template_id,
    paymentId,
    orderId,
  });
}
