import { Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** CSS font-family stack for invoice preview (matches root layout). */
export const invoicePreviewFontFamily =
  "var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** PDF / html2canvas-safe stack - no webfont loading in iframes. */
export const invoicePdfFontFamily =
  "Arial, Helvetica, 'Segoe UI', system-ui, sans-serif";
