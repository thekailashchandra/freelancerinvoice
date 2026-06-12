import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  amountToPaise,
  createRazorpayClient,
  getUserRazorpayCredentials,
} from "@/lib/razorpay-server";
import {
  getInvoiceTemplate,
  getTemplatePricing,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in to pay with Razorpay.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  const credentials = await getUserRazorpayCredentials(user.id);
  if (!credentials) {
    return NextResponse.json(
      {
        error:
          "Add your Razorpay Test/Live keys in Settings to receive payments.",
        code: "RAZORPAY_NOT_CONFIGURED",
      },
      { status: 400 }
    );
  }

  let body: { templateId?: InvoiceTemplateId; market?: "IN" | "GLOBAL" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const templateId = body.templateId ?? "modern";
  const template = getInvoiceTemplate(templateId);
  if (!template.isPremium) {
    return NextResponse.json({ error: "Template is free." }, { status: 400 });
  }

  const market = body.market === "IN" ? "IN" : "GLOBAL";
  const pricing = getTemplatePricing(market);
  const amountPaise = pricing.amountMinor;
  const currency = pricing.currency;
  const razorpay = createRazorpayClient(credentials);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: `tpl_${templateId}`.slice(0, 40),
    notes: {
      purpose: "template",
      template_id: templateId,
      user_id: user.id,
      market,
    },
  });

  const admin = createAdminClient();
  await admin.from("razorpay_payments").insert({
    user_id: user.id,
    purpose: "template",
    template_id: templateId,
    razorpay_order_id: order.id,
    amount_paise: amountPaise,
    currency,
    status: "created",
    metadata: { market, displayAmount: pricing.displayAmount },
  });

  return NextResponse.json({
    ok: true,
    keyId: credentials.keyId,
    orderId: order.id,
    amountPaise,
    currency,
    merchantName: "Invoice for Freelance",
    description: `${template.name} template unlock`,
    templateId,
  });
}
