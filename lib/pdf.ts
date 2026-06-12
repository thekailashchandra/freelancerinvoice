"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  buildInvoiceFrameHtml,
  createInvoiceClone,
  createOffScreenIframe,
  DEFAULT_PREVIEW_ID,
  getPreviewExportConfig,
  scheduleIframeRemoval,
  waitForFonts,
  waitForIframeReady,
  waitForImages,
} from "@/lib/invoice-export-shared";
import {
  getInvoicePageSpec,
  resolveInvoicePageSize,
  type InvoicePageSize,
} from "@/lib/invoice-design";
import { buildInvoicePdfHtml } from "@/lib/invoice-pdf-html";
import type { Invoice } from "@/types/invoice";

const HTML2CANVAS_OPTS = {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: "#ffffff",
  logging: false,
  foreignObjectRendering: false,
} as const;

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").trim() || "invoice";
}

function formatPdfError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/loading chunk|chunkloaderror|failed to fetch/i.test(message)) {
    return "PDF tools failed to load. Hard-refresh the page (Ctrl+Shift+R) and try again.";
  }
  if (/parentnode|tainted|security/i.test(message)) {
    return "Could not render the invoice image. Try removing the logo or refresh and retry.";
  }
  return message || "Could not generate PDF.";
}

/** Copy canvas pixels so PDF build survives iframe teardown. */
function copyCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not copy invoice render.");
  }
  ctx.drawImage(source, 0, 0);
  return canvas;
}

/**
 * Clones the on-screen Live Preview into an isolated iframe and captures it.
 * This guarantees the PDF matches the preview pixel-for-pixel.
 */
async function captureLivePreviewToCanvas(
  previewId: string = DEFAULT_PREVIEW_ID
): Promise<HTMLCanvasElement | null> {
  const preview = document.getElementById(previewId);
  if (!preview) return null;

  const { width } = getPreviewExportConfig(preview);

  const iframe = createOffScreenIframe(width, "PDF export");

  const doc = iframe.contentDocument;
  if (!doc) {
    scheduleIframeRemoval(iframe);
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
    const rawCanvas = await html2canvas(clone, {
      ...HTML2CANVAS_OPTS,
      scrollX: 0,
      scrollY: 0,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
    });
    return copyCanvas(rawCanvas);
  } finally {
    scheduleIframeRemoval(iframe);
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
    scheduleIframeRemoval(iframe);
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
    scheduleIframeRemoval(iframe);
    throw new Error("Invoice render failed.");
  }

  await waitForImages(root);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const contentHeight = root.scrollHeight + 20;
  iframe.style.height = `${contentHeight}px`;

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const rawCanvas = await html2canvas(root, {
      ...HTML2CANVAS_OPTS,
      scrollX: 0,
      scrollY: 0,
      width: spec.contentWidthPx,
      height: root.scrollHeight,
      windowWidth: pageWidth,
      windowHeight: contentHeight,
    });
    return copyCanvas(rawCanvas);
  } finally {
    scheduleIframeRemoval(iframe);
  }
}

/** Fit invoice to selected paper size (width-first, one page) */
async function buildPdfFromCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  pageSize?: InvoicePageSize
): Promise<void> {
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

/** PDF export — HTML renderer first (reliable), live preview as fallback. */
export async function downloadInvoicePdf(
  invoice: Invoice,
  filename: string,
  options?: { previewId?: string; preferHtml?: boolean; skipTemplateGuard?: boolean }
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF export is only available in the browser.");
  }

  if (!options?.skipTemplateGuard) {
    const { requiresTemplatePayment } = await import("@/lib/template-export-guard");
    if (requiresTemplatePayment(invoice.templateId)) {
      throw new Error("Unlock this template to download.");
    }
  }

  const previewId = options?.previewId ?? DEFAULT_PREVIEW_ID;
  const previewEl =
    options?.preferHtml === false
      ? document.getElementById(previewId)
      : null;

  previewEl?.scrollIntoView({ block: "nearest" });
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  let canvas: HTMLCanvasElement | null = null;
  let lastError: unknown;

  try {
    canvas = await captureInvoiceHtmlToCanvas(invoice);
  } catch (err) {
    lastError = err;
    console.warn("HTML PDF renderer failed:", err);
  }

  if (!canvas && previewEl) {
    try {
      canvas = await captureLivePreviewToCanvas(previewId);
    } catch (err) {
      lastError = err;
      console.warn("Live preview PDF capture failed:", err);
    }
  }

  if (!canvas) {
    throw new Error(formatPdfError(lastError));
  }

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error("Could not render invoice. Try refreshing the page.");
  }

  const pageSize =
    (previewEl &&
      resolveInvoicePageSize(
        previewEl.dataset.pageSize as InvoicePageSize | undefined
      )) ||
    resolveInvoicePageSize(invoice.pageSize);

  try {
    await buildPdfFromCanvas(canvas, filename, pageSize);
  } catch (err) {
    throw new Error(formatPdfError(err));
  }
}
