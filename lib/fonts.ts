/**
 * Self-hosted variable fonts (Geist) — no runtime requests to fonts.googleapis.com.
 * Files ship from the `geist` package via next/font/local.
 */
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export const geistSans = GeistSans;
export const geistMono = GeistMono;

/** CSS font-family stack for invoice preview (matches root layout). */
export const invoicePreviewFontFamily =
  "var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** PDF / html2canvas-safe stack — no webfont loading in iframes. */
export const invoicePdfFontFamily =
  "Arial, Helvetica, 'Segoe UI', system-ui, sans-serif";
