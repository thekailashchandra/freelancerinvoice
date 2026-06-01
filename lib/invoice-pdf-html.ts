import { calculateTotals, deriveInvoiceStatus } from "@/lib/calculations";
import { invoiceDesign, invoiceStatusColors } from "@/lib/invoice-design";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

const d = invoiceDesign;
const W = d.page.contentWidthPx;
const F = d.pdfFont;

/** Base text style — normal spacing (html2canvas breaks with letter-spacing) */
const text = {
  base: `font-family:${F};font-size:14px;line-height:22px;color:${d.colors.textSecondary};letter-spacing:normal;word-spacing:normal`,
  body: `font-family:${F};font-size:13px;line-height:20px;color:${d.colors.textMuted};letter-spacing:normal;word-spacing:normal`,
  strong: `font-family:${F};font-size:16px;line-height:24px;font-weight:bold;color:${d.colors.text};letter-spacing:normal`,
  label: `font-family:${F};font-size:11px;line-height:16px;font-weight:bold;color:${d.colors.label};text-transform:uppercase;letter-spacing:normal;word-spacing:normal`,
};

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

function buildLogoCell(invoice: Invoice): string {
  const box = d.logo.boxSize;
  const maxImg = d.logo.imageMax;

  if (invoice.company.logo) {
    return cell(
      `width="80" valign="middle" style="padding-right:16px"`,
      `<table cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" style="width:${box}px;height:${box}px;background:${d.colors.surface};border:1px solid ${d.colors.border};border-radius:10px">
        <img src="${invoice.company.logo}" alt="" width="${maxImg}" style="display:block;max-width:${maxImg}px;max-height:${maxImg}px;width:auto;height:auto;border:0" />
      </td></tr></table>`
    );
  }

  return cell(
    `width="80" valign="middle" style="padding-right:16px"`,
    `<table cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" style="width:${box}px;height:${box}px;background:${d.colors.accent};border-radius:10px;font-family:${F};font-size:20px;font-weight:bold;color:#ffffff">
      ${escapeHtml(invoice.company.companyName.charAt(0) || "?")}
    </td></tr></table>`
  );
}

/** Table-based layout — reliable with html2canvas (no flex, no web fonts) */
export function buildInvoicePdfHtml(invoice: Invoice): string {
  const totals = calculateTotals(invoice.services, invoice.taxDiscount);
  const status = deriveInvoiceStatus(invoice.status, invoice.invoice.dueDate);
  const badge = invoiceStatusColors[status];

  const serviceRows = invoice.services
    .map(
      (item) => `
      <tr>
        ${cell(`style="padding:12px 14px;border-bottom:1px solid ${d.colors.border};${text.base}"`, escapeHtml(item.name || "Service"))}
        ${cell(`width="56" align="center" style="padding:12px 8px;border-bottom:1px solid ${d.colors.border};${text.body}"`, String(item.quantity))}
        ${cell(`width="110" align="right" style="padding:12px 14px;border-bottom:1px solid ${d.colors.border};${text.body}"`, formatCurrency(item.price))}
        ${cell(`width="110" align="right" style="padding:12px 14px;border-bottom:1px solid ${d.colors.border};font-family:${F};font-size:14px;font-weight:bold;color:${d.colors.text};letter-spacing:normal"`, formatCurrency(item.quantity * item.price))}
      </tr>`
    )
    .join("");

  const paymentBlock =
    invoice.payment.bankName ||
    invoice.payment.accountNumber ||
    invoice.payment.upiId
      ? `
      <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-top:24px;font-family:${F}">
        <tr><td style="padding:16px 18px;background:${d.colors.surface};border:1px solid ${d.colors.border};border-radius:8px">
          <div style="${text.label}">Payment Details</div>
          ${invoice.payment.bankName ? `<div style="margin-top:10px;${text.base}"><strong style="color:${d.colors.label}">Bank:</strong> ${escapeHtml(invoice.payment.bankName)}</div>` : ""}
          ${invoice.payment.accountNumber ? `<div style="margin-top:6px;${text.base}"><strong style="color:${d.colors.label}">Account:</strong> ${escapeHtml(invoice.payment.accountNumber)}</div>` : ""}
          ${invoice.payment.upiId ? `<div style="margin-top:6px;${text.base}"><strong style="color:${d.colors.label}">UPI:</strong> ${escapeHtml(invoice.payment.upiId)}</div>` : ""}
        </td></tr>
      </table>`
      : "";

  const notesBlock = invoice.notes
    ? `
      <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-top:20px;font-family:${F}">
        <tr><td>
          <div style="${text.label}">Notes</div>
          <div style="margin-top:8px;${text.base};white-space:pre-wrap">${escapeHtml(invoice.notes)}</div>
        </td></tr>
      </table>`
    : "";

  const signatureCell = invoice.company.signature
    ? cell(
        `width="50%" align="right" valign="bottom"`,
        `<img src="${invoice.company.signature}" alt="" style="display:block;margin-left:auto;max-height:${d.signature.maxHeight}px;max-width:${d.signature.maxWidth}px;border:0" />`
      )
    : cell(
        `width="50%" align="right" valign="bottom"`,
        `<div style="border-top:1px solid ${d.colors.borderStrong};padding-top:8px;${text.body};text-align:right">Authorized Signature</div>`
      );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    width: ${d.page.widthPx}px;
    padding: ${d.page.paddingPx}px;
    font-family: ${F};
    letter-spacing: normal;
    word-spacing: normal;
  }
  table { border-collapse: collapse; }
  img { border: 0; }
