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
    description: "Blue accent lines and contemporary typography.",
    isPremium: true,
    swatchClass: "bg-blue-600",
    layout: "modern",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Light borders, airy spacing, understated elegance.",
    isPremium: true,
    swatchClass: "bg-neutral-400",
    layout: "minimal",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Dark header band with high-contrast totals.",
    isPremium: true,
    swatchClass: "bg-slate-950",
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
      tableHeader: "#2563eb",
      accent: "#2563eb",
      accentLine: "#2563eb",
      accentBlue: "#2563eb",
      balanceDueBg: "#eff6ff",
    },
    minimal: {
      tableHeader: "#ffffff",
      tableHeaderText: "#374151",
      border: "#d1d5db",
      borderStrong: "#9ca3af",
      surface: "#ffffff",
      surfaceMuted: "#fafafa",
      balanceDueBg: "#fafafa",
      textMuted: "#6b7280",
    },
    bold: {
      tableHeader: "#0f172a",
      accent: "#0f172a",
      accentLine: "#0f172a",
      balanceDueBg: "#0f172a",
      total: "#ffffff",
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
        tableStyle: "accent",
        accentBar: true,
        titleAccent: true,
      },
      minimal: {
        headerBanner: false,
        tableStyle: "outline",
        accentBar: false,
        titleAccent: false,
      },
      bold: {
        headerBanner: true,
        tableStyle: "filled",
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
