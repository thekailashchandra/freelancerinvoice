import { calculateTotals } from "@/lib/calculations";
import { invoiceMoneyHtml } from "@/lib/currency-display";
import {
  getInvoicePageSpec,
  resolveInvoicePageSize,
} from "@/lib/invoice-design";
import {
  getSimpleFooterTagline,
  getSimpleHeaderMessage,
  simpleTemplateColors as c,
} from "@/lib/invoice-simple-theme";
import {
  invoicePoweredByHtml,
  shouldShowInvoiceBranding,
} from "@/lib/invoice-branding";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";
import { hasInvoicePaymentInfo } from "@/lib/invoice-payment-display";
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

export function buildBoldInvoicePdfHtml(invoice: Invoice): string {
  const d = resolveTemplateDesign(invoice.templateId ?? "bold");
  const F = d.pdfFont;
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const W = pageSpec.contentWidthPx;
  const pad = pageSpec.paddingPx;

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

  const headerMessage = escapeHtml(getSimpleHeaderMessage(invoice));
  const footerTagline = escapeHtml(getSimpleFooterTagline(invoice));
  const termsText = escapeHtml(
    invoice.termsAndConditions?.trim() ||
      "Payment is due by the date shown on this invoice. Late payments may incur additional fees."
  );

  const swiftLine =
    invoice.payment.iban?.trim() ||
    invoice.payment.routingNumber?.trim() ||
    invoice.payment.sortCode?.trim() ||
    "";

  const paymentBlock = hasInvoicePaymentInfo(invoice.payment)
    ? `${invoice.payment.bankName?.trim() ? `<p style="margin:0 0 8px;font-family:${F};font-size:12px;color:${c.textMuted}"><span style="font-weight:600;color:${c.text}">Bank Name:</span> ${escapeHtml(invoice.payment.bankName)}</p>` : ""}
       <p style="margin:0 0 8px;font-family:${F};font-size:12px;color:${c.textMuted}"><span style="font-weight:600;color:${c.text}">Account Name:</span> ${escapeHtml(invoice.company.companyName || "—")}</p>
       ${invoice.payment.accountNumber?.trim() ? `<p style="margin:0 0 8px;font-family:${F};font-size:12px;color:${c.textMuted}"><span style="font-weight:600;color:${c.text}">Account Number:</span> ${escapeHtml(invoice.payment.accountNumber)}</p>` : ""}
       ${swiftLine ? `<p style="margin:0 0 8px;font-family:${F};font-size:12px;color:${c.textMuted}"><span style="font-weight:600;color:${c.text}">SWIFT Code:</span> ${escapeHtml(swiftLine)}</p>` : ""}
       ${invoice.payment.upiId?.trim() ? `<p style="margin:0;font-family:${F};font-size:12px;color:${c.textMuted}"><span style="font-weight:600;color:${c.text}">UPI ID:</span> ${escapeHtml(invoice.payment.upiId)}</p>` : ""}`
    : `<p style="margin:0;font-family:${F};font-size:12px;color:${c.textMuted}">Add payment details in the invoice form.</p>`;

  const serviceRows = invoice.services
    .map((item) => {
      const lineAmount = item.quantity * item.price;
      return `<tr>
        ${cell(`valign="top" style="padding:14px 12px 14px 0;font-family:${F};font-size:13px;color:${c.text}"`, `<div style="font-weight:600">${escapeHtml(item.name || "Service")}</div>${item.description ? `<div style="margin-top:4px;font-size:11px;color:${c.textMuted}">${escapeHtml(item.description)}</div>` : ""}`)}
        ${cell(`align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:13px;color:${c.text};border-left:1px solid ${c.line}"`, formatInvoiceAmount(item.quantity))}
        ${cell(`align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:13px;color:${c.text};border-left:1px solid ${c.line}"`, invoiceMoneyHtml(item.price, currency))}
        ${cell(`align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:13px;font-weight:600;color:${c.text};border-left:1px solid ${c.line}"`, invoiceMoneyHtml(lineAmount, currency))}
      </tr>`;
    })
    .join("");

  const discountRow =
    totals.discountAmount > 0
      ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-family:${F};font-size:12px;color:${c.textMuted}"><span>Discount</span><span>− ${invoiceMoneyHtml(totals.discountAmount, currency)}</span></div>`
      : "";
  const taxRow = taxOn
    ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-family:${F};font-size:12px;color:${c.textMuted}"><span>${escapeHtml(invoice.taxLabel || "Vat")} (${taxPct.toFixed(0)}%)</span>${invoiceMoneyHtml(taxAmt, currency)}</div>`
    : "";
  const shippingRow =
    shipping > 0
      ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-family:${F};font-size:12px;color:${c.textMuted}"><span>Shipping</span>${invoiceMoneyHtml(shipping, currency)}</div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" />
<style>
  html,body{margin:0;padding:0;background:${c.bg}}
  body{width:${pageSpec.widthPx}px;padding:${pad}px;font-family:${F};color:${c.text};background:${c.bg}}
  table{border-collapse:collapse} img{border:0}
</style></head>
<body>
<div id="invoice-root" style="display:flex;flex-direction:column;min-height:${pageSpec.heightPx - pad * 2}px;width:${W}px;font-family:${F};background:${c.bg}">

<div style="flex:1;min-height:0">

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:28px"><tr>
  <td valign="top">
    <table cellpadding="0" cellspacing="0"><tr>
      <td valign="top" style="padding-right:16px">${companyLogoMarkHtml(invoice.company, { font: F, variant: "bold" })}</td>
      <td valign="top">
        <div style="font-family:${F};font-size:15px;font-weight:700;color:${c.text}">${escapeHtml(invoice.company.companyName || "Your business")}</div>
        ${companyContactDetailsHtml(invoice.company, { font: F, color: c.textMuted, marginTop: 6, fullAddress: true })}
      </td>
    </tr></table>
  </td>
</tr></table>

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:28px"><tr>
  <td valign="top">
    <div style="font-family:${F};font-size:11px;color:${c.textMuted}">Invoice Number</div>
    <div style="margin-top:6px;font-family:${F};font-size:13px;font-weight:700">#${escapeHtml(invoice.invoice.invoiceNumber)}</div>
  </td>
  <td valign="top" align="right">
    <div style="max-width:320px;font-family:${F};font-size:13px;font-weight:700;line-height:20px;text-align:right">${headerMessage}</div>
  </td>
</tr></table>

<div style="margin-bottom:32px">
  <div style="font-family:${F};font-size:56px;font-weight:800;letter-spacing:-0.02em;line-height:1">INVOICE</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>
    <td style="border-bottom:1px solid ${c.line}"></td>
    <td width="20" align="right" style="font-family:${F};font-size:14px;color:${c.textMuted};padding-left:8px">→</td>
  </tr></table>
</div>

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:36px"><tr>
  <td width="50%" valign="top">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:48px" valign="top">
        <div style="font-family:${F};font-size:11px;color:${c.textMuted}">Date</div>
        <div style="margin-top:6px;font-family:${F};font-size:13px">${escapeHtml(formatDate(invoice.invoice.invoiceDate))}</div>
      </td>
      <td valign="top">
        <div style="font-family:${F};font-size:11px;color:${c.textMuted}">Due Date</div>
        <div style="margin-top:6px;font-family:${F};font-size:13px">${escapeHtml(formatDate(invoice.invoice.dueDate))}</div>
      </td>
    </tr></table>
  </td>
  <td width="50%" valign="top">
    <div style="font-family:${F};font-size:11px;color:${c.textMuted}">Billed To</div>
    <div style="margin-top:6px;font-family:${F};font-size:13px;font-weight:700">${escapeHtml(invoice.client.name || "Client name")}</div>
    ${invoice.client.address ? `<div style="margin-top:6px;font-family:${F};font-size:13px;white-space:pre-wrap">${escapeHtml(invoice.client.address)}</div>` : ""}
    ${invoice.client.email ? `<div style="margin-top:6px;font-family:${F};font-size:13px">${escapeHtml(invoice.client.email)}</div>` : ""}
  </td>
</tr></table>

<table width="${W}" cellpadding="0" cellspacing="0" style="border-top:1px solid ${c.line}"><tr>
  <td width="32%" valign="top" style="padding:24px 24px 24px 0;border-right:1px solid ${c.line}">
    <div style="font-family:${F};font-size:13px;font-weight:800;margin-bottom:16px">Payment Details:</div>
    ${paymentBlock}
    <div style="margin-top:32px">
      <div style="font-family:${F};font-size:13px;font-weight:800;margin-bottom:10px">Terms &amp; Conditions</div>
      <div style="font-family:${F};font-size:10px;line-height:16px;color:${c.textMuted};white-space:pre-wrap">${termsText}</div>
    </div>
  </td>
  <td width="68%" valign="top" style="padding:24px 0 0 24px">
    <table width="100%" style="table-layout:fixed">
      <colgroup><col /><col width="56" /><col width="88" /><col width="96" /></colgroup>
      <thead><tr style="border-bottom:1px solid ${c.line}">
        ${cell(`style="padding:0 12px 12px 0;font-family:${F};font-size:12px;font-weight:800"`, "Product Name")}
        ${cell(`align="right" style="padding:0 12px 12px;font-family:${F};font-size:12px;font-weight:800;border-left:1px solid ${c.line}"`, "Qty")}
        ${cell(`align="right" style="padding:0 12px 12px;font-family:${F};font-size:12px;font-weight:800;border-left:1px solid ${c.line}"`, "Unit Price")}
        ${cell(`align="right" style="padding:0 12px 12px;font-family:${F};font-size:12px;font-weight:800;border-left:1px solid ${c.line}"`, "Sub Total")}
      </tr></thead>
      <tbody>${serviceRows}</tbody>
    </table>
    <div style="margin-top:8px;border-top:1px solid ${c.line};padding-top:12px;text-align:right">
      <div style="display:inline-block;width:240px;text-align:left">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-family:${F};font-size:12px;color:${c.textMuted}"><span>Sub Total</span>${invoiceMoneyHtml(totals.subtotal, currency)}</div>
        ${discountRow}
        ${taxRow}
        ${shippingRow}
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:1px solid ${c.line};font-family:${F};font-size:16px;font-weight:800"><span>Total</span>${invoiceMoneyHtml(totals.total, currency)}</div>
      </div>
    </div>
  </td>
</tr></table>

</div>

${companySignatureBlockHtml(invoice.company, { font: F, maxHeight: d.signature.maxHeight, maxWidth: d.signature.maxWidth, align: "right" })}

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-top:40px;border-top:1px solid ${c.line}"><tr>
  <td width="33%" valign="top" style="padding-top:20px;font-family:${F};font-size:11px;color:${c.textMuted}">
    <div style="font-weight:700;color:${c.text}">${escapeHtml(invoice.company.companyName || "Your business")}</div>
    ${invoice.company.companyAddress ? `<div style="margin-top:6px;white-space:pre-wrap">${escapeHtml(invoice.company.companyAddress)}</div>` : ""}
    ${invoice.company.gstin?.trim() ? `<div style="margin-top:4px">GSTIN: ${escapeHtml(invoice.company.gstin.trim())}</div>` : ""}
  </td>
  <td width="34%" valign="top" align="center" style="padding-top:20px;font-family:${F};font-size:11px;color:${c.textMuted}">
    ${invoice.company.companyPhone ? `<div>${escapeHtml(invoice.company.companyPhone)}</div>` : ""}
    ${invoice.company.companyEmail ? `<div style="margin-top:4px">${escapeHtml(invoice.company.companyEmail)}</div>` : ""}
  </td>
  <td width="33%" valign="top" align="right" style="padding-top:20px;font-family:${F};font-size:11px;font-style:italic;color:${c.textMuted}">${footerTagline}</td>
</tr></table>

${shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding) ? invoicePoweredByHtml() : ""}

</div></body></html>`;
}
