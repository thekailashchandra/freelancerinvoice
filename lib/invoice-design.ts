/** Shared invoice document design tokens (hex only — PDF-safe) */

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

/** @deprecated Use getInvoicePageSpec() — kept for legacy imports */
export const invoiceDesign = {
  /** Screen preview — Inter via next/font */
  font:
    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  /** PDF export — system fonts render reliably in html2canvas */
  pdfFont: "Arial, Helvetica, 'Segoe UI', sans-serif",
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
    accentBlue: "#1d4ed8",
    accentLine: "#1d4ed8",
    tableHeader: "#111827",
    tableHeaderText: "#ffffff",
    balanceDueBg: "#f3f4f6",
    total: "#111827",
    discount: "#047857",
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
  /** Long text in table cells / notes — prevents horizontal overflow */
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
  draft: { bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
  paid: { bg: "#ecfdf5", color: "#047857", border: "#6ee7b7" },
  pending: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  sent: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  overdue: { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
} as const;
