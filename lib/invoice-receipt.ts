import { calculateTotals } from "@/lib/calculations";
import { formatMoney } from "@/lib/currency-display";
import {
  dbInvoiceToApp,
  profileToCompanySettings,
} from "@/lib/invoice-mapper";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/data/site";
import type { InvoiceWithItems, ProfileRow } from "@/types/database";

export type InvoiceReceiptData = {
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  paidAt: string;
  amount: number;
  currencyCode: string;
  amountDisplay: string;
  paymentMethod: string;
  transactionId: string | null;
  merchant: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gstin: string | null;
  };
  client: {
    name: string;
    email: string;
    company: string;
  };
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatReceiptDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildInvoiceReceiptData(input: {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  paidAt: string;
  amount: number;
  currencyCode: string;
  paymentMethod: string;
  transactionId: string | null;
  merchant: InvoiceReceiptData["merchant"];
  client: InvoiceReceiptData["client"];
}): InvoiceReceiptData {
  const receiptSuffix = input.transactionId
    ? input.transactionId.slice(-8).toUpperCase()
    : input.invoiceId.replace(/-/g, "").slice(-8).toUpperCase();

  return {
    receiptNumber: `RCP-${receiptSuffix}`,
    invoiceId: input.invoiceId,
    invoiceNumber: input.invoiceNumber,
    invoiceDate: input.invoiceDate,
    paidAt: input.paidAt,
    amount: input.amount,
    currencyCode: input.currencyCode,
    amountDisplay: formatMoney(input.amount, input.currencyCode),
    paymentMethod: input.paymentMethod,
    transactionId: input.transactionId,
    merchant: input.merchant,
    client: input.client,
  };
}

export async function fetchInvoiceReceiptData(
  invoiceId: string
): Promise<InvoiceReceiptData | null> {
  const admin = createAdminClient();

  const { data: invoiceRow } = await admin
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", invoiceId)
    .single();

  if (!invoiceRow || invoiceRow.status !== "paid") {
    return null;
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", invoiceRow.user_id)
    .single();

  if (!profile) return null;

  const company = profileToCompanySettings(profile as ProfileRow);
  const invoice = dbInvoiceToApp(invoiceRow as InvoiceWithItems, company);
  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );

  const { data: paymentRow } = await admin
    .from("razorpay_payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .eq("purpose", "invoice")
    .eq("status", "paid")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const paidAt =
    paymentRow?.updated_at ??
    invoiceRow.updated_at ??
    invoice.updatedAt ??
    new Date().toISOString();

  return buildInvoiceReceiptData({
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoice.invoiceNumber,
    invoiceDate: invoice.invoice.invoiceDate,
    paidAt,
    amount: totals.total,
    currencyCode: invoice.currencyCode,
    paymentMethod: paymentRow?.razorpay_payment_id ? "Razorpay" : "Manual payment",
    transactionId: paymentRow?.razorpay_payment_id ?? null,
    merchant: {
      name: company.companyName || "Merchant",
      email: company.companyEmail || "",
      phone: company.companyPhone || "",
      address: company.companyAddress || "",
      gstin: company.gstin?.trim() || null,
    },
    client: {
      name: invoice.client.name || "Client",
      email: invoice.client.email || "",
      company: invoice.client.company || "",
    },
  });
}

export function buildInvoiceReceiptHtml(data: InvoiceReceiptData): string {
  const paidDate = formatReceiptDate(data.paidAt);
  const invoiceDate = formatReceiptDate(
    data.invoiceDate.includes("T")
      ? data.invoiceDate
      : `${data.invoiceDate}T12:00:00`
  );

  const merchantLines = [
    data.merchant.email,
    data.merchant.phone,
    data.merchant.gstin ? `GSTIN: ${data.merchant.gstin}` : null,
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:4px 0 0;font-size:12px;color:#94a3b8">${escapeHtml(line!)}</p>`)
    .join("");

  const clientLines = [
    data.client.company,
    data.client.email,
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:4px 0 0;font-size:12px;color:#64748b">${escapeHtml(line!)}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 40px; color: #111111; background: #f4f4f4; }
  .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e2e2; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  .head { background: linear-gradient(135deg, #0a0a0a 0%, #222222 100%); color: #fff; padding: 28px 32px 24px; position: relative; }
  .head h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
  .head .sub { margin: 6px 0 0; font-size: 13px; opacity: 0.8; }
  .paid-badge { position: absolute; top: 24px; right: 24px; background: #ffffff; color: #111111; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; padding: 6px 12px; border-radius: 999px; }
  .amount-block { margin: -20px 32px 0; padding: 20px 24px; background: linear-gradient(135deg, #111111, #333333); border-radius: 12px; color: #fff; }
  .amount-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.9; }
  .amount-value { margin-top: 6px; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
  .body { padding: 28px 32px 8px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .block-title { margin: 0 0 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #555555; }
  .block-name { margin: 0; font-size: 14px; font-weight: 700; color: #111111; }
  .rows { border-top: 1px solid #f1f5f9; }
  .row { display: flex; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .row:last-child { border-bottom: none; }
  .label { color: #666666; flex-shrink: 0; }
  .value { font-weight: 600; text-align: right; color: #111111; word-break: break-word; }
  .foot { padding: 16px 32px 24px; background: #f8fafc; font-size: 11px; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; }
</style></head><body>
<div class="card" id="invoice-receipt-root">
  <div class="head">
    <span class="paid-badge">PAID</span>
    <h1>Payment receipt</h1>
    <p class="sub">${escapeHtml(data.merchant.name)}</p>
  </div>
  <div class="amount-block">
    <div class="amount-label">Amount received</div>
    <div class="amount-value">${escapeHtml(data.amountDisplay)}</div>
  </div>
  <div class="body">
    <div class="grid">
      <div>
        <p class="block-title">Received from</p>
        <p class="block-name">${escapeHtml(data.client.name)}</p>
        ${clientLines}
      </div>
      <div>
        <p class="block-title">Issued by</p>
        <p class="block-name">${escapeHtml(data.merchant.name)}</p>
        ${merchantLines}
      </div>
    </div>
    <div class="rows">
      <div class="row"><span class="label">Receipt #</span><span class="value">${escapeHtml(data.receiptNumber)}</span></div>
      <div class="row"><span class="label">Invoice #</span><span class="value">${escapeHtml(data.invoiceNumber)}</span></div>
      <div class="row"><span class="label">Invoice date</span><span class="value">${escapeHtml(invoiceDate)}</span></div>
      <div class="row"><span class="label">Payment date</span><span class="value">${escapeHtml(paidDate)}</span></div>
      <div class="row"><span class="label">Payment method</span><span class="value">${escapeHtml(data.paymentMethod)}</span></div>
      ${data.transactionId ? `<div class="row"><span class="label">Transaction ID</span><span class="value">${escapeHtml(data.transactionId)}</span></div>` : ""}
    </div>
  </div>
  <div class="foot">
  This receipt confirms payment for invoice ${escapeHtml(data.invoiceNumber)}.
  ${data.merchant.address ? `<br/>${escapeHtml(data.merchant.address).replace(/\n/g, "<br/>")}` : ""}
  <br/>Generated via ${escapeHtml(siteConfig.name)}.
  </div>
</div>
</body></html>`;
}
