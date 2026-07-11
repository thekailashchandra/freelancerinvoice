import { siteConfig } from "@/data/site";

/**
 * Founder / creator blurb for the About page.
 * Edit these fields with your real name, bio, and optional photo URL.
 */
export const founder = {
  name: "Your Name",
  role: "Founder",
  bio: `I built ${siteConfig.name} after seeing too many freelancers struggle with Word templates, scattered spreadsheets, and bloated accounting tools that were never meant for solo billing. This project keeps professional invoicing simple: live preview, branded PDFs, and cloud history without a monthly subscription.`,
  /** Set to a public image path (e.g. "/brand/founder.jpg") or null to hide the photo slot */
  photo: null as string | null,
  /** Optional link — LinkedIn, personal site, etc. */
  website: null as string | null,
} as const;