</style>
</head>
<body>
  <div id="invoice-root" style="width:${W}px;font-family:${F};letter-spacing:normal;word-spacing:normal">

    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-bottom:24px">
      <tr><td style="height:3px;background:${d.colors.accent};font-size:0;line-height:0">&nbsp;</td></tr>
    </table>

    <!-- Header -->
    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-bottom:24px;border-bottom:1px solid ${d.colors.border}">
      <tr>
        ${buildLogoCell(invoice)}
        <td valign="middle">
          <div style="font-family:${F};font-size:17px;font-weight:bold;line-height:24px;color:${d.colors.text};letter-spacing:normal">${escapeHtml(invoice.company.companyName || "Your Company")}</div>
          <div style="margin-top:4px;${text.body}">${escapeHtml(invoice.company.companyEmail)}</div>
          <div style="${text.body}">${escapeHtml(invoice.company.companyPhone)}</div>
        </td>
        <td width="200" align="right" valign="top" style="padding-left:16px">
          <div style="font-family:${F};font-size:26px;font-weight:bold;line-height:30px;color:${d.colors.text};letter-spacing:normal">INVOICE</div>
          <div style="margin-top:6px;font-family:${F};font-size:13px;line-height:18px;color:${d.colors.textSecondary};letter-spacing:normal">${escapeHtml(invoice.invoice.invoiceNumber)}</div>
          <div style="margin-top:8px">
            <span style="display:inline-block;padding:4px 10px;font-family:${F};font-size:11px;font-weight:bold;border:1px solid ${badge.border};background:${badge.bg};color:${badge.color};border-radius:12px;letter-spacing:normal">${status}</span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Bill to + dates -->
    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-bottom:28px">
      <tr>
        <td width="58%" valign="top" style="padding-right:24px">
          <div style="${text.label}">Bill To</div>
          <div style="margin-top:8px;${text.strong}">${escapeHtml(invoice.client.name || "Client Name")}</div>
          ${invoice.client.company ? `<div style="margin-top:4px;${text.base}">${escapeHtml(invoice.client.company)}</div>` : ""}
          <div style="margin-top:6px;${text.body};white-space:pre-wrap">${escapeHtml(invoice.client.address || "")}</div>
          ${invoice.client.email ? `<div style="margin-top:4px;${text.body}">${escapeHtml(invoice.client.email)}</div>` : ""}
          ${invoice.client.phone ? `<div style="${text.body}">${escapeHtml(invoice.client.phone)}</div>` : ""}
        </td>
        <td width="42%" valign="top" align="right">
          <table cellpadding="0" cellspacing="0" align="right" style="font-family:${F}">
            <tr>
              <td style="padding:5px 16px 5px 0;${text.body};color:${d.colors.label};white-space:nowrap">Invoice Date</td>
              <td align="right" style="padding:5px 0;font-family:${F};font-size:13px;font-weight:bold;color:${d.colors.text};letter-spacing:normal;white-space:nowrap">${formatDate(invoice.invoice.invoiceDate)}</td>
            </tr>
            <tr>
              <td style="padding:5px 16px 5px 0;${text.body};color:${d.colors.label};white-space:nowrap">Due Date</td>
              <td align="right" style="padding:5px 0;font-family:${F};font-size:13px;font-weight:bold;color:${d.colors.text};letter-spacing:normal;white-space:nowrap">${formatDate(invoice.invoice.dueDate)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Line items -->
    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;border:1px solid ${d.colors.border};font-family:${F}">
      <thead>
        <tr style="background:${d.colors.surface}">
          ${cell(`style="padding:10px 14px;${text.label}"`, "Description")}
          ${cell(`width="56" align="center" style="padding:10px 8px;${text.label}"`, "Qty")}
          ${cell(`width="110" align="right" style="padding:10px 14px;${text.label}"`, "Rate")}
          ${cell(`width="110" align="right" style="padding:10px 14px;${text.label}"`, "Amount")}
        </tr>
      </thead>
      <tbody>${serviceRows}</tbody>
    </table>

    <!-- Totals -->
    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-top:20px;font-family:${F}">
      <tr>
        <td>&nbsp;</td>
        <td width="280" valign="top">
          <table width="280" cellpadding="0" cellspacing="0" style="width:280px;background:${d.colors.surface};border:1px solid ${d.colors.border};border-radius:8px;font-family:${F}">
            <tr>
              ${cell(`style="padding:14px 16px 6px;${text.base}"`, "Subtotal")}
              ${cell(`align="right" style="padding:14px 16px 6px;font-family:${F};font-size:14px;font-weight:bold;color:${d.colors.text};letter-spacing:normal"`, formatCurrency(totals.subtotal))}
            </tr>
            ${
              totals.discountAmount > 0
                ? `<tr>
              ${cell(`style="padding:4px 16px;${text.base};color:#059669"`, "Discount")}
              ${cell(`align="right" style="padding:4px 16px;font-family:${F};font-size:14px;font-weight:bold;color:#059669;letter-spacing:normal"`, `-${formatCurrency(totals.discountAmount)}`)}
            </tr>`
                : ""
            }
            ${
              invoice.taxDiscount.gstEnabled
                ? `<tr>
              ${cell(`style="padding:4px 16px;${text.base}"`, `GST (${invoice.taxDiscount.gstPercentage}%)`)}
              ${cell(`align="right" style="padding:4px 16px;font-family:${F};font-size:14px;font-weight:bold;color:${d.colors.text};letter-spacing:normal"`, formatCurrency(totals.gstAmount))}
            </tr>`
                : ""
            }
            <tr>
              ${cell(`style="padding:12px 16px 14px;border-top:2px solid ${d.colors.text};font-family:${F};font-size:15px;font-weight:bold;color:${d.colors.text};letter-spacing:normal"`, "Total")}
              ${cell(`align="right" style="padding:12px 16px 14px;border-top:2px solid ${d.colors.text};font-family:${F};font-size:15px;font-weight:bold;color:${d.colors.accent};letter-spacing:normal"`, formatCurrency(totals.total))}
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${paymentBlock}
    ${notesBlock}

    <!-- Footer -->
    <table width="${W}" cellpadding="0" cellspacing="0" style="width:${W}px;margin-top:32px;padding-top:20px;border-top:1px solid ${d.colors.border};font-family:${F}">
      <tr>
        ${cell(`width="50%" valign="bottom"`, `<div style="${text.body};color:${d.colors.label}">Thank you for your business</div>`)}
        ${signatureCell}
      </tr>
    </table>

  </div>
</body>
</html>`;
}
