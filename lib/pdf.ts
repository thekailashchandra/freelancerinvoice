"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { invoiceDesign } from "@/lib/invoice-design";
import { buildInvoicePdfHtml } from "@/lib/invoice-pdf-html";
import type { Invoice } from "@/types/invoice";

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").trim() || "invoice";
}

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  ).then(() => undefined);
}

/** Render invoice in an isolated iframe (no parent Tailwind / oklch stylesheets) */
async function captureInvoiceToCanvas(
  invoice: Invoice
): Promise<HTMLCanvasElement> {
  const html = buildInvoicePdfHtml(invoice);
  const pageWidth = invoiceDesign.page.widthPx;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "PDF export");
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${pageWidth}px;border:none;visibility:hidden;overflow:hidden`;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("Could not create PDF render frame.");
  }

  doc.open();
  doc.write(html);
  doc.close();

  await new Promise<void>((resolve) => {
    if (doc.readyState === "complete") resolve();
    else iframe.onload = () => resolve();
  });

  const root = doc.getElementById("invoice-root");
  if (!root) {
    iframe.remove();
    throw new Error("Invoice render failed.");
  }

  await waitForImages(root);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const contentHeight = root.scrollHeight + 20;
  iframe.style.height = `${contentHeight}px`;

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    return await html2canvas(root, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: invoiceDesign.page.contentWidthPx,
      height: root.scrollHeight,
      windowWidth: pageWidth,
      windowHeight: contentHeight,
      foreignObjectRendering: false,
    });
  } finally {
    iframe.remove();
  }
}

/** Fit entire invoice on one A4 page (no broken multi-page slicing) */
function buildPdfFromCanvas(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const dataUrl = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;

  const imgRatio = canvas.width / canvas.height;
  let drawW = maxW;
  let drawH = drawW / imgRatio;

  if (drawH > maxH) {
    drawH = maxH;
    drawW = drawH * imgRatio;
  }

  const x = (pageW - drawW) / 2;
  const y = margin;

  pdf.addImage(dataUrl, "PNG", x, y, drawW, drawH);
  pdf.save(`${sanitizeFilename(filename.replace(/\.pdf$/i, ""))}.pdf`);
}

/** Generate PDF from invoice data (html2canvas + jsPDF, oklch-safe) */
export async function downloadInvoicePdf(
  invoice: Invoice,
  filename: string
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF export is only available in the browser.");
  }

  const canvas = await captureInvoiceToCanvas(invoice);

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error("Could not render invoice. Try refreshing the page.");
  }

  buildPdfFromCanvas(canvas, filename);
}

/** Open browser print dialog for invoice preview on screen */
export function printInvoice(): void {
  if (typeof window === "undefined") return;
  const preview = document.getElementById("invoice-preview");
  preview?.scrollIntoView({ block: "center" });
  window.print();
}
