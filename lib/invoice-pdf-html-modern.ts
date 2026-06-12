import { calculateTotals } from "@/lib/calculations";
import { invoiceMoneyHtml } from "@/lib/currency-display";
import {
  getInvoicePageSpec,
  getLogoDimensions,
  resolveInvoicePageSize,
  resolveLogoHeight,
} from "@/lib/invoice-design";
import {
  formatModernHeaderDate,
  formatModernMetaDate,
} from "@/lib/invoice-modern-dates";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
} from "@/lib/invoice-payment-display";
import {
  invoicePoweredByHtml,
  shouldShowInvoiceBranding,
} from "@/lib/invoice-branding";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import { formatInvoiceAmount } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

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

function row(label: string, value: string, currency: string, amount: number): string {
  return `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#374151"><span>${label}</span>${invoiceMoneyHtml(amount, currency)}</div>`;
}

export function buildModernInvoicePdfHtml(invoice: Invoice): string {
  const d = resolveTemplateDesign(invoice.templateId ?? "modern");
  const F = d.pdfFont;
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const W = pageSpec.contentWidthPx;
  const logo = getLogoDimensions(resolveLogoHeight(invoice.company.logoHeight));
  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    invoice.taxLabel
  );
  const currency = invoice.currencyCode;
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const companyTagline =
    invoice.company.companyEmail?.trim() ||
    invoice.company.companyPhone?.trim() ||
    "";

  const logoMark = invoice.company.logo
    ? `<img src="${invoice.company.logo}" alt="" style="display:block;width:${logo.height}px;height:${logo.height}px;object-fit:contain;background:#111827;border:0" />`
    : `<div style="width:${logo.height}px;height:${logo.height}px;background:#111827;color:#fff;font-family:${F};font-size:${Math.round(logo.height * 0.38)}px;font-weight:bold;text-align:center;line-height:${logo.height}px">${escapeHtml((invoice.company.companyName || "Y").charAt(0).toUpperCase())}</div>`;

  const serviceRows = invoice.services
    .map((item, index) => {
      const border =
        index < invoice.services.length - 1
          ? "border-bottom:1px solid #e5e7eb;"
          : "";
      const lineAmount = item.quantity * item.price;
      return `<tr>
        ${cell(`width="40" valign="top" style="padding:16px 8px 14px;${border}font-family:${F};font-size:12px;color:#374151"`, String(index + 1).padStart(2, "0"))}
        ${cell(`valign="top" style="padding:16px 8px 14px;${border}"`, `<div style="font-family:${F};font-size:13px;font-weight:bold">${escapeHtml(item.name || "Service")}</div>${item.description ? `<div style="margin-top:4px;font-family:${F};font-size:11px;line-height:16px;color:#6b7280;white-space:pre-wrap">${escapeHtml(item.description)}</div>` : ""}`)}
        ${cell(`width="88" align="right" valign="top" style="padding:16px 8px 14px;${border}font-family:${F};font-size:12px;color:#374151"`, invoiceMoneyHtml(item.price, currency))}
        ${cell(`width="72" align="right" valign="top" style="padding:16px 8px 14px;${border}font-family:${F};font-size:12px;color:#374151"`, formatInvoiceAmount(item.quantity))}
        ${cell(`width="96" align="right" valign="top" style="padding:16px 8px 14px;${border}font-family:${F};font-size:12px;font-weight:bold"`, invoiceMoneyHtml(lineAmount, currency))}
      </tr>`;
    })
    .join("");

  const paymentLines = getInvoicePaymentInfo(invoice.payment)
    .map(
      (line) =>
        `<div style="margin:0 0 6px;font-family:${F};font-size:11px;line-height:16px;color:#374151"><strong>${escapeHtml(line.label)}:</strong> ${escapeHtml(line.value)}</div>`
    )
    .join("");

  const paymentBlock = hasInvoicePaymentInfo(invoice.payment)
    ? `<td width="33%" valign="top"><div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Payment Info</div>${paymentLines}</td>`
    : `<td width="33%" valign="top"></td>`;

  const termsText =
    invoice.termsAndConditions?.trim() ||
    invoice.notes?.trim() ||
    "Payment is due by the date shown above. Thank you for your business.";

  const signatureBlock = invoice.company.signature
    ? `<img src="${invoice.company.signature}" alt="" style="display:block;max-height:${d.signature.maxHeight}px;max-width:${d.signature.maxWidth}px;object-fit:contain;margin-bottom:8px;border:0" />`
    : `<div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-style:italic;margin-bottom:8px">${escapeHtml(invoice.company.companyName?.split(" ")[0] || "Manager")}</div>`;

  const discountRow =
    totals.discountAmount > 0
      ? row("Discount", "", currency, totals.discountAmount)
      : "";
  const taxRow = taxOn ? row("Tax", "", currency, taxAmt) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" />
