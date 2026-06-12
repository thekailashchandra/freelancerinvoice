import { NextRequest, NextResponse } from "next/server";
import { calculateTotals } from "@/lib/calculations";
import {
  amountToPaise,
  createRazorpayClient,
  getInvoiceOwnerRazorpayCredentials,
} from "@/lib/razorpay-server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  dbInvoiceToApp,
  profileToCompanySettings,
} from "@/lib/invoice-mapper";
import type { InvoiceWithItems, ProfileRow } from "@/types/database";

async function loadPayableInvoice(invoiceId: string) {
  const admin = createAdminClient();
  const { data: invoiceRow } = await admin
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", invoiceId)
    .single();

  if (!invoiceRow) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", invoiceRow.user_id)
    .single();

  if (!profile) return null;

  const company = profileToCompanySettings(profile as ProfileRow);
  const invoice = dbInvoiceToApp(invoiceRow as InvoiceWithItems, company);
  return { invoice, userId: invoiceRow.user_id as string, company };
}

export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get("invoiceId");
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
  }

  const loaded = await loadPayableInvoice(invoiceId);
  if (!loaded) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const { invoice, company } = loaded;
  const owner = await getInvoiceOwnerRazorpayCredentials(invoiceId);

  if (!owner) {
    return NextResponse.json(
      {
        error: "Razorpay is not configured for this invoice.",
        code: "RAZORPAY_NOT_CONFIGURED",
      },
      { status: 400 }
    );
  }

  if (invoice.status === "paid" || invoice.status === "void") {
    return NextResponse.json(
      { error: "This invoice cannot be paid.", code: "INVOICE_LOCKED" },
      { status: 400 }
    );
  }

  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );

  return NextResponse.json({
    ok: true,
    invoice: {
      id: invoice.id,
      number: invoice.invoice.invoiceNumber,
      status: invoice.status,
      currencyCode: invoice.currencyCode,
      total: totals.total,
      dueDate: invoice.invoice.dueDate,
      clientName: invoice.client.name,
    },
    merchant: {
      name: company.companyName || "Merchant",
      email: company.companyEmail,
    },
    razorpayConfigured: true,
    keyId: owner.credentials.keyId,
  });
}

export async function POST(request: NextRequest) {
  let body: { invoiceId?: string; customerEmail?: string; customerName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const invoiceId = body.invoiceId?.trim();
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
  }

  const loaded = await loadPayableInvoice(invoiceId);
  if (!loaded) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const { invoice, userId } = loaded;
  const owner = await getInvoiceOwnerRazorpayCredentials(invoiceId);
  if (!owner) {
    return NextResponse.json(
      {
        error: "Razorpay is not configured for this invoice.",
        code: "RAZORPAY_NOT_CONFIGURED",
      },
      { status: 400 }
    );
  }

  if (invoice.status === "paid" || invoice.status === "void") {
    return NextResponse.json(
      { error: "This invoice cannot be paid.", code: "INVOICE_LOCKED" },
      { status: 400 }
    );
  }

  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );
  const currency = invoice.currencyCode === "INR" ? "INR" : "INR";
  const amountPaise = amountToPaise(totals.total);
  const razorpay = createRazorpayClient(owner.credentials);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency,
    receipt: `inv_${invoice.invoice.invoiceNumber}`.slice(0, 40),
    notes: {
      purpose: "invoice",
      invoice_id: invoice.id,
      invoice_number: invoice.invoice.invoiceNumber,
      user_id: userId,
    },
  });

  const admin = createAdminClient();
  await admin.from("razorpay_payments").insert({
    user_id: userId,
    invoice_id: invoiceId,
    purpose: "invoice",
    razorpay_order_id: order.id,
    amount_paise: amountPaise,
    currency,
    status: "created",
    customer_email: body.customerEmail?.trim() || invoice.client.email || null,
    customer_name: body.customerName?.trim() || invoice.client.name || null,
    metadata: {
      invoice_number: invoice.invoice.invoiceNumber,
      total: totals.total,
    },
  });

  return NextResponse.json({
    ok: true,
    keyId: owner.credentials.keyId,
    orderId: order.id,
    amountPaise,
    currency,
    merchantName: loaded.company.companyName || "Merchant",
    description: `Invoice ${invoice.invoice.invoiceNumber}`,
  });
}
