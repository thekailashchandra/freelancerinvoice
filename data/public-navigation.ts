/** Primary public site navigation links (header - keep minimal) */

export const mainNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
] as const;

/** Full site links for footer and mobile drawer */
export const footerNavLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/subscribe", label: "Cloud plan" },
  { href: "/guide", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/invoice-templates", label: "Templates" },
  { href: "/india", label: "India invoicing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/freelance-finances", label: "Freelance finances" },
  { href: "/global-freelance-invoicing-compliance", label: "Global compliance" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
] as const;

/** Compact list for mobile drawer (no legal/auth duplicates) */
export const mobileNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/subscribe", label: "Cloud plan" },
  { href: "/guide", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
