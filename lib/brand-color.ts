/** Brand color helpers shared by the preview and PDF renderers. */

export const DEFAULT_BRAND_COLOR = "#111111";

const HEX_RE = /^#([0-9a-fA-F]{6})$/;
const SHORT_HEX_RE = /^#([0-9a-fA-F]{3})$/;

export function normalizeBrandColor(value?: string | null): string {
  const raw = value?.trim();
  if (!raw) return DEFAULT_BRAND_COLOR;
  if (HEX_RE.test(raw)) return raw.toLowerCase();
  if (SHORT_HEX_RE.test(raw)) {
    const [, short] = raw.match(SHORT_HEX_RE) ?? [];
    if (!short) return DEFAULT_BRAND_COLOR;
    return `#${short
      .split("")
      .map((c) => `${c}${c}`)
      .join("")}`.toLowerCase();
  }
  return DEFAULT_BRAND_COLOR;
}

function toRgb(hex: string): [number, number, number] {
  const normalized = normalizeBrandColor(hex).slice(1);
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHex(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

/** Mix a color toward another color. weight is 0..1 (0 = base, 1 = target). */
export function mixHex(base: string, target: string, weight: number): string {
  const [r1, g1, b1] = toRgb(base);
  const [r2, g2, b2] = toRgb(target);
  const w = Math.max(0, Math.min(1, weight));
  return `#${toHex(r1 + (r2 - r1) * w)}${toHex(g1 + (g2 - g1) * w)}${toHex(
    b1 + (b2 - b1) * w
  )}`;
}

export function readableOnColor(hex: string): string {
  const [r, g, b] = toRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#111111" : "#ffffff";
}

export function brandTint(hex: string, weight = 0.9): string {
  return mixHex(hex, "#ffffff", weight);
}

export function brandShade(hex: string, weight = 0.55): string {
  return mixHex(hex, "#000000", weight);
}
