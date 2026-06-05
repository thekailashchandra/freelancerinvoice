import { calculateTotals } from "@/lib/calculations";

import {
  getInvoicePageSpec,
  getLogoDimensions,
  invoiceDesign,
  resolveInvoicePageSize,
  resolveLogoHeight,
} from "@/lib/invoice-design";

import { invoiceMoneyHtml } from "@/lib/currency-display";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";

import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
} from "@/lib/invoice-payment-display";

import type { Invoice } from "@/types/invoice";

const d = invoiceDesign;

const F = d.pdfFont;

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

function metaRow(label: string, value: string): string {

  if (!value) return "";

  return `<div style="display:flex;justify-content:space-between;gap:16px;padding:5px 0;font-family:${F};font-size:13px;line-height:20px">

    <span style="color:${d.colors.textMuted};white-space:nowrap">${escapeHtml(label)}</span>

    <span style="color:${d.colors.text};font-weight:500;text-align:right">${escapeHtml(value)}</span>

  </div>`;

}

export function buildInvoicePdfHtml(invoice: Invoice): string {
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

  const taxPct =

    invoice.taxDiscount.taxPercentage ??

    invoice.taxDiscount.gstPercentage ??

    0;

  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const shipping = totals.shippingFee ?? 0;

  const paymentTerms =

    invoice.invoice.paymentTerms?.trim() || "Due on receipt";

  const clientLines = [

    invoice.client.address,

    invoice.client.email,

    invoice.client.phone,

  ].filter(Boolean) as string[];

  const logoImg = invoice.company.logo
    ? `<img src="${invoice.company.logo}" alt="" style="display:block;height:${logo.height}px;max-width:${logo.maxWidth}px;width:auto;object-fit:contain;border:0" />`
    : "";

  const initialBlock = `<div style="width:${logo.initialSize}px;height:${logo.initialSize}px;border-radius:50%;background:${d.colors.accent};color:#fff;font-family:${F};font-size:30px;font-weight:bold;text-align:center;line-height:${logo.initialSize}px">${escapeHtml((invoice.company.companyName || "Y").charAt(0).toUpperCase())}</div>`;

  const companyNameBlock = `<div style="font-family:${F};font-size:17px;font-weight:bold;color:${d.colors.text}">${escapeHtml(invoice.company.companyName || "Your business")}</div>`;

  const companyAddress = invoice.company.companyAddress

    ? `<div style="margin-top:6px;font-family:${F};font-size:12px;line-height:18px;color:${d.colors.textMuted};white-space:pre-wrap">${escapeHtml(invoice.company.companyAddress)}</div>`

    : "";

  const companyGstin = invoice.company.gstin?.trim()
    ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:${d.colors.textSecondary}">GSTIN: ${escapeHtml(invoice.company.gstin.trim())}</div>`
    : "";

  const companyDetailsBlock = `${companyNameBlock}${companyAddress}${companyGstin}`;

  const companyMark = invoice.company.logo ? logoImg : initialBlock;

  const companyBlock = `<div>${companyMark}<div style="margin-top:10px">${companyDetailsBlock}</div></div>`;

  const clientLineHtml = clientLines

    .map(

      (l) =>

        `<div style="margin-top:4px;font-family:${F};font-size:13px;color:${d.colors.textMuted};white-space:pre-wrap">${escapeHtml(l)}</div>`

    )

    .join("");

  const clientCompany = invoice.client.company

    ? `<div style="margin-top:4px;font-family:${F};font-size:13px;color:${d.colors.textSecondary}">${escapeHtml(invoice.client.company)}</div>`

    : "";

  const serviceRows = invoice.services

    .map((item, index) => {

      const border =

        index < invoice.services.length - 1

          ? `border-bottom:1px solid ${d.colors.border};`

          : "";

      const lineAmount = item.quantity * item.price;

      return `<tr>

        ${cell(`width="36" valign="top" style="padding:14px 12px;${border}font-family:${F};font-size:13px;color:${d.colors.textSecondary}"`, String(index + 1))}

        ${cell(`valign="top" style="padding:14px 12px;${border}min-width:0;overflow:hidden;${d.wrapTextCss}"`, `<div style="font-family:${F};font-size:14px;font-weight:bold;color:${d.colors.text};${d.wrapTextCss}">${escapeHtml(item.name || "Service")}</div>${item.description ? `<div style="margin-top:4px;font-family:${F};font-size:12px;line-height:18px;color:${d.colors.textMuted};white-space:pre-wrap;${d.wrapTextCss}">${escapeHtml(item.description)}</div>` : ""}`)}

        ${cell(`width="64" align="right" valign="top" style="padding:14px 12px;${border}font-family:${F};font-size:13px;color:${d.colors.textSecondary}"`, formatInvoiceAmount(item.quantity))}

        ${cell(`width="88" align="right" valign="top" style="padding:14px 12px;${border}font-family:${F};font-size:13px;color:${d.colors.textSecondary}"`, invoiceMoneyHtml(item.price, currency))}

        ${cell(`width="56" align="right" valign="top" style="padding:14px 12px;${border}font-family:${F};font-size:13px;color:${d.colors.textSecondary}"`, taxOn ? `${taxPct}%` : "—")}

        ${cell(`width="96" align="right" valign="top" style="padding:14px 12px;${border}font-family:${F};font-size:13px;font-weight:bold;color:${d.colors.text}"`, invoiceMoneyHtml(lineAmount, currency))}

      </tr>`;

    })

    .join("");

  const paymentBlock = hasInvoicePaymentInfo(invoice.payment)
    ? `<div style="margin-bottom:20px">
        <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${d.colors.textMuted}">Payment Information</div>
        ${getInvoicePaymentInfo(invoice.payment)
          .map(
            (line) =>
              `<div style="margin-top:4px;font-family:${F};font-size:13px;line-height:20px;color:${d.colors.textSecondary}"><strong style="color:${d.colors.text}">${escapeHtml(line.label)}:</strong> ${escapeHtml(line.value)}</div>`
          )
          .join("")}
      </div>`
    : "";

  const notesBlock = invoice.notes

    ? `<div style="margin-bottom:20px">

        <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${d.colors.textMuted}">Notes</div>

        <div style="margin-top:6px;font-family:${F};font-size:13px;color:${d.colors.textSecondary};white-space:pre-wrap">${escapeHtml(invoice.notes)}</div>

      </div>`

    : "";

  const termsBlock = invoice.termsAndConditions

    ? `<div>

        <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${d.colors.textMuted}">Terms &amp; Conditions</div>

        <div style="margin-top:6px;font-family:${F};font-size:12px;line-height:18px;color:${d.colors.textMuted};white-space:pre-wrap">${escapeHtml(invoice.termsAndConditions)}</div>

      </div>`

    : "";

  const discountRow =

    totals.discountAmount > 0

      ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.discount}"><span>Discount</span><span style="display:inline-flex;align-items:center;gap:2px"><span>−</span>${invoiceMoneyHtml(totals.discountAmount, currency)}</span></div>`

      : "";

  const taxRow = taxOn && totals.gstBreakdown?.type === "intra"
    ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>CGST (@${totals.gstBreakdown.cgst?.rate.toFixed(1)}%)</span>${invoiceMoneyHtml(totals.gstBreakdown.cgst?.amount ?? 0, currency)}</div>
       <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>SGST (@${totals.gstBreakdown.sgst?.rate.toFixed(1)}%)</span>${invoiceMoneyHtml(totals.gstBreakdown.sgst?.amount ?? 0, currency)}</div>`
    : taxOn && totals.gstBreakdown?.type === "inter"
      ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>IGST (@${totals.gstBreakdown.igst?.rate.toFixed(1)}%)</span>${invoiceMoneyHtml(totals.gstBreakdown.igst?.amount ?? 0, currency)}</div>`
      : taxOn
        ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>Total Tax</span>${invoiceMoneyHtml(taxAmt, currency)}</div>`
        : "";

  const shippingRow =

    shipping > 0

      ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>Shipping</span>${invoiceMoneyHtml(shipping, currency)}</div>`

      : "";

  return `<!DOCTYPE html>

<html lang="en">

<head><meta charset="utf-8" />

<style>

  html,body{margin:0;padding:0;background:#fff}

  body{width:${pageSpec.widthPx}px;padding:${pageSpec.paddingPx}px;font-family:${F}}

  table{border-collapse:collapse} img{border:0}

</style></head>

<body>

<div id="invoice-root" style="width:${W}px;font-family:${F}">

<table width="${W}" cellpadding="0" cellspacing="0" style="margin-bottom:36px">

<tr>

  <td width="55%" valign="top">

    ${companyBlock}

    <div style="margin-top:28px">

      <div style="font-family:${F};font-size:10px;font-weight:bold;letter-spacing:0.06em;text-transform:uppercase;color:${d.colors.textMuted}">Bill To</div>

      <div style="margin-top:8px;font-family:${F};font-size:15px;font-weight:bold;color:${d.colors.text}">${escapeHtml(invoice.client.name || "Client name")}</div>

      ${clientCompany}

      ${clientLineHtml}
      ${invoice.client.gstin?.trim() ? `<div style="margin-top:6px;font-family:${F};font-size:12px;color:${d.colors.textSecondary}">GSTIN: ${escapeHtml(invoice.client.gstin.trim())}</div>` : ""}

    </div>

  </td>

  <td width="45%" valign="top" align="right">

    <div style="font-family:${F};font-size:32px;font-weight:bold;letter-spacing:0.12em;color:${d.colors.text}">INVOICE</div>

    <div style="margin-top:10px;font-family:${F};font-size:14px;color:${d.colors.textSecondary}">Invoice# ${escapeHtml(invoice.invoice.invoiceNumber)}</div>

    <div style="margin-top:8px;font-family:${F};font-size:28px;font-weight:bold;color:${d.colors.text}">${invoiceMoneyHtml(totals.total, currency)}</div>

    <div style="margin-top:20px;text-align:left">

      ${metaRow("Invoice Date", formatDate(invoice.invoice.invoiceDate))}

      ${metaRow("Terms", paymentTerms)}

      ${metaRow("Due Date", formatDate(invoice.invoice.dueDate))}

      ${metaRow("P.O.#", invoice.invoice.purchaseOrder ?? "")}

      ${metaRow("Project Name", invoice.invoice.projectName ?? "")}

    </div>

  </td>

</tr>

</table>

<table width="${W}" style="font-family:${F};table-layout:fixed;border-collapse:collapse">
<colgroup>
  <col width="36" />
  <col />
  <col width="64" />
  <col width="88" />
  <col width="56" />
  <col width="96" />
</colgroup>
<thead><tr style="background:${d.colors.tableHeader}">

  ${cell(`width="36" style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "#")}

  ${cell(`style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "Item &amp; Description")}

  ${cell(`width="64" align="right" style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "Qty")}

  ${cell(`width="88" align="right" style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "Rate")}

  ${cell(`width="56" align="right" style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "Tax")}

  ${cell(`width="96" align="right" style="padding:11px 12px;font-family:${F};font-size:10px;font-weight:bold;color:${d.colors.tableHeaderText}"`, "Amount")}

</tr></thead>

<tbody>${serviceRows}</tbody>

</table>

<table width="${W}" style="margin-top:24px;font-family:${F}"><tr><td></td>

<td width="280" valign="top">

  <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-family:${F};font-size:14px;color:${d.colors.textSecondary}"><span>Sub Total</span>${invoiceMoneyHtml(totals.subtotal, currency)}</div>

  ${discountRow}

  ${taxRow}

  ${shippingRow}

  <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 12px;font-family:${F};font-size:15px;font-weight:bold;color:${d.colors.text};border-bottom:1px solid ${d.colors.border}"><span>Grand Total</span>${invoiceMoneyHtml(totals.total, currency)}</div>

  <div style="margin-top:12px;padding:12px 16px;background:${d.colors.balanceDueBg};border-radius:${d.radius.sm}px;display:flex;justify-content:space-between;align-items:center;font-family:${F};font-size:15px;font-weight:bold;color:${d.colors.text}"><span>Balance Due</span>${invoiceMoneyHtml(totals.total, currency)}</div>

</td></tr></table>

<table width="${W}" style="margin-top:32px;font-family:${F}"><tr><td>

  ${notesBlock}

  ${paymentBlock}

  ${termsBlock}

</td></tr></table>

</div></body></html>`;

}
