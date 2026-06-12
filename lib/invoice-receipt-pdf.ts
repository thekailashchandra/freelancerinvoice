"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  buildInvoiceReceiptHtml,
  type InvoiceReceiptData,
} from "@/lib/invoice-receipt";

export async function downloadInvoiceReceiptPdf(data: InvoiceReceiptData) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:640px;height:900px;border:0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(buildInvoiceReceiptHtml(data));
  doc.close();

  await new Promise((r) => setTimeout(r, 120));

  const root = doc.getElementById("invoice-receipt-root") ?? doc.body;
  const canvas = await html2canvas(root, {
    scale: 2,
    backgroundColor: "#f1f5f9",
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

export async function shareInvoiceReceipt(
  data: InvoiceReceiptData,
  receiptUrl: string
): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({
      title: `Receipt — ${data.invoiceNumber}`,
      text: `Payment receipt for invoice ${data.invoiceNumber}: ${data.amountDisplay} paid on ${new Date(data.paidAt).toLocaleDateString()}.`,
      url: receiptUrl,
    });
    return true;
  }
  return false;
}
