import { calculateTotals } from "@/lib/calculations";
import { invoiceMoneyHtml } from "@/lib/currency-display";
import { getInvoicePageSpec, resolveInvoicePageSize } from "@/lib/invoice-design";
import { formatMinimalFooterYear } from "@/lib/invoice-minimal-dates";
import {
  invoicePoweredByHtml,
  shouldShowInvoiceBranding,
} from "@/lib/invoice-branding";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import {
  buildInvoiceSummaryTaxLinesHtml,
  getInvoiceSummaryTaxLines,
} from "@/lib/invoice-tax-display";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
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

const labelColor = "#6b7280";
const bodyColor = "#4b5563";

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
  const shipping = totals.shippingFee ?? 0;
  const paymentTerms =
    invoice.invoice.paymentTerms?.trim() || "Due on receipt";

  const footerYear = formatMinimalFooterYear(invoice.invoice.invoiceDate);
  const notesText = invoice.notes?.trim();
  const termsText = invoice.termsAndConditions?.trim();

  const closingLine = invoice.company.companyName
    ? `Have a nice day and thank you! ${escapeHtml(invoice.company.companyName.split(" ")[0])}`
    : "Have a nice day and thank you!";

  const paymentOptions = invoicePaymentDisplayOptions(invoice.company.companyName);
  const paymentLines = getInvoicePaymentInfo(invoice.payment, paymentOptions);

  const metaItems = [
    { label: "Issue Date", value: formatDate(invoice.invoice.invoiceDate) },
    invoice.invoice.dueDate
      ? { label: "Due Date", value: formatDate(invoice.invoice.dueDate) }
      : null,
    { label: "Terms", value: paymentTerms },
    invoice.invoice.purchaseOrder?.trim()
      ? { label: "P.O.#", value: invoice.invoice.purchaseOrder.trim() }
      : null,
    invoice.invoice.projectName?.trim()
      ? { label: "Project", value: invoice.invoice.projectName.trim() }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  const metaHtml = metaItems
    .map(
      (item) =>
        `<div style="display:flex;gap:12px;font-family:${F};font-size:11px;line-height:18px"><span style="color:${labelColor};letter-spacing:0.06em">${escapeHtml(item.label)}</span><span style="color:#111827;font-weight:500">${escapeHtml(item.value)}</span></div>`
    )
    .join("");

  const clientLines = [
    invoice.client.company
      ? `<div style="margin-top:6px;font-family:${F};font-size:12px;font-weight:500;color:${bodyColor}">${escapeHtml(invoice.client.company)}</div>`
      : "",
    invoice.client.address
      ? `<div style="margin-top:8px;font-family:${F};font-size:12px;line-height:18px;color:${bodyColor};white-space:pre-wrap">${escapeHtml(invoice.client.address)}</div>`
      : "",
    invoice.client.email
      ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:${bodyColor}">${escapeHtml(invoice.client.email)}</div>`
      : "",
    invoice.client.phone
      ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:${bodyColor}">${escapeHtml(invoice.client.phone)}</div>`
      : "",
    invoice.client.gstin?.trim()
      ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:${bodyColor}">GSTIN: ${escapeHtml(invoice.client.gstin.trim())}</div>`
      : "",
  ].join("");

  const serviceRows = invoice.services
    .map((item) => {
      const lineAmount = item.quantity * item.price;
      const desc = item.description
        ? ` <span style="color:${labelColor}">— ${escapeHtml(item.description)}</span>`
        : "";
      return `<tr>
        ${cell(`valign="top" style="padding:12px 8px 12px 0;font-family:${F};font-size:13px;color:${bodyColor};border-bottom:1px solid #f3f4f6"`, `<span style="font-weight:600;color:#111827">${escapeHtml(item.name || "Service")}</span>${desc}`)}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;color:${bodyColor};border-bottom:1px solid #f3f4f6"`, invoiceMoneyHtml(item.price, currency))}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;color:${bodyColor};border-bottom:1px solid #f3f4f6"`, formatInvoiceAmount(item.quantity))}
        ${cell(`align="right" valign="top" style="padding:12px 0;font-family:${F};font-size:13px;font-weight:600;color:#111827;border-bottom:1px solid #f3f4f6"`, invoiceMoneyHtml(lineAmount, currency))}
      </tr>`;
    })
    .join("");

  const discountRow =
    totals.discountAmount > 0
      ? `<div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:#059669"><span>Discount</span><span>− ${invoiceMoneyHtml(totals.discountAmount, currency)}</span></div>`
      : "";

  const taxRowStyle = `display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:${bodyColor}`;
  const taxRows = buildInvoiceSummaryTaxLinesHtml(
    getInvoiceSummaryTaxLines({
      totals,
      taxOn,
      taxLabel: invoice.taxLabel,
      taxAmt,
      taxPct,
    }),
    currency,
    taxRowStyle,
    escapeHtml
  );

  const shippingRow =
    shipping > 0
      ? `<div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:${bodyColor}"><span>Shipping</span>${invoiceMoneyHtml(shipping, currency)}</div>`
      : "";

  const paymentBlock = hasInvoicePaymentInfo(invoice.payment, paymentOptions)
    ? `<div style="margin-top:28px"><div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${labelColor}">Payment Information</div>${paymentLines
        .map(
          (line) =>
            `<div style="margin-top:8px;font-family:${F};font-size:12px;line-height:19px;color:${bodyColor}"><span style="font-weight:600;color:#111827">${escapeHtml(line.label)}:</span> ${escapeHtml(line.value)}</div>`
        )
        .join("")}</div>`
    : "";

  const notesBlock = notesText
    ? `<div><div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${labelColor}">Notes</div><div style="margin-top:12px;font-family:${F};font-size:12px;line-height:20px;color:${bodyColor};max-width:520px;white-space:pre-wrap">${escapeHtml(notesText)}</div></div>`
    : "";

  const termsBlock = termsText
    ? `<div style="margin-top:28px"><div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${labelColor}">Terms &amp; Conditions</div><div style="margin-top:12px;font-family:${F};font-size:12px;line-height:20px;color:${bodyColor};max-width:520px;white-space:pre-wrap">${escapeHtml(termsText)}</div></div>`
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
    ${companyContactDetailsHtml(invoice.company, { font: F, color: labelColor, marginTop: 6, fullAddress: true })}
  </td>
</tr></table>

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:40px"><tr>
  <td width="55%" valign="top">
    <div style="font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${labelColor}">Recipient</div>
    <div style="margin-top:10px;font-family:${F};font-size:14px;font-weight:600">${escapeHtml(invoice.client.name || "Client name")}</div>
    ${clientLines}
  </td>
  <td width="45%" valign="top" align="right">
    <div style="font-family:${F};font-size:42px;font-weight:700;line-height:1">INVOICE</div>
    <div style="margin-top:16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${labelColor}">Invoice Number</div>
    <div style="margin-top:6px;font-family:${F};font-size:13px;font-weight:500">${escapeHtml(invoice.invoice.invoiceNumber)}</div>
    <div style="margin-top:20px;display:flex;flex-direction:column;gap:6px;align-items:flex-end">${metaHtml}</div>
  </td>
</tr></table>

<table width="${W}" style="table-layout:fixed">
<colgroup><col /><col width="72" /><col width="56" /><col width="88" /></colgroup>
<thead><tr>
  ${["Description", "Rate", "Qty", "Amount"].map((col, i) => cell(`${i >= 1 ? 'align="right"' : ""} style="padding:0 0 14px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${labelColor};border-bottom:1px solid #e5e7eb"`, col)).join("")}
</tr></thead>
<tbody>${serviceRows}</tbody>
</table>

<div style="margin-top:8px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:right">
  <div style="display:inline-block;width:220px;text-align:left">
    <div style="display:flex;justify-content:space-between;padding:4px 0;font-family:${F};font-size:12px;color:${bodyColor}"><span>Subtotal</span>${invoiceMoneyHtml(totals.subtotal, currency)}</div>
    ${discountRow}
    ${taxRows}
    ${shippingRow}
    <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;font-family:${F};font-size:14px;font-weight:700"><span>TOTAL</span>${invoiceMoneyHtml(totals.total, currency)}</div>
  </div>
</div>

<div style="margin-top:40px">
  ${notesBlock}
  ${paymentBlock}
  ${termsBlock}
  <div style="margin-top:28px;font-family:${F};font-size:12px;color:${labelColor}">${closingLine}</div>
</div>

</div>

${companySignatureBlockHtml(invoice.company, { font: F, maxHeight: d.signature.maxHeight, maxWidth: d.signature.maxWidth, align: "right" })}

<p style="margin:48px 0 0;text-align:center;font-family:${F};font-size:10px;color:#9ca3af;letter-spacing:0.02em">${escapeHtml(invoice.company.companyName || "Your business")}. All Rights Reserved © ${footerYear}${invoice.company.companyEmail ? ` · ${escapeHtml(invoice.company.companyEmail)}` : ""}</p>

${shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding) ? invoicePoweredByHtml() : ""}

</div></body></html>`;
}
