"use client";

import type { CSSProperties } from "react";
import type { CompanySettings } from "@/types/invoice";
import {
  resolveLogoHeightForTemplate,
  type CompanyIdentitySource,
  type LogoVariant,
} from "@/lib/invoice-company-identity";
import { getLogoDimensions, resolveLogoHeight } from "@/lib/invoice-design";

type CompanyBrandingProps = {
  company: CompanyIdentitySource;
  variant?: LogoVariant;
  accentColor?: string;
};

export function InvoiceCompanyLogo({
  company,
  variant = "classic",
  accentColor = "#111827",
}: CompanyBrandingProps) {
  const height = resolveLogoHeightForTemplate(company, variant);
  const logo = getLogoDimensions(resolveLogoHeight(company.logoHeight));

  if (company.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={company.logo}
        alt=""
        style={{
          display: "block",
          width: variant === "classic" ? "auto" : height,
          height,
          maxWidth: variant === "classic" ? logo.maxWidth : height,
          objectFit: "contain",
          backgroundColor: variant === "modern" ? "#111827" : undefined,
          flexShrink: 0,
        }}
      />
    );
  }

  const initial =
    variant === "minimal"
      ? `${(company.companyName || "y").charAt(0).toLowerCase()}.`
      : (company.companyName || "Y").charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: height,
        height,
        borderRadius: variant === "classic" ? "50%" : 0,
        backgroundColor: variant === "bold" ? "#1b2f24" : accentColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize:
          variant === "minimal"
            ? Math.round(height * 0.42)
            : Math.round(height * 0.38),
        fontWeight: variant === "minimal" ? 400 : 700,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

type ContactDetailsProps = {
  company: CompanyIdentitySource;
  nameStyle?: CSSProperties;
  lineStyle?: CSSProperties;
  fullAddress?: boolean;
  showName?: boolean;
};

export function InvoiceCompanyContactDetails({
  company,
  nameStyle,
  lineStyle,
  fullAddress = true,
  showName = true,
}: ContactDetailsProps) {
  const muted: CSSProperties = {
    margin: "4px 0 0",
    fontSize: 12,
    lineHeight: 1.55,
    color: "#6b7280",
    whiteSpace: "pre-line",
    ...lineStyle,
  };

  const address = company.companyAddress?.trim();
  const displayAddress = address
    ? fullAddress
      ? address
      : address.split("\n")[0]
    : "";

  return (
    <div>
      {showName ? (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            ...nameStyle,
          }}
        >
          {company.companyName || "Your business"}
        </p>
      ) : null}
      {displayAddress ? <p style={muted}>{displayAddress}</p> : null}
      {company.companyEmail?.trim() ? (
        <p style={muted}>{company.companyEmail.trim()}</p>
      ) : null}
      {company.companyPhone?.trim() ? (
        <p style={muted}>{company.companyPhone.trim()}</p>
      ) : null}
      {company.gstin?.trim() ? (
        <p style={muted}>GSTIN: {company.gstin.trim()}</p>
      ) : null}
    </div>
  );
}

export function InvoiceCompanySignature({
  company,
  maxHeight,
  maxWidth,
  align = "right",
}: {
  company: Pick<CompanySettings, "signature" | "companyName">;
  maxHeight: number;
  maxWidth: number;
  align?: "left" | "right" | "center";
}) {
  if (!company.signature && !company.companyName?.trim()) return null;

  return (
    <div style={{ marginTop: 24, textAlign: align }}>
      {company.signature ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.signature}
          alt=""
          style={{
            display: "inline-block",
            maxHeight,
            maxWidth,
            objectFit: "contain",
          }}
        />
      ) : (
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 28,
            fontStyle: "italic",
            color: "#111827",
          }}
        >
          {company.companyName?.split(" ")[0] || "Authorized"}
        </span>
      )}
    </div>
  );
}
