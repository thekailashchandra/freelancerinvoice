import { calculateTotals } from "@/lib/calculations";
import { invoiceMoneyHtml } from "@/lib/currency-display";
import {
  getInvoicePageSpec,
  resolveInvoicePageSize,
} from "@/lib/invoice-design";
import {
  formatModernHeaderDate,
  formatModernMetaDate,
  modernTotalDuePattern,
} from "@/lib/invoice-modern-dates";
import { modernTheme as t } from "@/lib/invoice-modern-theme";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import {
  invoicePoweredByHtml,
  shouldShowInvoiceBranding,
} from "@/lib/invoice-branding";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
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

function metaChip(label: string, value: string, font: string): string {
  return `<div style="display:inline-block;vertical-align:top;margin:0 10px 10px 0;padding:10px 14px;background:${t.cardBg};border:1px solid ${t.border};border-radius:${t.radiusSm}px">
    <div style="font-family:${font};font-size:9px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${t.textMuted}">${escapeHtml(label)}</div>
    <div style="margin-top:4px;font-family:${font};font-size:12px;font-weight:600;color:${t.text}">${escapeHtml(value)}</div>
  </div>`;
}

function infoCard(title: string, body: string, font: string): string {
  return `<div style="background:${t.cardBg};border:1px solid ${t.border};border-radius:${t.radius}px;padding:18px 20px">
    <div style="font-family:${font};font-size:10px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${t.accent};margin-bottom:10px">${escapeHtml(title)}</div>
    ${body}
  </div>`;
}

