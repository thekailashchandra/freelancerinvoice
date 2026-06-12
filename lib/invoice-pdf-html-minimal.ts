import { calculateTotals } from "@/lib/calculations";
import { invoiceMoneyHtml } from "@/lib/currency-display";
import { getInvoicePageSpec, resolveInvoicePageSize } from "@/lib/invoice-design";
import {
  formatMinimalFooterYear,
  formatMinimalTableDate,
} from "@/lib/invoice-minimal-dates";
import {
  invoicePoweredByHtml,
  shouldShowInvoiceBranding,
} from "@/lib/invoice-branding";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import { formatInvoiceAmount } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";
import {
  companyContactDetailsHtml,
  companyLogoMarkHtml,
  companySignatureBlockHtml,
} from "@/lib/invoice-company-identity";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cell(attrs = "", inner = ""): string {
  return `<td ${attrs}>${inner}</td>`;
}

export function buildMinimalInvoicePdfHtml(invoice: Invoice): string {
  const d = resolveTemplateDesign(invoice.templateId ?? "minimal");
  const F = d.pdfFont;
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const W = pageSpec.contentWidthPx;
  const pad = pageSpec.paddingPx + 8;

  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );
  const currency = invoice.currencyCode;
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxPct =
    invoice.taxDiscount.taxPercentage ??
    invoice.taxDiscount.gstPercentage ??
    0;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const tableDate = formatMinimalTableDate(invoice.invoice.invoiceDate);
  const footerYear = formatMinimalFooterYear(invoice.invoice.invoiceDate);

  const notesText =
    invoice.notes?.trim() ||
    invoice.termsAndConditions?.trim() ||
    "Payment should be paid in full within the due date shown on this invoice.";

  const closingLine = invoice.company.companyName
    ? `Have a nice day and thank you! ${escapeHtml(invoice.company.companyName.split(" ")[0])}`
    : "Have a nice day and thank you!";

  const clientLines = [
    invoice.client.address
      ? `<div style="margin-top:8px;font-family:${F};font-size:12px;line-height:18px;color:#888888;white-space:pre-wrap">${escapeHtml(invoice.client.address)}</div>`
      : "",
    invoice.client.email
      ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:#888888">${escapeHtml(invoice.client.email)}</div>`
      : "",
    invoice.client.phone
      ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:#888888">${escapeHtml(invoice.client.phone)}</div>`
      : "",
  ].join("");

  const serviceRows = invoice.services
    .map((item, index) => {
      const lineAmount = item.quantity * item.price;
      const desc = item.description
        ? ` <span style="color:#888888">— ${escapeHtml(item.description)}</span>`
        : "";
      return `<tr>
        ${cell(`width="108" valign="top" style="padding:12px 0;font-family:${F};font-size:11px;font-weight:600;letter-spacing:0.04em;color:#888888"`, index === 0 ? tableDate : "")}
        ${cell(`valign="top" style="padding:12px 8px 12px 0;font-family:${F};font-size:13px;color:#374151"`, `${escapeHtml(item.name || "Service")}${desc}`)}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;color:#374151"`, invoiceMoneyHtml(item.price, currency))}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;color:#374151"`, formatInvoiceAmount(item.quantity))}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;color:#111827"`, invoiceMoneyHtml(lineAmount, currency))}
      </tr>`;
    })
    .join("");

  const discountRow =
    totals.discountAmount > 0
      ? `<div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:#888888"><span>Discount</span><span>− ${invoiceMoneyHtml(totals.discountAmount, currency)}</span></div>`
      : "";

  const taxRow = taxOn
    ? `<div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:#888888"><span>${escapeHtml(invoice.taxLabel || "Tax")} ${taxPct.toFixed(2)}%</span>${invoiceMoneyHtml(taxAmt, currency)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" />
<style>
  html,body{margin:0;padding:0;background:#fff}
  body{width:${pageSpec.widthPx}px;padding:${pad}px;font-family:${F};color:#111827}
  table{border-collapse:collapse} img{border:0}
</style></head>
<body>
<div id="invoice-root" style="display:flex;flex-direction:column;min-height:${pageSpec.heightPx - pad * 2}px;width:${W}px;font-family:${F}">

<div style="flex:1;min-height:0">

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:48px"><tr>
  <td valign="top">${companyLogoMarkHtml(invoice.company, { font: F, variant: "minimal" })}</td>
  <td valign="top" align="right">
    <div style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase">${escapeHtml(invoice.company.companyName || "Your business")}</div>
    ${companyContactDetailsHtml(invoice.company, { font: F, color: "#888888", marginTop: 6, fullAddress: true })}
  </td>
</tr></table>

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:40px"><tr>
  <td width="55%" valign="top">
    <div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#888888">Recipient</div>
    <div style="margin-top:10px;font-family:${F};font-size:14px;font-weight:600">${escapeHtml(invoice.client.name || "Client name")}</div>
    ${clientLines}
  </td>
  <td width="45%" valign="top" align="right">
    <div style="font-family:${F};font-size:42px;font-weight:700;line-height:1">INVOICE</div>
    <div style="margin-top:16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#888888">Invoice Number</div>
    <div style="margin-top:6px;font-family:${F};font-size:13px;font-weight:500">${escapeHtml(invoice.invoice.invoiceNumber)}</div>
  </td>
</tr></table>

<table width="${W}" style="table-layout:fixed">
<colgroup><col width="108" /><col /><col width="72" /><col width="56" /><col width="88" /></colgroup>
<thead><tr>
  ${["Invoice Date", "Task Description", "Rate", "Qty", "Amount"].map((col, i) => cell(`${i >= 2 ? 'align="right"' : ""} style="padding:0 0 14px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888888"`, col)).join("")}
</tr></thead>
<tbody>${serviceRows}</tbody>
</table>

<div style="margin-top:8px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:right">
  <div style="display:inline-block;width:220px;text-align:left">
    <div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:#888888"><span>Subtotal</span>${invoiceMoneyHtml(totals.subtotal, currency)}</div>
    ${discountRow}
    ${taxRow}
    <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;font-family:${F};font-size:14px;font-weight:700"><span>TOTAL</span>${invoiceMoneyHtml(totals.total, currency)}</div>
  </div>
</div>

<div style="margin-top:48px">
  <div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#888888">Notes</div>
  <div style="margin-top:12px;font-family:${F};font-size:12px;line-height:20px;color:#888888;max-width:480px;white-space:pre-wrap">${escapeHtml(notesText)}</div>
  <div style="margin-top:16px;font-family:${F};font-size:12px;color:#888888">${closingLine}</div>
</div>

</div>

${companySignatureBlockHtml(invoice.company, { font: F, maxHeight: d.signature.maxHeight, maxWidth: d.signature.maxWidth, align: "right" })}

<p style="margin:48px 0 0;text-align:center;font-family:${F};font-size:10px;color:#aaaaaa;letter-spacing:0.02em">${escapeHtml(invoice.company.companyName || "Your business")}. All Rights Reserved © ${footerYear}${invoice.company.companyEmail ? ` · ${escapeHtml(invoice.company.companyEmail)}` : ""}</p>

${shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding) ? invoicePoweredByHtml() : ""}

</div></body></html>`;
}
