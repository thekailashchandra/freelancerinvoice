"use client";

import { memo, useMemo } from "react";
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
  formatMinimalFooterYear,
} from "@/lib/invoice-minimal-dates";
import { InvoiceMoney } from "@/components/invoice-money";
import { InvoiceSummaryTaxRows } from "@/components/invoice-summary-tax-rows";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";
import {
  InvoiceCompanyContactDetails,
  InvoiceCompanyLogo,
  InvoiceCompanySignature,
} from "@/components/invoice-company-branding";

type InvoicePreviewMinimalProps = {
  invoice: Invoice;
  previewId?: string;
  showBranding?: boolean;
  onRemoveBranding?: () => void;
};

const labelColor = "#6b7280";
const bodyColor = "#4b5563";

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: labelColor,
};

const bodyMuted: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12,
  lineHeight: 1.55,
  color: bodyColor,
};

export const InvoicePreviewMinimal = memo(function InvoicePreviewMinimal({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: InvoicePreviewMinimalProps) {
  const d = useMemo(
    () => resolveTemplateDesign(invoice.templateId ?? "minimal", invoice.company.brandColor),
    [invoice.templateId, invoice.company.brandColor]
  );
  const showPoweredBy =
    showBranding ?? shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding);
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const logo = getLogoDimensions(resolveLogoHeight(invoice.company.logoHeight));
  const logoSize = Math.min(logo.height, 44);

  const totals = useMemo(
    () =>
      calculateTotals(invoice.services, invoice.taxDiscount, invoice.taxLabel),
    [invoice.services, invoice.taxDiscount, invoice.taxLabel]
  );
  const currency = invoice.currencyCode;
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxPct =
    invoice.taxDiscount.taxPercentage ??
    invoice.taxDiscount.gstPercentage ??
    0;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;
  const paymentTerms =
    invoice.invoice.paymentTerms?.trim() || "Due on receipt";

  const paymentOptions = useMemo(
    () => invoicePaymentDisplayOptions(invoice.company.companyName),
    [invoice.company.companyName]
  );
  const paymentLines = useMemo(
    () => getInvoicePaymentInfo(invoice.payment, paymentOptions),
    [invoice.payment, paymentOptions]
  );

  const notesText = invoice.notes?.trim();
  const termsText = invoice.termsAndConditions?.trim();

  const closingLine = invoice.company.companyName
    ? `Have a nice day and thank you! ${invoice.company.companyName.split(" ")[0]}`
    : "Have a nice day and thank you!";

  const footerYear = formatMinimalFooterYear(invoice.invoice.invoiceDate);

  const metaItems = [
    { label: "Issue Date", value: formatDate(invoice.invoice.invoiceDate) },
    invoice.invoice.dueDate
      ? { label: "Due Date", value: formatDate(invoice.invoice.dueDate) }
      : null,
    { label: "Terms", value: paymentTerms },
    invoice.invoice.purchaseOrder?.trim()
      ? { label: "P.O.#", value: invoice.invoice.purchaseOrder.trim() }
      : null,
    invoice.invoice.projectName?.trim()
      ? { label: "Project", value: invoice.invoice.projectName.trim() }
      : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <div
      id={previewId}
      className="invoice-print-area font-sans"
      data-page-size={pageSpec.pdfFormat}
      data-template="minimal"
      data-logo-height={String(logoSize)}
      style={{
        fontFamily: d.font,
        backgroundColor: "#ffffff",
        color: "#111827",
        padding: `${pageSpec.paddingPx + 8}px`,
        width: `${pageSpec.widthPx}px`,
        maxWidth: `${pageSpec.widthPx}px`,
        minHeight: `${pageSpec.heightPx}px`,
        boxSizing: "border-box",
        fontVariantNumeric: "tabular-nums",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* Top bar: logo | sender contact */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 48,
          }}
        >
          <InvoiceCompanyLogo company={invoice.company} variant="minimal" />

          <div style={{ textAlign: "right", maxWidth: 280 }}>
            <InvoiceCompanyContactDetails
              company={invoice.company}
              nameStyle={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
              lineStyle={{ ...bodyMuted, marginLeft: "auto", maxWidth: 240 }}
            />
          </div>
        </div>

        {/* Recipient | Invoice title */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={labelStyle}>Recipient</p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {invoice.client.name || "Client name"}
            </p>
            {invoice.client.company ? (
              <p style={{ ...bodyMuted, marginTop: 6, fontWeight: 500 }}>
                {invoice.client.company}
              </p>
            ) : null}
            {invoice.client.address ? (
              <p
                style={{
                  ...bodyMuted,
                  marginTop: 8,
                  whiteSpace: "pre-line",
                }}
              >
                {invoice.client.address}
              </p>
            ) : null}
            {invoice.client.email ? (
              <p style={bodyMuted}>{invoice.client.email}</p>
            ) : null}
            {invoice.client.phone ? (
              <p style={bodyMuted}>{invoice.client.phone}</p>
            ) : null}
            {invoice.client.gstin?.trim() ? (
              <p style={bodyMuted}>GSTIN: {invoice.client.gstin.trim()}</p>
            ) : null}
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: "0.02em",
                lineHeight: 1,
                color: "#111827",
              }}
            >
              INVOICE
            </h1>
            <p style={{ ...labelStyle, marginTop: 16 }}>Invoice Number</p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                fontWeight: 500,
                color: "#111827",
              }}
            >
              {invoice.invoice.invoiceNumber}
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-end",
              }}
            >
              {metaItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: 12,
                    fontSize: 11,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: labelColor, letterSpacing: "0.06em" }}>
                    {item.label}
                  </span>
                  <span style={{ color: "#111827", fontWeight: 500 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line items - borderless table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col />
            <col style={{ width: 72 }} />
            <col style={{ width: 56 }} />
            <col style={{ width: 88 }} />
          </colgroup>
          <thead>
            <tr>
              {["Description", "Rate", "Qty", "Amount"].map((col, i) => (
                <th
                  key={col}
                  style={{
                    padding: "0 0 14px",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textAlign: i >= 1 ? "right" : "left",
                    color: labelColor,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((item) => {
              const lineAmount = item.quantity * item.price;
              return (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: "12px 8px 12px 0",
                      fontSize: 13,
                      color: bodyColor,
                      verticalAlign: "top",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      {item.name || "Service"}
                    </span>
                    {item.description ? (
                      <span style={{ color: labelColor }}>
                        {" "}
                        - {item.description}
                      </span>
                    ) : null}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      color: bodyColor,
                      verticalAlign: "top",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <InvoiceMoney amount={item.price} currencyCode={currency} />
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      color: bodyColor,
                      verticalAlign: "top",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {formatInvoiceAmount(item.quantity)}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      verticalAlign: "top",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <InvoiceMoney amount={lineAmount} currencyCode={currency} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div
          style={{
            marginTop: 8,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ width: 220 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                fontSize: 12,
                color: bodyColor,
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
                  padding: "4px 0",
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
            <InvoiceSummaryTaxRows
              totals={totals}
              currency={currency}
              taxOn={taxOn}
              taxLabel={invoice.taxLabel}
              taxAmt={taxAmt}
              taxPct={taxPct}
              rowStyle={{ fontSize: 12, color: bodyColor }}
            />
            {totals.additionalCharges.map((charge) => (
              <div
                key={charge.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "4px 0",
                  fontSize: 12,
                  color: bodyColor,
                }}
              >
                <span>{charge.label || "Additional charge"}</span>
                <InvoiceMoney amount={charge.amount} currencyCode={currency} />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0 0",
                marginTop: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              <span>TOTAL</span>
              <InvoiceMoney amount={totals.total} currencyCode={currency} />
            </div>
          </div>
        </div>

        {/* Notes, payment, terms */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 28 }}>
          {notesText ? (
            <div>
              <p style={labelStyle}>Notes</p>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: bodyColor,
                  maxWidth: 520,
                  whiteSpace: "pre-wrap",
                }}
              >
                {notesText}
              </p>
            </div>
          ) : null}

          {hasInvoicePaymentInfo(invoice.payment, paymentOptions) ? (
            <div>
              <p style={labelStyle}>Payment Information</p>
              <div style={{ marginTop: 12, maxWidth: 520 }}>
                {paymentLines.map((line) => (
                  <p
                    key={line.label}
                    style={{
                      margin: "0 0 6px",
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: bodyColor,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#111827" }}>
                      {line.label}:{" "}
                    </span>
                    {line.value}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {termsText ? (
            <div>
              <p style={labelStyle}>Terms &amp; Conditions</p>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: bodyColor,
                  maxWidth: 520,
                  whiteSpace: "pre-wrap",
                }}
              >
                {termsText}
              </p>
            </div>
          ) : null}

          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: labelColor,
            }}
          >
            {closingLine}
          </p>
        </div>
      </div>

      <InvoiceCompanySignature
        company={invoice.company}
        maxHeight={d.signature.maxHeight}
        maxWidth={d.signature.maxWidth}
        align="right"
      />

      {/* Footer */}
      <p
        style={{
          margin: "48px 0 0",
          textAlign: "center",
          fontSize: 10,
          color: "#9ca3af",
          letterSpacing: "0.02em",
        }}
      >
        {invoice.company.companyName || "Your business"}. All Rights Reserved ©{" "}
        {footerYear}
        {invoice.company.companyEmail ? (
          <>
            {" "}
            · {invoice.company.companyEmail}
          </>
        ) : null}
      </p>

      {showPoweredBy ? (
        <InvoicePoweredBy onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});