export function buildModernInvoicePdfHtml(invoice: Invoice): string {
  const d = resolveTemplateDesign(invoice.templateId ?? "modern");
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
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const serviceRows = invoice.services
    .map((item, index) => {
      const bg = index % 2 === 1 ? t.rowAlt : t.cardBg;
      const lineAmount = item.quantity * item.price;
      return `<tr style="background:${bg}">
        ${cell(`width="44" valign="top" style="padding:14px 12px;font-family:${F};font-size:11px;font-weight:600;color:${t.textMuted}"`, String(index + 1).padStart(2, "0"))}
        ${cell(`valign="top" style="padding:14px 12px"`, `<div style="font-family:${F};font-size:13px;font-weight:bold;color:${t.text}">${escapeHtml(item.name || "Service")}</div>${item.description ? `<div style="margin-top:4px;font-family:${F};font-size:11px;line-height:16px;color:${t.textMuted};white-space:pre-wrap">${escapeHtml(item.description)}</div>` : ""}`)}
        ${cell(`width="88" align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:12px;color:${t.textSecondary}"`, invoiceMoneyHtml(item.price, currency))}
        ${cell(`width="72" align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:12px;color:${t.textSecondary}"`, formatInvoiceAmount(item.quantity))}
        ${cell(`width="96" align="right" valign="top" style="padding:14px 12px;font-family:${F};font-size:12px;font-weight:bold;color:${t.text}"`, invoiceMoneyHtml(lineAmount, currency))}
      </tr>`;
    })
    .join("");

  const paymentOptions = invoicePaymentDisplayOptions(invoice.company.companyName);
  const paymentLines = getInvoicePaymentInfo(invoice.payment, paymentOptions)
    .map(
      (line) =>
        `<div style="margin:0 0 6px;font-family:${F};font-size:11px;line-height:16px;color:${t.textSecondary}"><strong style="color:${t.text}">${escapeHtml(line.label)}:</strong> ${escapeHtml(line.value)}</div>`
    )
    .join("");

  const termsText =
    invoice.termsAndConditions?.trim() ||
    invoice.notes?.trim() ||
    "Payment is due by the date shown above. Thank you for your business.";

  const metaChips = [
    metaChip("Issue Date", formatModernMetaDate(invoice.invoice.invoiceDate), F),
    invoice.invoice.dueDate
      ? metaChip("Due Date", formatDate(invoice.invoice.dueDate), F)
      : "",
    invoice.invoice.purchaseOrder?.trim()
      ? metaChip("P.O. Number", invoice.invoice.purchaseOrder.trim(), F)
      : "",
    invoice.invoice.projectName?.trim()
      ? metaChip("Project", invoice.invoice.projectName.trim(), F)
      : "",
  ].join("");

  const discountRow =
    totals.discountAmount > 0
      ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-family:${F};font-size:12px;color:#059669"><span>Discount</span>${invoiceMoneyHtml(totals.discountAmount, currency)}</div>`
      : "";
  const taxRow = taxOn
    ? `<div style="display:flex;justify-content:space-between;padding:5px 0;font-family:${F};font-size:12px;color:${t.textSecondary}"><span>${escapeHtml(invoice.taxLabel || "Tax")}</span>${invoiceMoneyHtml(taxAmt, currency)}</div>`
    : "";

  const contactFooter = [
    invoice.company.companyEmail?.trim(),
    invoice.company.companyPhone?.trim(),
    invoice.company.gstin?.trim()
      ? `GSTIN: ${invoice.company.gstin.trim()}`
      : null,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(line as string))
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" />
<style>
  html,body{margin:0;padding:0;background:${t.surface}}
  body{width:${pageSpec.widthPx}px;font-family:${F}}
  table{border-collapse:collapse} img{border:0}
</style></head>
<body>
<div id="invoice-root" style="display:flex;flex-direction:column;min-height:${pageSpec.heightPx}px;width:${pageSpec.widthPx}px;font-family:${F};color:${t.text};background:${t.surface}">

<div style="background:${t.headerGradient};padding:${pad}px ${pad}px 28px;color:${t.textOnDark}">
<table width="${W}" cellpadding="0" cellspacing="0"><tr>
  <td valign="top">
    <table cellpadding="0" cellspacing="0"><tr>
      <td valign="top" style="padding-right:16px">${companyLogoMarkHtml(invoice.company, { font: F, variant: "modern" })}</td>
      <td valign="top">
        <div style="font-family:${F};font-size:15px;font-weight:bold;color:${t.textOnDark}">${escapeHtml(invoice.company.companyName || "Your business")}</div>
        ${companyContactDetailsHtml(invoice.company, { font: F, color: t.textOnDarkMuted, marginTop: 6, fullAddress: true })}
      </td>
    </tr></table>
  </td>
  <td valign="top" align="right">
    <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px">Invoice</div>
    <div style="font-family:${F};font-size:22px;font-weight:800;letter-spacing:0.04em">${escapeHtml(invoice.invoice.invoiceNumber)}</div>
    <div style="margin-top:8px;font-family:${F};font-size:11px;color:${t.textOnDarkMuted}">${formatModernHeaderDate(invoice.invoice.invoiceDate)}</div>
  </td>
</tr></table>
</div>

<div style="padding:0 ${pad}px ${pad}px;margin-top:-16px">

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:18px"><tr>
  <td width="49%" valign="top" style="padding-right:7px">
    ${infoCard(
      "Bill To",
      `<div style="font-family:${F};font-size:15px;font-weight:bold;color:${t.text}">${escapeHtml(invoice.client.name || "Client name")}</div>
      ${invoice.client.company ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:${t.textSecondary}">${escapeHtml(invoice.client.company)}</div>` : ""}
      ${invoice.client.address ? `<div style="margin-top:8px;font-family:${F};font-size:12px;line-height:18px;color:${t.textMuted};white-space:pre-wrap">${escapeHtml(invoice.client.address)}</div>` : ""}
      ${invoice.client.email ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:${t.textMuted}">${escapeHtml(invoice.client.email)}</div>` : ""}
      ${invoice.client.phone ? `<div style="margin-top:4px;font-family:${F};font-size:12px;color:${t.textMuted}">${escapeHtml(invoice.client.phone)}</div>` : ""}`,
      F
    )}
  </td>
  <td width="2%"></td>
  <td width="49%" valign="top" style="padding-left:7px">
    ${infoCard(
      "Ship To",
      `<div style="font-family:${F};font-size:12px;font-weight:bold;color:${t.textSecondary}">${invoice.client.company ? "Office Address" : "Billing Address"}</div>
      <div style="margin-top:8px;font-family:${F};font-size:12px;line-height:18px;color:${t.textMuted};white-space:pre-wrap">${escapeHtml(invoice.client.address || invoice.client.email || "—")}</div>
      ${invoice.client.phone ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:${t.textMuted}">${escapeHtml(invoice.client.phone)}</div>` : ""}`,
      F
    )}
  </td>
</tr></table>

<div style="margin-bottom:22px">${metaChips}</div>

<div style="background:${t.cardBg};border:1px solid ${t.border};border-radius:${t.radius}px;overflow:hidden;margin-bottom:24px">
<table width="100%" style="table-layout:fixed">
<colgroup><col width="44" /><col /><col width="88" /><col width="72" /><col width="96" /></colgroup>
<thead><tr style="background:${t.tableHeadBg}">
  ${["#", "Description", "Rate", "Qty", "Amount"].map((col, i) => cell(`${i >= 2 ? 'align="right"' : ""} style="padding:12px;font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${t.tableHeadText}"`, col)).join("")}
</tr></thead>
<tbody>${serviceRows}</tbody>
</table>
</div>

<table width="${W}" style="margin-bottom:28px"><tr>
  <td valign="top" width="58%">
    <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${t.accent};margin-bottom:10px">Amount Due</div>
    <div style="padding:22px 24px;background:${modernTotalDuePattern};border-radius:${t.radius}px">
      <div style="font-family:${F};font-size:34px;font-weight:800;line-height:1.05;color:#fff">${invoiceMoneyHtml(totals.total, currency)}</div>
      ${invoice.invoice.dueDate ? `<div style="margin-top:10px;font-family:${F};font-size:11px;color:rgba(255,255,255,0.85)">Due by ${escapeHtml(formatDate(invoice.invoice.dueDate))}</div>` : ""}
    </div>
  </td>
  <td valign="bottom" width="42%" align="right">
    <div style="display:inline-block;width:252px;background:${t.cardBg};border:1px solid ${t.border};border-radius:${t.radius}px;padding:16px 18px;text-align:left">
      <div style="display:flex;justify-content:space-between;padding:5px 0;font-family:${F};font-size:12px;color:${t.textSecondary}"><span>Subtotal</span>${invoiceMoneyHtml(totals.subtotal, currency)}</div>
      ${discountRow}
      ${taxRow}
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid ${t.text};font-family:${F};font-size:14px;font-weight:800"><span>Total</span>${invoiceMoneyHtml(totals.total, currency)}</div>
    </div>
  </td>
</tr></table>

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
  <td width="32%" valign="top" style="padding-right:7px">
    ${hasInvoicePaymentInfo(invoice.payment, paymentOptions) ? infoCard("Payment Details", paymentLines, F) : "&nbsp;"}
  </td>
  <td width="2%"></td>
  <td width="32%" valign="top" style="padding:0 7px">
    ${infoCard("Terms", `<div style="font-family:${F};font-size:11px;line-height:18px;color:${t.textMuted};white-space:pre-wrap">${escapeHtml(termsText)}</div>`, F)}
  </td>
  <td width="2%"></td>
  <td width="32%" valign="top" style="padding-left:7px">
    ${infoCard(
      "Authorized By",
      `${companySignatureBlockHtml(invoice.company, { font: F, maxHeight: d.signature.maxHeight, maxWidth: d.signature.maxWidth, align: "left", marginTop: 0, marginBottom: 10 })}
      <div style="font-family:${F};font-size:11px;font-weight:bold;color:${t.text}">${escapeHtml(invoice.company.companyName || "Your business")}</div>`,
      F
    )}
  </td>
</tr></table>

<div style="background:${t.cardBg};border:1px solid ${t.border};border-radius:${t.radius}px;padding:16px 18px">
<table width="100%"><tr>
  <td valign="top" style="font-family:${F};font-size:11px;line-height:18px;color:${t.textMuted}">
    ${invoice.company.companyAddress ? `<div style="white-space:pre-wrap">${escapeHtml(invoice.company.companyAddress)}</div>` : ""}
    ${contactFooter ? `<div style="margin-top:6px">${contactFooter}</div>` : ""}
  </td>
  ${
    invoice.company.companyEmail || invoice.company.companyPhone
      ? `<td valign="top" align="right" style="font-family:${F};font-size:11px;color:${t.textMuted}">
    <div style="font-size:10px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${t.accent}">Questions?</div>
    ${invoice.company.companyEmail ? `<div style="margin-top:6px;font-weight:600;color:${t.text}">${escapeHtml(invoice.company.companyEmail)}</div>` : ""}
    ${invoice.company.companyPhone ? `<div style="margin-top:4px">${escapeHtml(invoice.company.companyPhone)}</div>` : ""}
  </td>`
      : ""
  }
</tr></table>
</div>

</div>

${shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding) ? `<div style="padding:0 ${pad}px ${pad}px">${invoicePoweredByHtml()}</div>` : ""}

</div></body></html>`;
}
