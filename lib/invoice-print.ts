"use client";

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

/**
 * Print only the invoice in an isolated iframe (same clone as PDF export).
 * Avoids printing the full app layout, which caused many blank pages.
 *
 * Kept separate from lib/pdf.ts so print does not load html2canvas/jspdf chunks.
 */
export async function printInvoice(options?: {
  previewId?: string;
}): Promise<void> {
  if (typeof window === "undefined") return;

  const previewId = options?.previewId ?? DEFAULT_PREVIEW_ID;
  const preview = document.getElementById(previewId);
  if (!preview) {
    throw new Error("Invoice preview not found.");
  }

  if (preview.closest(".template-export-locked")) {
    throw new Error("Unlock this template to print.");
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
        scheduleIframeRemoval(iframe);
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
    scheduleIframeRemoval(iframe);
    throw err;
  }
}
