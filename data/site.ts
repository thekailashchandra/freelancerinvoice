/** Public site identity — https://www.invoiceforfreelance.com */
export const siteConfig = {
  name: "Invoice for Freelance",
  tagline: "Freelancer Invoice Generator",
  url: "https://www.invoiceforfreelance.com",
  description:
    "Invoice for Freelance is a free invoice generator built for freelancers. Create professional invoices, export PDFs, track payments, and manage invoice history in the cloud.",
  initials: "If",
  /** Light theme: Artboard 1 · Dark theme: Artboard 2 (source: /ogo/4x) */
  logos: {
    light: "/brand/logo-light.png",
    dark: "/brand/logo-dark.png",
  },
  /** Square icons for favicon, PWA, and Organization schema (Google Search). */
  icons: {
    faviconIco: "/favicon.ico",
    favicon48: "/favicon-48.png",
    favicon96: "/favicon-96.png",
    app192: "/icon.png",
    app512: "/icon-512.png",
  },
  supportTipUrl: "https://ko-fi.com/invoiceforfreelance",
} as const;

export function absoluteSiteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
