import { invoiceDesign } from "@/lib/invoice-design";
import type { MarketRegion } from "@/lib/geo-market";

export type InvoiceTemplateId = "classic" | "modern" | "minimal" | "bold";

export type TemplateLayout = "classic" | "modern" | "minimal" | "bold";

export type InvoiceTemplateDefinition = {
  id: InvoiceTemplateId;
  name: string;
  description: string;
  isPremium: boolean;
  /** Tailwind bg class for picker swatch */
  swatchClass: string;
  layout: TemplateLayout;
};

export const invoiceTemplates: InvoiceTemplateDefinition[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean professional layout — free for everyone.",
    isPremium: false,
    swatchClass: "bg-slate-800",
    layout: "classic",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Minimal monochrome layout with gray billing block and bold totals.",
    isPremium: true,
    swatchClass: "bg-neutral-800",
    layout: "modern",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Airy whitespace, borderless table, and understated typography.",
    isPremium: true,
    swatchClass: "bg-neutral-300",
    layout: "minimal",
  },
  {
    id: "bold",
    name: "Simple",
    description: "Editorial cream layout with payment sidebar and split table.",
    isPremium: true,
    swatchClass: "bg-[#1b2f24]",
    layout: "bold",
  },
];

export function getInvoiceTemplate(id?: InvoiceTemplateId | null) {
  return (
    invoiceTemplates.find((t) => t.id === id) ??
    invoiceTemplates.find((t) => t.id === "classic")!
  );
}

export type TemplatePricing = {
  market: MarketRegion;
  currency: "USD" | "INR";
  amountMinor: number;
  displayAmount: string;
  label: string;
};

export function getTemplatePricing(market: MarketRegion): TemplatePricing {
  if (market === "IN") {
    return {
      market: "IN",
      currency: "INR",
      amountMinor: 9900,
      displayAmount: "₹99",
      label: "₹99 one-time",
    };
  }
  return {
    market: "GLOBAL",
    currency: "USD",
    amountMinor: 100,
    displayAmount: "$1",
    label: "$1 one-time",
  };
}

type DesignColors = Record<string, string>;

export type ResolvedTemplateDesign = typeof invoiceDesign & {
  layout: TemplateLayout;
  features: {
    headerBanner: boolean;
    tableStyle: "filled" | "outline" | "accent";
    accentBar: boolean;
    titleAccent: boolean;
  };
};

export function resolveTemplateDesign(
  templateId: InvoiceTemplateId = "classic"
): ResolvedTemplateDesign {
  const template = getInvoiceTemplate(templateId);
  const base = invoiceDesign;

  const palettes: Record<InvoiceTemplateId, Partial<DesignColors>> = {
    classic: {},
    modern: {
      tableHeader: "#f2f2f2",
      tableHeaderText: "#111827",
      accent: "#111827",
      accentLine: "#111827",
      accentBlue: "#111827",
      balanceDueBg: "#f2f2f2",
      surface: "#f2f2f2",
      surfaceMuted: "#f2f2f2",
      border: "#e5e7eb",
      borderStrong: "#d1d5db",
    },
    minimal: {
      tableHeader: "#ffffff",
      tableHeaderText: "#888888",
      border: "#e5e7eb",
      borderStrong: "#d1d5db",
      surface: "#ffffff",
      surfaceMuted: "#ffffff",
      balanceDueBg: "#ffffff",
      text: "#111827",
      textSecondary: "#374151",
      textMuted: "#888888",
      label: "#888888",
    },
    bold: {
      bg: "#f6f4ef",
      tableHeader: "#f6f4ef",
      tableHeaderText: "#1b2f24",
      accent: "#1b2f24",
      accentLine: "#1b2f24",
      balanceDueBg: "#f6f4ef",
      border: "#d4cfc4",
      borderStrong: "#c9c4b8",
      text: "#1b2f24",
      textSecondary: "#3d5248",
      textMuted: "#5a6d62",
      surface: "#f6f4ef",
      surfaceMuted: "#f6f4ef",
    },
  };

  const features: Record<InvoiceTemplateId, ResolvedTemplateDesign["features"]> =
    {
      classic: {
        headerBanner: false,
        tableStyle: "filled",
        accentBar: false,
        titleAccent: false,
      },
      modern: {
        headerBanner: false,
        tableStyle: "outline",
        accentBar: false,
        titleAccent: false,
      },
      minimal: {
        headerBanner: false,
        tableStyle: "outline",
        accentBar: false,
        titleAccent: false,
      },
      bold: {
        headerBanner: false,
        tableStyle: "outline",
        accentBar: false,
        titleAccent: false,
      },
    };

  return {
    ...base,
    colors: {
      ...base.colors,
      ...(palettes[template.id] as Partial<DesignColors>),
    },
    layout: template.layout,
    features: features[template.id],
  };
}
