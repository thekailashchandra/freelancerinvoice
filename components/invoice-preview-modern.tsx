"use client";

import { memo, useMemo, type CSSProperties, type ReactNode } from "react";
import type { Invoice } from "@/types/invoice";
import { calculateTotals } from "@/lib/calculations";
import {
  getInvoicePageSpec,
  getLogoDimensions,
  resolveInvoicePageSize,
  resolveLogoHeight,
} from "@/lib/invoice-design";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import {
  formatModernHeaderDate,
  formatModernMetaDate,
  modernTotalDuePattern,
} from "@/lib/invoice-modern-dates";
import { modernTheme as t } from "@/lib/invoice-modern-theme";
import { InvoiceMoney } from "@/components/invoice-money";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import {
  getSignatureFallbackText,
  shouldShowSignatureFallback,
} from "@/lib/invoice-company-identity";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";
import {
  InvoiceCompanyContactDetails,
  InvoiceCompanyLogo,
} from "@/components/invoice-company-branding";

type InvoicePreviewModernProps = {
  invoice: Invoice;
  previewId?: string;
  showBranding?: boolean;
  onRemoveBranding?: () => void;
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: t.accent,
      }}
    >
      {children}
    </p>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 14px",
        backgroundColor: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: t.radiusSm,
        boxShadow: t.shadowSm,
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: t.textMuted,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: t.text,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: t.radius,
        padding: "18px 20px",
        boxShadow: t.shadowSm,
        ...style,
      }}
    >
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

