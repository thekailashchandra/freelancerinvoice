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

  const clientLines = [
    data.client.company,
    data.client.email,
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:4px 0 0;font-size:12px;color:#666666">${escapeHtml(line!)}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 40px; color: #111111; background: #f4f4f4; }
  .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dddddd; }
  .head { display: flex; justify-content: space-between; gap: 16px; padding: 26px 32px; border-bottom: 1px solid #e6e6e6; }
  .head .label { margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #777777; }
  .head h1 { margin: 6px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #111111; }
  .paid-badge { align-self: flex-start; background: #111111; color: #ffffff; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; padding: 6px 12px; border-radius: 999px; }
  .body { padding: 26px 32px 28px; }
  .amount-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #777777; }
  .amount-value { margin-top: 6px; font-size: 38px; font-weight: 700; letter-spacing: -0.03em; color: #111111; }
  .grid { display: flex; gap: 24px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e6e6e6; }
  .grid > div { flex: 1; min-width: 0; }
  .block-title { margin: 0 0 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #777777; }
  .block-name { margin: 0; font-size: 14px; font-weight: 600; color: #111111; }
  .muted { margin: 4px 0 0; font-size: 12px; color: #666666; }
  .rows { margin-top: 20px; border-top: 1px solid #e6e6e6; }
  .row { display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-bottom: 1px solid #eeeeee; font-size: 13px; }
  .row:last-child { border-bottom: none; }
  .label { color: #666666; flex-shrink: 0; }
  .value { font-weight: 600; text-align: right; color: #111111; word-break: break-word; }
  .foot { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e6e6e6; font-size: 11px; color: #777777; line-height: 1.6; }
</style></head><body>
<div class="card" id="invoice-receipt-root">
  <div class="head">
    <div>
      <p class="label">Payment receipt</p>
      <h1>${escapeHtml(data.merchant.name)}</h1>
    </div>
    <span class="paid-badge">PAID</span>
  </div>
  <div class="body">
    <div class="amount-label">Amount received</div>
    <div class="amount-value">${escapeHtml(data.amountDisplay)}</div>
    <div class="grid">
      <div>
        <p class="block-title">Received from</p>
        <p class="block-name">${escapeHtml(data.client.name)}</p>
        ${clientLines}
      </div>
      <div>
        <p class="block-title">Invoice</p>
        <p class="block-name">${escapeHtml(data.invoiceNumber)}</p>
        <p class="muted">${escapeHtml(data.receiptNumber)}</p>
      </div>
    </div>
    <div class="rows">
      <div class="row"><span class="label">Payment date</span><span class="value">${escapeHtml(paidDate)}</span></div>
      <div class="row"><span class="label">Payment method</span><span class="value">${escapeHtml(data.paymentMethod)}</span></div>
      ${data.transactionId ? `<div class="row"><span class="label">Transaction ID</span><span class="value">${escapeHtml(data.transactionId)}</span></div>` : ""}
    </div>
    <div class="foot">
      This receipt confirms payment for invoice ${escapeHtml(data.invoiceNumber)}.
      ${data.merchant.address ? `<br/>${escapeHtml(data.merchant.address).replace(/\n/g, "<br/>")}` : ""}
      <br/>Generated via ${escapeHtml(siteConfig.name)}.
    </div>
  </div>
</div>
</body></html>`;
}
