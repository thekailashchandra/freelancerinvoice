/** Public site identity - https://www.invoiceforfreelance.com */
export const siteConfig = {
  name: "Invoice for Freelance",
  tagline: "Freelancer billing, distilled",
  url: "https://www.invoiceforfreelance.com",
  description:
    "A monochrome invoicing studio for freelancers. Create polished invoices, track payments, and export client-ready PDFs. Self-host it free or subscribe to the cloud.",
  initials: "IF",
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL?.trim() ||
    "https://github.com/thekailashchandra/freelancerinvoice",
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