export const InvoicePreviewModern = memo(function InvoicePreviewModern({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: InvoicePreviewModernProps) {
  const d = useMemo(
    () => resolveTemplateDesign(invoice.templateId ?? "modern"),
    [invoice.templateId]
  );
  const showPoweredBy =
    showBranding ?? shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding);
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const logo = getLogoDimensions(resolveLogoHeight(invoice.company.logoHeight));
  const totals = useMemo(
    () =>
      calculateTotals(invoice.services, invoice.taxDiscount, invoice.taxLabel),
    [invoice.services, invoice.taxDiscount, invoice.taxLabel]
  );
  const currency = invoice.currencyCode;
  const paymentOptions = useMemo(
    () => invoicePaymentDisplayOptions(invoice.company.companyName),
    [invoice.company.companyName]
  );
  const paymentLines = useMemo(
    () => getInvoicePaymentInfo(invoice.payment, paymentOptions),
    [invoice.payment, paymentOptions]
  );
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const clientAddress = invoice.client.address?.trim();
  const clientPhone = invoice.client.phone?.trim();
  const clientEmail = invoice.client.email?.trim();
  const termsText =
    invoice.termsAndConditions?.trim() ||
    invoice.notes?.trim() ||
    "Payment is due by the date shown above. Thank you for your business.";

  return (
    <div
      id={previewId}
      className="invoice-print-area font-sans"
      data-page-size={pageSpec.pdfFormat}
      data-template="modern"
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: d.font,
        backgroundColor: t.surface,
        color: t.text,
        width: `${pageSpec.widthPx}px`,
        maxWidth: `${pageSpec.widthPx}px`,
        minHeight: `${pageSpec.heightPx}px`,
        boxSizing: "border-box",
        fontVariantNumeric: "tabular-nums",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Hero header */}
      <div
        style={{
          background: t.headerGradient,
          padding: `${pageSpec.paddingPx}px ${pageSpec.paddingPx}px 28px`,
          color: t.textOnDark,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: 0 }}>
            <InvoiceCompanyLogo company={invoice.company} variant="modern" />
            <InvoiceCompanyContactDetails
              company={invoice.company}
              nameStyle={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.02em",
                textTransform: "none",
                color: t.textOnDark,
              }}
              lineStyle={{
                fontSize: 11,
                lineHeight: 1.55,
                color: t.textOnDarkMuted,
              }}
            />
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Invoice
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              {invoice.invoice.invoiceNumber}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 11,
                fontWeight: 500,
                color: t.textOnDarkMuted,
              }}
            >
              {formatModernHeaderDate(invoice.invoice.invoiceDate)}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: `0 ${pageSpec.paddingPx}px ${pageSpec.paddingPx}px`,
          marginTop: -16,
        }}
      >
        {/* Client cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <InfoCard title="Bill To">
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>
              {invoice.client.name || "Client name"}
            </p>
            {invoice.client.company ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: t.textSecondary }}>
                {invoice.client.company}
              </p>
            ) : null}
            {clientAddress ? (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  color: t.textMuted,
                  lineHeight: 1.55,
                  whiteSpace: "pre-line",
                }}
              >
                {clientAddress}
              </p>
            ) : null}
            {clientEmail ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: t.textMuted }}>
                {clientEmail}
              </p>
            ) : null}
            {clientPhone ? (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: t.textMuted }}>
                {clientPhone}
              </p>
            ) : null}
          </InfoCard>

          <InfoCard title="Ship To">
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: t.textSecondary }}>
              {invoice.client.company ? "Office Address" : "Billing Address"}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                color: t.textMuted,
                lineHeight: 1.55,
                whiteSpace: "pre-line",
              }}
            >
              {clientAddress || clientEmail || "—"}
            </p>
            {clientPhone ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: t.textMuted }}>
                {clientPhone}
              </p>
            ) : null}
          </InfoCard>
        </div>

        {/* Meta chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <MetaChip
            label="Issue Date"
            value={formatModernMetaDate(invoice.invoice.invoiceDate)}
          />
          {invoice.invoice.dueDate ? (
            <MetaChip label="Due Date" value={formatDate(invoice.invoice.dueDate)} />
          ) : null}
          {invoice.invoice.purchaseOrder?.trim() ? (
            <MetaChip
              label="P.O. Number"
              value={invoice.invoice.purchaseOrder.trim()}
            />
          ) : null}
          {invoice.invoice.projectName?.trim() ? (
            <MetaChip
              label="Project"
              value={invoice.invoice.projectName.trim()}
            />
          ) : null}
        </div>

        {/* Line items */}
        <div
          style={{
            backgroundColor: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: t.radius,
            overflow: "hidden",
            boxShadow: t.shadowSm,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <colgroup>
              <col style={{ width: 44 }} />
              <col />
              <col style={{ width: 88 }} />
              <col style={{ width: 72 }} />
              <col style={{ width: 96 }} />
            </colgroup>
            <thead>
              <tr style={{ backgroundColor: t.tableHeadBg }}>
                {["#", "Description", "Rate", "Qty", "Amount"].map((col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textAlign: i >= 2 ? "right" : "left",
                      color: t.tableHeadText,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.services.map((item, index) => {
                const lineAmount = item.quantity * item.price;
                const isAlt = index % 2 === 1;
                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: isAlt ? t.rowAlt : t.cardBg,
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 12px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: t.textMuted,
                        verticalAlign: "top",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "14px 12px", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
                        {item.name || "Service"}
                      </div>
                      {item.description ? (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 11,
                            lineHeight: 1.5,
                            color: t.textMuted,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.description}
                        </div>
                      ) : null}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        textAlign: "right",
                        fontSize: 12,
                        color: t.textSecondary,
                        verticalAlign: "top",
                      }}
                    >
                      <InvoiceMoney amount={item.price} currencyCode={currency} />
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        textAlign: "right",
                        fontSize: 12,
                        color: t.textSecondary,
                        verticalAlign: "top",
                      }}
                    >
                      {formatInvoiceAmount(item.quantity)}
                    </td>
                    <td
                      style={{
                        padding: "14px 12px",
                        textAlign: "right",
                        fontSize: 12,
                        fontWeight: 700,
                        color: t.text,
                        verticalAlign: "top",
                      }}
                    >
                      <InvoiceMoney amount={lineAmount} currencyCode={currency} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 20,
          }}
        >
          <div style={{ flex: 1, maxWidth: 300 }}>
            <SectionTitle>Amount Due</SectionTitle>
            <div
              style={{
                padding: "22px 24px",
                background: modernTotalDuePattern,
                borderRadius: t.radius,
                boxShadow: "0 12px 32px rgba(79,70,229,0.28)",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                <InvoiceMoney amount={totals.total} currencyCode={currency} />
              </div>
              {invoice.invoice.dueDate ? (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Due by {formatDate(invoice.invoice.dueDate)}
                </p>
              ) : null}
            </div>
          </div>

          <div
            style={{
              width: 252,
              alignSelf: "flex-end",
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: t.radius,
              padding: "16px 18px",
              boxShadow: t.shadowSm,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                fontSize: 12,
                color: t.textSecondary,
              }}
            >
              <span>Subtotal</span>
              <InvoiceMoney amount={totals.subtotal} currencyCode={currency} />
            </div>
            {totals.discountAmount > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  fontSize: 12,
                  color: "#059669",
                }}
              >
                <span>Discount</span>
                <span style={{ display: "inline-flex", gap: 2 }}>
                  <span>−</span>
                  <InvoiceMoney
                    amount={totals.discountAmount}
                    currencyCode={currency}
                  />
                </span>
              </div>
            ) : null}
            {taxOn ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  fontSize: 12,
                  color: t.textSecondary,
                }}
              >
                <span>{invoice.taxLabel || "Tax"}</span>
                <InvoiceMoney amount={taxAmt} currencyCode={currency} />
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0 0",
                marginTop: 8,
                borderTop: `2px solid ${t.text}`,
                fontSize: 14,
                fontWeight: 800,
                color: t.text,
              }}
            >
              <span>Total</span>
              <InvoiceMoney amount={totals.total} currencyCode={currency} />
            </div>
          </div>
        </div>

        {/* Footer cards */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 14,
          }}
        >
          {hasInvoicePaymentInfo(invoice.payment, paymentOptions) ? (
            <InfoCard title="Payment Details">
              {paymentLines.map((line) => (
                <p
                  key={line.label}
                  style={{
                    margin: "0 0 6px",
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: t.textSecondary,
                  }}
                >
                  <span style={{ fontWeight: 700, color: t.text }}>{line.label}: </span>
                  {line.value}
                </p>
              ))}
            </InfoCard>
          ) : (
            <div />
          )}

          <InfoCard title="Terms">
            <p
              style={{
                margin: 0,
                fontSize: 11,
                lineHeight: 1.65,
                color: t.textMuted,
                whiteSpace: "pre-wrap",
              }}
            >
              {termsText}
            </p>
          </InfoCard>

          <InfoCard title="Authorized By">
            {invoice.company.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.company.signature}
                alt=""
                style={{
                  display: "block",
                  maxHeight: d.signature.maxHeight,
                  maxWidth: d.signature.maxWidth,
                  objectFit: "contain",
                }}
              />
            ) : shouldShowSignatureFallback(invoice.company) ? (
              <span
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 26,
                  fontStyle: "italic",
                  color: t.text,
                }}
              >
                {getSignatureFallbackText(invoice.company)}
              </span>
            ) : null}
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 11,
                fontWeight: 700,
                color: t.text,
              }}
            >
              {invoice.company.companyName || "Your business"}
            </p>
          </InfoCard>
        </div>

        {/* Company footer strip */}
        <div
          style={{
            marginTop: 24,
            padding: "16px 18px",
            backgroundColor: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: t.radius,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 16,
            alignItems: "center",
            fontSize: 11,
            color: t.textMuted,
            lineHeight: 1.55,
          }}
        >
          <div>
            {invoice.company.companyAddress ? (
              <p style={{ margin: 0, whiteSpace: "pre-line" }}>
                {invoice.company.companyAddress}
              </p>
            ) : null}
            <p style={{ margin: invoice.company.companyAddress ? "6px 0 0" : 0 }}>
              {[
                invoice.company.companyEmail?.trim(),
                invoice.company.companyPhone?.trim(),
                invoice.company.gstin?.trim()
                  ? `GSTIN: ${invoice.company.gstin.trim()}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {(invoice.company.companyEmail || invoice.company.companyPhone) && (
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: t.accent,
                }}
              >
                Questions?
              </p>
              {invoice.company.companyEmail ? (
                <p style={{ margin: "6px 0 0", fontWeight: 600, color: t.text }}>
                  {invoice.company.companyEmail}
                </p>
              ) : null}
              {invoice.company.companyPhone ? (
                <p style={{ margin: "4px 0 0" }}>{invoice.company.companyPhone}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {showPoweredBy ? (
        <div style={{ padding: `0 ${pageSpec.paddingPx}px ${pageSpec.paddingPx}px` }}>
          <InvoicePoweredBy onRemoveBranding={onRemoveBranding} />
        </div>
      ) : null}
    </div>
  );
});
