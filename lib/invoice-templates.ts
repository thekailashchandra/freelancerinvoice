import { invoiceDesign } from "@/lib/invoice-design";
import { normalizeBrandColor } from "@/lib/brand-color";
import type { MarketRegion } from "@/lib/geo-market";

export type InvoiceTemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "bold"
  | "corporate"
  | "studio"
  | "geometric"
  | "swiss";

export type TemplateLayout =
  | "classic"
  | "modern"
  | "minimal"
  | "bold"
  | "corporate"
  | "studio"
  | "geometric"
  | "swiss";

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
    description: "Clean, confident layout with your logo and payment block.",
    isPremium: false,
    swatchClass: "bg-slate-800",
    layout: "classic",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Monochrome billing block with bold totals and a sharp table.",
    isPremium: false,
    swatchClass: "bg-neutral-800",
    layout: "modern",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Airy whitespace, borderless table, and understated typography.",
    isPremium: false,
    swatchClass: "bg-neutral-300",
    layout: "minimal",
  },
  {
    id: "bold",
    name: "Simple",
    description: "Editorial layout with a payment sidebar and split table.",
    isPremium: false,
    swatchClass: "bg-[#111111]",
    layout: "bold",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Structured gray panels with a formal total due block.",
    isPremium: false,
    swatchClass: "bg-neutral-200",
    layout: "corporate",
  },
  {
    id: "studio",
    name: "Studio",
    description: "Dark brand sidebar with a striped item table.",
    isPremium: false,
    swatchClass: "bg-neutral-900",
    layout: "studio",
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "Bold color blocks and an editorial invoice header.",
    isPremium: false,
    swatchClass: "bg-gradient-to-br from-neutral-800 to-neutral-400",
    layout: "geometric",
  },
  {
    id: "swiss",
    name: "Swiss",
    description: "Grid-led minimalism with a heavy table header.",
    isPremium: false,
    swatchClass: "bg-neutral-100 border border-neutral-300",
    layout: "swiss",
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
  templateId: InvoiceTemplateId = "classic",
  brandColor?: string | null
): ResolvedTemplateDesign {
  const template = getInvoiceTemplate(templateId);
  const base = invoiceDesign;
  const accent = normalizeBrandColor(brandColor);

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
      bg: "#f7f7f5",
      tableHeader: "#f7f7f5",
      tableHeaderText: "#111111",
      accent: "#111111",
      accentLine: "#111111",
      balanceDueBg: "#f7f7f5",
      border: "#d4d4d4",
      borderStrong: "#c9c9c9",
      text: "#111111",
      textSecondary: "#333333",
      textMuted: "#555555",
      surface: "#f7f7f5",
      surfaceMuted: "#f7f7f5",
    },
    corporate: {
      tableHeader: "#ffffff",
      tableHeaderText: "#111111",
      accent: "#111111",
      accentBlue: "#111111",
      accentLine: "#111111",
      surface: "#f4f4f4",
      surfaceMuted: "#ececec",
      border: "#dcdcdc",
      borderStrong: "#bdbdbd",
      text: "#111111",
      textSecondary: "#333333",
      textMuted: "#666666",
      balanceDueBg: "#f1f1f1",
    },
    studio: {
      tableHeader: "#111111",
      tableHeaderText: "#ffffff",
      accent: "#111111",
      accentBlue: "#111111",
      accentLine: "#111111",
      surface: "#f5f5f5",
      surfaceMuted: "#ebebeb",
      border: "#dddddd",
      borderStrong: "#bdbdbd",
      text: "#111111",
      textSecondary: "#333333",
      textMuted: "#666666",
      balanceDueBg: "#111111",
    },
    geometric: {
      tableHeader: "#111111",
      tableHeaderText: "#ffffff",
      accent: "#111111",
      accentBlue: "#111111",
      accentLine: "#111111",
      surface: "#f2f2f2",
      surfaceMuted: "#e8e8e8",
      border: "#d8d8d8",
      borderStrong: "#b8b8b8",
      text: "#111111",
      textSecondary: "#333333",
      textMuted: "#666666",
      balanceDueBg: "#111111",
    },
    swiss: {
      tableHeader: "#111111",
      tableHeaderText: "#ffffff",
      accent: "#111111",
      accentBlue: "#111111",
      accentLine: "#111111",
      surface: "#ffffff",
      surfaceMuted: "#f4f4f4",
      border: "#d4d4d4",
      borderStrong: "#111111",
      text: "#111111",
      textSecondary: "#333333",
      textMuted: "#666666",
      balanceDueBg: "#ffffff",
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
      corporate: {
        headerBanner: false,
        tableStyle: "outline",
        accentBar: false,
        titleAccent: true,
      },
      studio: {
        headerBanner: false,
        tableStyle: "filled",
        accentBar: false,
        titleAccent: false,
      },
      geometric: {
        headerBanner: false,
        tableStyle: "filled",
        accentBar: false,
        titleAccent: true,
      },
      swiss: {
        headerBanner: false,
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
      accent,
      accentBlue: accent,
      accentLine: accent,
      discount: accent,
    } as typeof invoiceDesign.colors,
    layout: template.layout,
    features: features[template.id],
  };
}
