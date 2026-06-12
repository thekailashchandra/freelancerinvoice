"use client";

import {
  getInvoicePageSpec,
  invoiceDesign,
  resolveInvoicePageSize,
  type InvoicePageSize,
} from "@/lib/invoice-design";

export const DEFAULT_PREVIEW_ID = "invoice-preview";

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
  .invoice-screen-only {
    display: none !important;
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

export function getPreviewExportConfig(preview: HTMLElement) {
  const pageSize = resolveInvoicePageSize(
    preview.dataset.pageSize as InvoicePageSize | undefined
  );
  const spec = getInvoicePageSpec(pageSize);
  return { pageSize, spec, width: spec.widthPx };
}

/** Detach iframe after export finishes internal DOM cleanup. */
export function scheduleIframeRemoval(iframe: HTMLIFrameElement): void {
  window.setTimeout(() => {
    iframe.parentNode?.removeChild(iframe);
  }, 100);
}

export function waitForImages(root: HTMLElement): Promise<void> {
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

export async function waitForFonts(doc: Document): Promise<void> {
  try {
    await doc.fonts?.ready;
  } catch {
    /* ignore */
  }
  await new Promise((r) => setTimeout(r, 150));
}

export function buildInvoiceFrameHtml(
  width: number,
  includePrintCss = false,
  printSize = "A4 portrait"
): string {
  const extraCss = includePrintCss ? buildInvoicePrintCss(printSize) : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
${INVOICE_FRAME_BASE_CSS}
${extraCss}
</style>
</head>
<body></body>
</html>`;
}

export function createOffScreenIframe(
  width: number,
  title: string
): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", title);
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;border:none;visibility:hidden;overflow:hidden`;
  document.body.appendChild(iframe);
  return iframe;
}

export async function waitForIframeReady(
  iframe: HTMLIFrameElement,
  doc: Document
): Promise<void> {
  await new Promise<void>((resolve) => {
    if (doc.readyState === "complete") resolve();
    else iframe.onload = () => resolve();
  });
}

function hideScreenOnlyElements(root: HTMLElement): void {
  root.querySelectorAll(".invoice-screen-only").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.display = "none";
    }
  });
}

export function createInvoiceClone(
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
    if (!el.src || el.src.startsWith("data:") || el.src.startsWith("blob:")) {
      return;
    }
    el.crossOrigin = "anonymous";
  });

  hideScreenOnlyElements(clone);

  return clone;
}
