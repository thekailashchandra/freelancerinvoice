"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { TemplateUnlockRecord } from "@/lib/template-unlocks";
import { getInvoiceTemplate } from "@/lib/invoice-templates";
import { siteConfig } from "@/data/site";

export type PaymentReceiptData = {
  receiptNumber: string;
  templateId: TemplateUnlockRecord["templateId"];
  templateName: string;
  amountDisplay: string;
  currency: string;
  paidAt: string;
  sessionId: string;
  customerEmail?: string | null;
};

export function buildReceiptData(
  unlock: TemplateUnlockRecord,
  customerEmail?: string | null
): PaymentReceiptData {
  const template = getInvoiceTemplate(unlock.templateId);
  return {
    receiptNumber: `RCP-${unlock.sessionId.slice(-8).toUpperCase()}`,
    templateId: unlock.templateId,
    templateName: template.name,
    amountDisplay: unlock.amountDisplay,
    currency: unlock.currency,
    paidAt: unlock.unlockedAt,
    sessionId: unlock.sessionId,
    customerEmail,
  };
}

function receiptHtml(data: PaymentReceiptData): string {
  const paidDate = new Date(data.paidAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 48px; color: #111827; background: #fff; }
  .card { max-width: 520px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  .head { background: #0f172a; color: #fff; padding: 28px 32px; }
  .head h1 { margin: 0; font-size: 22px; }
  .head p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
  .body { padding: 28px 32px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
  .row:last-child { border-bottom: none; }
  .label { color: #6b7280; }
  .value { font-weight: 600; text-align: right; }
  .total { margin-top: 16px; padding-top: 16px; border-top: 2px solid #0f172a; font-size: 18px; font-weight: 700; }
  .foot { padding: 20px 32px; background: #f9fafb; font-size: 12px; color: #6b7280; }
</style></head><body>
<div class="card">
  <div class="head">
    <h1>Payment receipt</h1>
    <p>${siteConfig.name}</p>
  </div>
  <div class="body">
    <div class="row"><span class="label">Receipt #</span><span class="value">${data.receiptNumber}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${paidDate}</span></div>
    <div class="row"><span class="label">Item</span><span class="value">${data.templateName} invoice template</span></div>
    <div class="row"><span class="label">Transaction</span><span class="value">${data.sessionId.slice(0, 20)}…</span></div>
    ${data.customerEmail ? `<div class="row"><span class="label">Email</span><span class="value">${data.customerEmail}</span></div>` : ""}
    <div class="row total"><span>Total paid</span><span>${data.amountDisplay}</span></div>
  </div>
  <div class="foot">Thank you for your purchase. Your premium template is unlocked on this device.</div>
</div>
</body></html>`;
}

export async function downloadPaymentReceiptPdf(data: PaymentReceiptData) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:600px;height:800px;border:0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(receiptHtml(data));
  doc.close();

  await new Promise((r) => setTimeout(r, 100));

  const canvas = await html2canvas(doc.body, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    foreignObjectRendering: false,
  });

  window.setTimeout(() => {
    iframe.parentNode?.removeChild(iframe);
  }, 0);

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const imgData = canvas.toDataURL("image/png");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 80;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 40, 40, imgWidth, imgHeight);
  pdf.save(`${data.receiptNumber}.pdf`);
}

export async function sharePaymentReceipt(data: PaymentReceiptData) {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({
      title: `Payment receipt — ${data.templateName} template`,
      text: `Paid ${data.amountDisplay} for ${data.templateName} invoice template on ${siteConfig.name}. Receipt #${data.receiptNumber}`,
      url: window.location.href,
    });
    return true;
  }
  return false;
}
