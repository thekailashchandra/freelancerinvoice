import {
  Cloud,
  Download,
  FileText,
  Globe,
  History,
  Palette,
  QrCode,
  Receipt,
  Shield,
  type LucideIcon,
} from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const productFeatures: FeatureItem[] = [
  {
    icon: FileText,
    title: "Professional freelancer invoices",
    description:
      "Build polished invoices with live preview, your logo, itemized line items, taxes, and payment terms — ready to send in minutes.",
  },
  {
    icon: Download,
    title: "One-click PDF export",
    description:
      "Download client-ready PDF invoices without wrestling with Word templates, spreadsheets, or manual formatting.",
  },
  {
    icon: Cloud,
    title: "Cloud-backed storage",
    description:
      "Every invoice is saved securely to your account. Access billing history from any device, anytime.",
  },
  {
    icon: History,
    title: "Invoice history & filters",
    description:
      "Search past invoices and filter by paid, pending, overdue, or void status to stay on top of cash flow.",
  },
  {
    icon: Globe,
    title: "Multi-currency billing",
    description:
      "Invoice international clients with the right currency and country-specific payment fields on every bill.",
  },
  {
    icon: QrCode,
    title: "UPI & payment details",
    description:
      "Add UPI IDs, bank details, and other payment methods so clients know exactly how to pay you.",
  },
  {
    icon: Palette,
    title: "Branding & customization",
    description:
      "Upload your logo, adjust colors, and present a consistent professional identity on every invoice.",
  },
  {
    icon: Receipt,
    title: "GST-ready invoicing",
    description:
      "Support for GST fields and formats that Indian freelancers need for compliant billing.",
  },
  {
    icon: Shield,
    title: "Secure, private accounts",
    description:
      "Row-level security keeps every account isolated. Only you can access your invoices, clients, and settings.",
  },
];
