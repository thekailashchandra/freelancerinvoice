/** Public site identity — https://www.invoiceforfreelance.com */
export const siteConfig = {
  name: "Invoice for Freelance",
  tagline: "Freelancer Invoice Generator",
  url: "https://www.invoiceforfreelance.com",
  description:
    "Create professional invoices for freelancers. Cloud-backed storage, PDF export, and invoice history.",
  initials: "If",
  /** Light theme: Artboard 2 · Dark theme: Artboard 1 (source: /ogo/4x) */
  logos: {
    light: "/brand/logo-light.png",
    dark: "/brand/logo-dark.png",
  },
} as const;
