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
} as const;
