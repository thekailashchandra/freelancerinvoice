import {
  getLogoDimensions,
  resolveLogoHeight,
  type invoiceDesign,
} from "@/lib/invoice-design";
import type { CompanySettings } from "@/types/invoice";

export type CompanyIdentitySource = Pick<
  CompanySettings,
  | "companyName"
  | "companyEmail"
  | "companyPhone"
  | "companyAddress"
  | "gstin"
  | "logo"
  | "logoHeight"
  | "signature"
  | "hideSignatureTextFallback"
>;

export type LogoVariant = "classic" | "modern" | "minimal" | "bold";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function companyLogoMarkHtml(
  company: CompanyIdentitySource,
  options: {
    font: string;
    height?: number;
    variant?: LogoVariant;
  }
): string {
  const variant = options.variant ?? "classic";
  const logo = getLogoDimensions(resolveLogoHeight(company.logoHeight));
  const height =
    options.height ?? (variant === "minimal" ? Math.min(logo.height, 44) : logo.height);

  if (company.logo) {
    const bg =
      variant === "modern" ? "background:#111827;" : "";
    return `<img src="${company.logo}" alt="" style="display:block;width:${height}px;height:${height}px;max-width:${variant === "classic" ? logo.maxWidth : height}px;object-fit:contain;border:0;${bg}" />`;
  }

  const initial =
    variant === "minimal"
      ? `${(company.companyName || "y").charAt(0).toLowerCase()}.`
      : (company.companyName || "Y").charAt(0).toUpperCase();

  const bg =
    variant === "bold"
      ? "#1b2f24"
      : variant === "classic"
        ? "#111827"
        : "#111827";
  const radius = variant === "classic" ? "border-radius:50%;" : "";
  const fontSize =
    variant === "minimal"
      ? Math.round(height * 0.42)
      : variant === "bold"
        ? Math.round(height * 0.36)
        : Math.round(height * 0.38);

  return `<div style="width:${height}px;height:${height}px;${radius}background:${bg};color:#fff;font-family:${options.font};font-size:${fontSize}px;font-weight:${variant === "minimal" ? 400 : 700};text-align:center;line-height:${height}px">${escapeHtml(initial)}</div>`;
}

export function companyContactDetailsHtml(
  company: CompanyIdentitySource,
  options: {
    font: string;
    color: string;
    marginTop?: number;
    fullAddress?: boolean;
  }
): string {
  const mt = options.marginTop ?? 6;
  const lines: string[] = [];

  if (company.companyAddress?.trim()) {
    const addr = options.fullAddress
      ? company.companyAddress.trim()
      : company.companyAddress.split("\n")[0];
    lines.push(
      `<div style="margin-top:${mt}px;font-family:${options.font};font-size:12px;line-height:1.55;color:${options.color};white-space:pre-wrap">${escapeHtml(addr)}</div>`
    );
  }
  if (company.companyEmail?.trim()) {
    lines.push(
      `<div style="margin-top:${mt}px;font-family:${options.font};font-size:12px;color:${options.color}">${escapeHtml(company.companyEmail.trim())}</div>`
    );
  }
  if (company.companyPhone?.trim()) {
    lines.push(
      `<div style="margin-top:4px;font-family:${options.font};font-size:12px;color:${options.color}">${escapeHtml(company.companyPhone.trim())}</div>`
    );
  }
  if (company.gstin?.trim()) {
    lines.push(
      `<div style="margin-top:4px;font-family:${options.font};font-size:12px;color:${options.color}">GSTIN: ${escapeHtml(company.gstin.trim())}</div>`
    );
  }

  return lines.join("");
}

export function shouldShowSignatureFallback(
  company: Pick<
    CompanySettings,
    "signature" | "companyName" | "hideSignatureTextFallback"
  >
): boolean {
  return (
    !company.signature &&
    !company.hideSignatureTextFallback &&
    Boolean(company.companyName?.trim())
  );
}

export function getSignatureFallbackText(
  company: Pick<CompanySettings, "companyName">
): string {
  return company.companyName?.split(" ")[0] || "Authorized";
}

export function companySignatureBlockHtml(
  company: CompanyIdentitySource,
  options: {
    font: string;
    maxHeight: number;
    maxWidth: number;
    align?: "left" | "right" | "center";
    marginTop?: number;
    marginBottom?: number;
  }
): string {
  const align = options.align ?? "right";
  const marginTop = options.marginTop ?? 24;
  const marginBottom = options.marginBottom ?? 0;

  if (!company.signature && !shouldShowSignatureFallback(company)) {
    return "";
  }

  const img = company.signature
    ? `<img src="${company.signature}" alt="" style="display:inline-block;max-height:${options.maxHeight}px;max-width:${options.maxWidth}px;object-fit:contain;border:0" />`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-style:italic;color:#111827">${escapeHtml(getSignatureFallbackText(company))}</span>`;

  return `<div style="margin-top:${marginTop}px;margin-bottom:${marginBottom}px;text-align:${align}">${img}</div>`;
}

export function resolveLogoHeightForTemplate(
  company: CompanyIdentitySource,
  variant: LogoVariant
): number {
  const logo = getLogoDimensions(resolveLogoHeight(company.logoHeight));
  return variant === "minimal" ? Math.min(logo.height, 44) : logo.height;
}

export type SignatureSpec = (typeof invoiceDesign)["signature"];
