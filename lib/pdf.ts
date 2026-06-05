"use client";

import {
  getInvoicePageSpec,
  invoiceDesign,
  resolveInvoicePageSize,
  type InvoicePageSize,
} from "@/lib/invoice-design";
import { buildInvoicePdfHtml } from "@/lib/invoice-pdf-html";
import type { Invoice } from "@/types/invoice";

const PREVIEW_ID = "invoice-preview";

type PdfLibs = {
  html2canvas: typeof import("html2canvas").default;
  jsPDF: typeof import("jspdf").jsPDF;
};

let pdfLibsPromise: Promise<PdfLibs> | null = null;

function loadPdfLibs(): Promise<PdfLibs> {
  if (!pdfLibsPromise) {
    pdfLibsPromise = Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]).then(([html2canvasMod, jspdfMod]) => ({
      html2canvas: html2canvasMod.default,
      jsPDF: jspdfMod.jsPDF,
    }));
  }
  return pdfLibsPromise;
}

const INVOICE_FRAME_BASE_CSS = `
  html, body { margin: 0; padding: 0; background: #ffffff; }
  * { box-sizing: border-box; }
  .invoice-print-area thead tr,
  .invoice-print-area thead th,
  .invoice-table-header,
  .invoice-table-header th {
    background-color: #111827 !important;
    color: #ffffff !important;
  }
  .invoice-balance-due {
    background-color: #f3f4f6 !important;
  }
`;

function buildInvoicePrintCss(printSize: string): string {
  return `
  @page { margin: 12mm; size: ${printSize}; }
  *, *::before, *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  .invoice-print-area {
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    background-color: #ffffff !important;
    color: #111827 !important;
    box-sizing: border-box !important;
  }
`;
}

function getPreviewExportConfig(preview: HTMLElement) {
  const pageSize = resolveInvoicePageSize(
    preview.dataset.pageSize as InvoicePageSize | undefined
  );
  const spec = getInvoicePageSpec(pageSize);
  return { pageSize, spec, width: spec.widthPx };
}

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

function buildInvoiceFrameHtml(
  width: number,
  includePrintCss = false,
  printSize = "A4 portrait"
): string {
  const extraCss = includePrintCss ? buildInvoicePrintCss(printSize) : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
${INVOICE_FRAME_BASE_CSS}
${extraCss}
</style>
</head>
<body></body>
</html>`;
}

function createOffScreenIframe(width: number, title: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", title);
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;border:none;visibility:hidden;overflow:hidden`;
  document.body.appendChild(iframe);
  return iframe;
}

async function waitForIframeReady(
  iframe: HTMLIFrameElement,
  doc: Document
): Promise<void> {
  await new Promise<void>((resolve) => {
    if (doc.readyState === "complete") resolve();
    else iframe.onload = () => resolve();
  });
}

function createInvoiceClone(
  preview: HTMLElement,
  previewId: string,
  width: number
): HTMLElement {
  const clone = preview.cloneNode(true) as HTMLElement;
  clone.id = `${previewId}-export-clone`;
  clone.className = "invoice-print-area";
  clone.style.fontFamily = invoiceDesign.font;
  clone.style.width = `${width}px`;
  clone.style.maxWidth = `${width}px`;
  clone.style.minWidth = `${width}px`;
  clone.style.margin = "0";
  clone.style.boxSizing = "border-box";
  clone.style.border = "none";
  clone.style.boxShadow = "none";
  clone.style.borderRadius = "0";
  clone.style.backgroundColor = "#ffffff";

  clone.querySelectorAll("img").forEach((img) => {
    const el = img as HTMLImageElement;
    if (el.src) {
      el.crossOrigin = "anonymous";
    }
  });

  return clone;
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

  const { width, spec } = getPreviewExportConfig(preview);

  const iframe = createOffScreenIframe(width, "PDF export");

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return null;
  }

  doc.open();
  doc.write(buildInvoiceFrameHtml(width));
  doc.close();

  await waitForIframeReady(iframe, doc);

  const clone = createInvoiceClone(preview, previewId, width);
  doc.body.appendChild(clone);

  await waitForImages(clone);
  await waitForFonts(doc);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const height = clone.scrollHeight;
  iframe.style.height = `${height + 24}px`;

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const { html2canvas } = await loadPdfLibs();
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
  const spec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const pageWidth = spec.widthPx;

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
    const { html2canvas } = await loadPdfLibs();
    return await html2canvas(root, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: spec.contentWidthPx,
      height: root.scrollHeight,
      windowWidth: pageWidth,
      windowHeight: contentHeight,
      foreignObjectRendering: false,
    });
  } finally {
    iframe.remove();
  }
}

/** Fit invoice to selected paper size (width-first, one page) */
async function buildPdfFromCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  pageSize?: InvoicePageSize
): Promise<void> {
  const { jsPDF } = await loadPdfLibs();
  const dataUrl = canvas.toDataURL("image/png");
  const spec = getInvoicePageSpec(resolveInvoicePageSize(pageSize));
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: spec.pdfFormat,
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

  const pageSize =
    (previewEl &&
      resolveInvoicePageSize(
        previewEl.dataset.pageSize as InvoicePageSize | undefined
      )) ||
    resolveInvoicePageSize(invoice.pageSize);

  await buildPdfFromCanvas(canvas, filename, pageSize);
}

/**
 * Print only the invoice in an isolated iframe (same clone as PDF export).
 * Avoids printing the full app layout, which caused many blank pages.
 */
export async function printInvoice(options?: {
  previewId?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;

  const previewId = options?.previewId ?? PREVIEW_ID;
  const preview = document.getElementById(previewId);
  if (!preview) {
    throw new Error("Invoice preview not found.");
  }

  preview.scrollIntoView({ block: "nearest" });
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const { width, spec } = getPreviewExportConfig(preview);
  const iframe = createOffScreenIframe(width, "Print invoice");

  try {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      throw new Error("Could not open print frame.");
    }

    doc.open();
    doc.write(buildInvoiceFrameHtml(width, true, spec.printSize));
    doc.close();

    await waitForIframeReady(iframe, doc);

    const clone = createInvoiceClone(preview, previewId, width);
    doc.body.appendChild(clone);

    await waitForImages(clone);
    await waitForFonts(doc);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    iframe.style.height = `${clone.scrollHeight + 24}px`;

    await new Promise<void>((resolve) => {
      const cleanup = () => {
        iframe.remove();
        resolve();
      };
      const backup = window.setTimeout(cleanup, 30_000);
      win.addEventListener(
        "afterprint",
        () => {
          clearTimeout(backup);
          cleanup();
        },
        { once: true }
      );
      win.focus();
      win.print();
    });
  } catch (err) {
    iframe.remove();
    throw err;
  }
}
