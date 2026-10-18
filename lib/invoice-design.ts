/** Shared invoice document design tokens (hex only - PDF-safe) */

import {
  invoicePdfFontFamily,
  invoicePreviewFontFamily,
} from "@/lib/fonts";

export type InvoicePageSize = "a4" | "letter";

export const invoicePageSpecs = {
  a4: {
    widthPx: 794,
    heightPx: 1123,
    paddingPx: 40,
    contentWidthPx: 714,
    printSize: "A4 portrait",
    pdfFormat: "a4" as const,
    label: "A4",
  },
  letter: {
    widthPx: 816,
    heightPx: 1056,
    paddingPx: 40,
    contentWidthPx: 736,
    printSize: "letter portrait",
    pdfFormat: "letter" as const,
    label: "US Letter",
  },
} as const;

export function resolveInvoicePageSize(size?: InvoicePageSize): InvoicePageSize {
  return size === "letter" ? "letter" : "a4";
}

export function getInvoicePageSpec(size?: InvoicePageSize) {
  return invoicePageSpecs[resolveInvoicePageSize(size)];
}

export function resolveLogoHeight(height?: number): number {
  const fallback = invoiceDesign.logo.defaultHeight;
  const h = height ?? fallback;
  return Math.min(200, Math.max(32, Math.round(h)));
}

export function getLogoDimensions(logoHeight?: number) {
  const height = resolveLogoHeight(logoHeight);
  return {
    height,
    maxWidth: Math.round(height * 2.75),
    initialSize: height,
  };
}

/** @deprecated Use getInvoicePageSpec() - kept for legacy imports */
export const invoiceDesign = {
  /** Screen preview - self-hosted Geist via CSS variable */
  font: invoicePreviewFontFamily,
  /** PDF export - system fonts only (no external font requests in iframe) */
  pdfFont: invoicePdfFontFamily,
  fontMono: "'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
  page: {
    widthPx: invoicePageSpecs.a4.widthPx,
    paddingPx: invoicePageSpecs.a4.paddingPx,
    contentWidthPx: invoicePageSpecs.a4.contentWidthPx,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 10,
  },
  colors: {
    bg: "#ffffff",
    surface: "#f9fafb",
    surfaceMuted: "#f3f4f6",
    border: "#e5e7eb",
    borderStrong: "#d1d5db",
    text: "#111827",
    textSecondary: "#374151",
    textMuted: "#6b7280",
    label: "#4b5563",
    accent: "#0f172a",
    accentBlue: "#111111",
    accentLine: "#111111",
    tableHeader: "#111827",
    tableHeaderText: "#ffffff",
    balanceDueBg: "#f3f4f6",
    total: "#111827",
    discount: "#111111",
  },
  logo: {
    defaultHeight: 80,
    /** @deprecated Use getLogoDimensions() */
    boxSize: 80,
    maxWidth: 220,
    imageMax: 80,
  },
  signature: {
    maxHeight: 52,
    maxWidth: 180,
  },
  /** Long text in table cells / notes - prevents horizontal overflow */
  wrapText: {
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    maxWidth: "100%",
  },
  wrapTextCss:
    "word-break:break-word;overflow-wrap:anywhere;max-width:100%;",
  type: {
    invoiceTitle: { size: 24, lineHeight: 28 },
    companyName: { size: 17, lineHeight: 24 },
    sectionLabel: { size: 10, lineHeight: 14 },
    body: { size: 13, lineHeight: 20 },
    bodySm: { size: 12, lineHeight: 18 },
    tableHead: { size: 10, lineHeight: 14 },
    tableCell: { size: 13, lineHeight: 20 },
    totalLabel: { size: 14, lineHeight: 20 },
    totalValue: { size: 18, lineHeight: 24 },
  },
} as const;

export const invoiceStatusColors = {
  draft: { bg: "#f3f3f3", color: "#555555", border: "#d1d1d1" },
  paid: { bg: "#111111", color: "#fafafa", border: "#111111" },
  pending: { bg: "#ffffff", color: "#111111", border: "#c9c9c9" },
  sent: { bg: "#f1f1f1", color: "#111111", border: "#d1d1d1" },
  overdue: { bg: "#ffffff", color: "#111111", border: "#111111" },
} as const;

