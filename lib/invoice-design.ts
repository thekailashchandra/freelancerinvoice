/** Shared invoice document design tokens (hex only — PDF-safe) */
export const invoiceDesign = {
  /** Screen preview (Inter via next/font) */
  font:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  /** PDF export only — html2canvas renders Arial reliably */
  pdfFont: "Arial, Helvetica, sans-serif",
  fontMono: "Consolas, 'Courier New', monospace",
  page: {
    widthPx: 794,
    paddingPx: 40,
    contentWidthPx: 714,
  },
  colors: {
    bg: "#ffffff",
    surface: "#f8fafc",
    border: "#e2e8f0",
    borderStrong: "#cbd5e1",
    text: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
    label: "#475569",
    accent: "#4f46e5",
    accentSoft: "#eef2ff",
  },
  logo: {
    boxSize: 64,
    imageMax: 48,
  },
  signature: {
    maxHeight: 48,
    maxWidth: 160,
  },
} as const;

export const invoiceStatusColors = {
  draft: { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
  paid: { bg: "#ecfdf5", color: "#047857", border: "#6ee7b7" },
  pending: { bg: "#fffbeb", color: "#b45309", border: "#fcd34d" },
  sent: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
  overdue: { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
} as const;
