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
  formatMinimalTableDate,
} from "@/lib/invoice-minimal-dates";
import { InvoiceMoney } from "@/components/invoice-money";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { formatInvoiceAmount } from "@/lib/utils";
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

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#888888",
};

const bodyMuted: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 12,
  lineHeight: 1.55,
  color: "#888888",
};

export const InvoicePreviewMinimal = memo(function InvoicePreviewMinimal({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: InvoicePreviewMinimalProps) {
  const d = useMemo(
    () => resolveTemplateDesign(invoice.templateId ?? "minimal"),
    [invoice.templateId]
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

  const notesText =
    invoice.notes?.trim() ||
    invoice.termsAndConditions?.trim() ||
    "Payment should be paid in full within the due date shown on this invoice.";

  const closingLine = invoice.company.companyName
    ? `Have a nice day and thank you! ${invoice.company.companyName.split(" ")[0]}`
    : "Have a nice day and thank you!";

  const tableDate = formatMinimalTableDate(invoice.invoice.invoiceDate);
  const footerYear = formatMinimalFooterYear(invoice.invoice.invoiceDate);

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
          </div>
        </div>

        {/* Line items — borderless table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: 108 }} />
            <col />
            <col style={{ width: 72 }} />
            <col style={{ width: 56 }} />
            <col style={{ width: 88 }} />
          </colgroup>
          <thead>
            <tr>
              {[
                "Invoice Date",
                "Task Description",
                "Rate",
                "Qty",
                "Amount",
              ].map((col, i) => (
                <th
                  key={col}
                  style={{
                    padding: "0 0 14px",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textAlign: i >= 2 ? "right" : "left",
                    color: "#888888",
                    borderBottom: "none",
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
              return (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: "12px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "#888888",
                      verticalAlign: "top",
                    }}
                  >
                    {index === 0 ? tableDate : ""}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px 12px 0",
                      fontSize: 13,
                      color: "#374151",
                      verticalAlign: "top",
                    }}
                  >
                    {item.name || "Service"}
                    {item.description ? (
                      <span style={{ color: "#888888" }}>
                        {" "}
                        — {item.description}
                      </span>
                    ) : null}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      color: "#374151",
                      verticalAlign: "top",
                    }}
                  >
                    <InvoiceMoney amount={item.price} currencyCode={currency} />
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      color: "#374151",
                      verticalAlign: "top",
                    }}
                  >
                    {formatInvoiceAmount(item.quantity)}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: 13,
                      color: "#111827",
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
                color: "#888888",
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
                  color: "#888888",
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
                  padding: "4px 0",
                  fontSize: 12,
                  color: "#888888",
                }}
              >
                <span>
                  {invoice.taxLabel || "Tax"} {taxPct.toFixed(2)}%
                </span>
                <InvoiceMoney amount={taxAmt} currencyCode={currency} />
              </div>
            ) : null}
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

        {/* Notes */}
        <div style={{ marginTop: 48 }}>
          <p style={labelStyle}>Notes</p>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 12,
              lineHeight: 1.7,
              color: "#888888",
              maxWidth: 480,
              whiteSpace: "pre-wrap",
            }}
          >
            {notesText}
          </p>
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 12,
              color: "#888888",
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
          color: "#aaaaaa",
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
