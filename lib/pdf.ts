"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { invoiceDesign } from "@/lib/invoice-design";
import { buildInvoicePdfHtml } from "@/lib/invoice-pdf-html";
import type { Invoice } from "@/types/invoice";

const PREVIEW_ID = "invoice-preview";

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

async function waitForFonts(doc: Document): Promise<void> {
  try {
    await doc.fonts?.ready;
  } catch {
    /* ignore */
  }
  await new Promise((r) => setTimeout(r, 150));
}

/**
 * Clones the on-screen Live Preview into an isolated iframe and captures it.
 * This guarantees the PDF matches the preview pixel-for-pixel.
 */
async function captureLivePreviewToCanvas(
  previewId: string = PREVIEW_ID
): Promise<HTMLCanvasElement | null> {
  const preview = document.getElementById(previewId);
  if (!preview) return null;

  const width = preview.offsetWidth;
  if (width < 1) return null;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "PDF export");
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;border:none;visibility:hidden;overflow:hidden`;

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return null;
  }

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  * { box-sizing: border-box; }
</style>
</head>
<body></body>
</html>`);
  doc.close();

  await new Promise<void>((resolve) => {
    if (doc.readyState === "complete") resolve();
    else iframe.onload = () => resolve();
  });

  const clone = preview.cloneNode(true) as HTMLElement;
  clone.id = `${previewId}-pdf-clone`;
  clone.className = "invoice-print-area";
  clone.style.fontFamily = invoiceDesign.font;
  clone.style.width = `${width}px`;
  clone.style.maxWidth = `${width}px`;
  clone.style.margin = "0";

  clone.querySelectorAll("img").forEach((img) => {
    const el = img as HTMLImageElement;
    if (el.src) {
      el.crossOrigin = "anonymous";
    }
  });

  doc.body.appendChild(clone);

  await waitForImages(clone);
  await waitForFonts(doc);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const height = clone.scrollHeight;
  iframe.style.height = `${height + 24}px`;

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    return await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      foreignObjectRendering: false,
    });
  } finally {
    iframe.remove();
  }
}

/** Fallback: table HTML when preview is not mounted (no Tailwind / oklch) */
async function captureInvoiceHtmlToCanvas(
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

/** Fit entire invoice on one A4 page */
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

/** PDF export — uses Live Preview DOM when available */
export async function downloadInvoicePdf(
  invoice: Invoice,
  filename: string,
  options?: { previewId?: string }
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF export is only available in the browser.");
  }

  const previewId = options?.previewId ?? PREVIEW_ID;
  const previewEl = document.getElementById(previewId);
  previewEl?.scrollIntoView({ block: "nearest" });

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas =
    (await captureLivePreviewToCanvas(previewId)) ??
    (await captureInvoiceHtmlToCanvas(invoice));

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error("Could not render invoice. Try refreshing the page.");
  }

  buildPdfFromCanvas(canvas, filename);
}

/** Open browser print dialog for invoice preview on screen */
export function printInvoice(): void {
  if (typeof window === "undefined") return;
  const preview = document.getElementById(PREVIEW_ID);
  preview?.scrollIntoView({ block: "center" });
  window.print();
}