<style>
  html,body{margin:0;padding:0;background:#fff}
  body{width:${pageSpec.widthPx}px;padding:${pageSpec.paddingPx}px;font-family:${F}}
  table{border-collapse:collapse} img{border:0}
</style></head>
<body>
<div id="invoice-root" style="display:flex;flex-direction:column;min-height:${pageSpec.heightPx - pageSpec.paddingPx * 2}px;width:${W}px;font-family:${F};color:#111827">

<div style="flex:1;min-height:0">

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:28px"><tr>
  <td valign="top">
    <table cellpadding="0" cellspacing="0"><tr>
      <td valign="top" style="padding-right:14px">${logoMark}</td>
      <td valign="top">
        <div style="font-family:${F};font-size:16px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase">${escapeHtml(invoice.company.companyName || "Your business")}</div>
        ${companyTagline ? `<div style="margin-top:6px;font-family:${F};font-size:11px;color:#6b7280">${escapeHtml(companyTagline)}</div>` : ""}
      </td>
    </tr></table>
  </td>
  <td valign="top" align="right">
    <div style="font-family:${F};font-size:36px;font-weight:800;letter-spacing:0.06em">INVOICE</div>
    <div style="margin-top:10px;font-family:${F};font-size:11px;font-weight:600;letter-spacing:0.06em;color:#374151">${formatModernHeaderDate(invoice.invoice.invoiceDate)}</div>
  </td>
</tr></table>

<div style="background:#f2f2f2;padding:22px 24px;margin-bottom:20px">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="50%" valign="top" style="padding-right:16px">
      <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Invoice To</div>
      <div style="font-family:${F};font-size:14px;font-weight:bold">${escapeHtml(invoice.client.name || "Client name")}</div>
      ${invoice.client.company ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:#374151">${escapeHtml(invoice.client.company)}</div>` : ""}
      ${invoice.client.address ? `<div style="margin-top:6px;font-family:${F};font-size:12px;line-height:18px;color:#6b7280;white-space:pre-wrap">${escapeHtml(invoice.client.address)}</div>` : ""}
      ${invoice.client.phone ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:#6b7280">${escapeHtml(invoice.client.phone)}</div>` : ""}
    </td>
    <td width="50%" valign="top" style="padding-left:16px">
      <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Ship To</div>
      <div style="font-family:${F};font-size:12px;font-weight:bold;color:#374151">${invoice.client.company ? "Office Address" : "Billing Address"}</div>
      <div style="margin-top:6px;font-family:${F};font-size:12px;line-height:18px;color:#6b7280;white-space:pre-wrap">${escapeHtml(invoice.client.address || invoice.client.email || "—")}</div>
      ${invoice.client.phone ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:#6b7280">${escapeHtml(invoice.client.phone)}</div>` : ""}
    </td>
  </tr></table>
</div>

<div style="display:flex;justify-content:space-between;margin-bottom:24px;font-family:${F};font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase">
  <span>Date: ${formatModernMetaDate(invoice.invoice.invoiceDate)}</span>
  <span>Invoice No: ${escapeHtml(invoice.invoice.invoiceNumber)}</span>
</div>

<table width="${W}" style="table-layout:fixed;border-collapse:collapse">
<colgroup><col width="40" /><col /><col width="88" /><col width="72" /><col width="96" /></colgroup>
<thead><tr style="border-bottom:2px solid #111827">
  ${cell(`style="padding:10px 8px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase"`, "No")}
  ${cell(`style="padding:10px 8px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase"`, "Item Description")}
  ${cell(`align="right" style="padding:10px 8px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase"`, "Price")}
  ${cell(`align="right" style="padding:10px 8px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase"`, "Quantity")}
  ${cell(`align="right" style="padding:10px 8px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase"`, "Total")}
</tr></thead>
<tbody>${serviceRows}</tbody>
</table>

<table width="${W}" style="margin-top:28px"><tr>
  <td valign="top" width="55%">
    <div style="font-family:${F};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Total Due</div>
    <div style="padding:20px 24px;background:repeating-linear-gradient(-45deg,#f2f2f2 0,#f2f2f2 10px,#e8e8e8 10px,#e8e8e8 20px);border:1px solid #e5e7eb">
      <div style="font-family:${F};font-size:32px;font-weight:800;line-height:1.1">${invoiceMoneyHtml(totals.total, currency)}</div>
    </div>
  </td>
  <td valign="bottom" width="45%" align="right">
    ${row("Subtotal", "", currency, totals.subtotal)}
    ${discountRow}
    ${taxRow}
    <div style="display:flex;justify-content:space-between;padding:10px 0 0;margin-top:6px;border-top:2px solid #111827;font-family:${F};font-size:13px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase"><span>Grand Total</span>${invoiceMoneyHtml(totals.total, currency)}</div>
  </td>
</tr></table>

<table width="${W}" style="margin-top:36px"><tr>
  ${paymentBlock}
  <td width="33%" valign="top" style="padding:0 12px">
    <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Terms &amp; Condition</div>
    <div style="font-family:${F};font-size:10px;line-height:16px;color:#6b7280;white-space:pre-wrap">${escapeHtml(termsText)}</div>
  </td>
  <td width="33%" valign="top">
    <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Account Manager</div>
    ${signatureBlock}
    <div style="font-family:${F};font-size:11px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">${escapeHtml(invoice.company.companyName || "Your business")}</div>
  </td>
</tr></table>

${invoice.company.companyEmail || invoice.company.companyPhone ? `<div style="margin-top:28px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px">Questions?</div>
<div style="font-family:${F};font-size:11px;color:#374151">${invoice.company.companyEmail ? `Email: <strong>${escapeHtml(invoice.company.companyEmail)}</strong>` : ""}${invoice.company.companyEmail && invoice.company.companyPhone ? " · " : ""}${invoice.company.companyPhone ? `Phone: <strong>${escapeHtml(invoice.company.companyPhone)}</strong>` : ""}</div>` : ""}

<div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-family:${F};font-size:10px;color:#6b7280">
  <span>${escapeHtml(invoice.company.companyAddress || "")}${invoice.company.companyEmail ? `${invoice.company.companyAddress ? " · " : ""}${escapeHtml(invoice.company.companyEmail)}` : ""}</span>
  <span>${invoice.company.companyPhone ? "☎ " : ""}${invoice.company.companyEmail ? "✉" : ""}</span>
</div>

</div>

${shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding) ? invoicePoweredByHtml() : ""}

</div></body></html>`;
}
