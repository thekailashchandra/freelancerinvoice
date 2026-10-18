"use client";

import { memo, type CSSProperties } from "react";
import type { Invoice } from "@/types/invoice";
import {
  getInvoicePageSpec,
  getLogoDimensions,
  resolveInvoicePageSize,
  resolveLogoHeight,
} from "@/lib/invoice-design";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import { InvoiceMoney } from "@/components/invoice-money";
import { InvoiceCompanySignature } from "@/components/invoice-company-branding";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { getSignatureInvoiceData } from "@/lib/invoice-signature-data";

type Props = {
  invoice: Invoice;
  previewId?: string;
  showBranding?: boolean;
  onRemoveBranding?: () => void;
};

export const InvoicePreviewStudio = memo(function InvoicePreviewStudio({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: Props) {
  const spec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const logo = getLogoDimensions(resolveLogoHeight(invoice.company.logoHeight));
  const data = getSignatureInvoiceData(invoice);
  const showPoweredBy =
    showBranding ??
    shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding);
  const company = invoice.company;

  return (
    <div
      id={previewId}
      className="invoice-print-area"
      data-page-size={spec.pdfFormat}
      data-template="studio"
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111111",
        width: `${spec.widthPx}px`,
        maxWidth: `${spec.widthPx}px`,
        minHeight: `${spec.heightPx}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        <aside
          style={{
            width: 188,
            flexShrink: 0,
            backgroundColor: data.accent,
            color: data.accentText,
            padding: "36px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div>
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt=""
                style={{
                  maxHeight: 64,
                  maxWidth: 130,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  border: `1px solid ${data.accentText}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {(company.companyName || "Y").charAt(0).toUpperCase()}
              </div>
            )}
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: "19px",
              }}
            >
              {company.companyName || "Your business"}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 9,
                opacity: 0.72,
                letterSpacing: "0.06em",
              }}
            >
              Invoice for freelance
            </p>
          </div>

          <div style={{ fontSize: 9, lineHeight: "18px", opacity: 0.86 }}>
            <p style={sideLabel}>CONTACT</p>
            {company.companyPhone ? <p style={sideText}>{company.companyPhone}</p> : null}
            {company.companyEmail ? <p style={sideText}>{company.companyEmail}</p> : null}
            {company.companyAddress ? (
              <p style={{ ...sideText, whiteSpace: "pre-line" }}>
                {company.companyAddress}
              </p>
            ) : null}
            {company.gstin ? (
              <p style={sideText}>GSTIN: {company.gstin}</p>
            ) : null}
          </div>

          <div style={{ fontSize: 9, lineHeight: "18px", opacity: 0.86 }}>
            <p style={sideLabel}>PAYMENT</p>
            {data.paymentLines.map((line) => (
              <p key={line.label} style={sideText}>
                {line.label}: {line.value}
              </p>
            ))}
            {data.paymentLines.length === 0 ? (
              <p style={sideText}>Add payment details in Settings.</p>
            ) : null}
          </div>

          <div style={{ marginTop: "auto", fontSize: 9, opacity: 0.72 }}>
            {invoice.invoice.projectName || "Professional invoice"}
          </div>
        </aside>

        <div style={{ flex: 1, padding: "34px 36px 28px 34px", minWidth: 0 }}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            <div>
              <p style={labelStyle}>INVOICE TO</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                {invoice.client.name || "Client name"}
              </p>
              {invoice.client.company ? (
                <p style={mutedStyle}>{invoice.client.company}</p>
              ) : null}
            </div>
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 33,
                  lineHeight: "36px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                }}
              >
                INVOICE
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: 10, color: "#777777" }}>
                #{invoice.invoice.invoiceNumber}
              </p>
            </div>
          </header>

          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <div style={{ flex: 1, fontSize: 10, lineHeight: "17px", color: "#666666" }}>
              <p style={labelStyle}>CLIENT</p>
              {data.clientLines.map((line) => (
                <p key={line} style={{ margin: "3px 0" }}>
                  {line}
                </p>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                fontSize: 10,
                lineHeight: "17px",
                color: "#666666",
              }}
            >
              <MetaLine
                label="Invoice date"
                value={formatDate(invoice.invoice.invoiceDate)}
              />
              <MetaLine
                label="Due date"
                value={formatDate(invoice.invoice.dueDate)}
              />
              <MetaLine label="Terms" value={data.paymentTerms} />
              {invoice.invoice.purchaseOrder ? (
                <MetaLine
                  label="PO number"
                  value={invoice.invoice.purchaseOrder}
                />
              ) : null}
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              marginTop: 26,
            }}
          >
            <colgroup>
              <col style={{ width: 34 }} />
              <col />
              <col style={{ width: 78 }} />
              <col style={{ width: 54 }} />
              <col style={{ width: 86 }} />
            </colgroup>
            <thead>
              <tr style={{ backgroundColor: data.accent, color: data.accentText }}>
                {["#", "DESCRIPTION", "PRICE", "QTY", "AMOUNT"].map((col, index) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 9px",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textAlign: index >= 2 ? "right" : "left",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.services.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 1 ? "#f6f6f6" : "#ffffff",
                  }}
                >
                  <td style={{ ...cellStyle, color: "#888888" }}>
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>
                      {item.name || "Service"}
                    </div>
                    {item.description ? (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 9,
                          lineHeight: "14px",
                          color: "#777777",
                        }}
                      >
                        {item.description}
                      </div>
                    ) : null}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "right" }}>
                    <InvoiceMoney amount={item.price} currencyCode={data.currency} />
                  </td>
                  <td style={{ ...cellStyle, textAlign: "right" }}>
                    {formatInvoiceAmount(item.quantity)}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "right", fontWeight: 600 }}>
                    <InvoiceMoney
                      amount={item.quantity * item.price}
                      currencyCode={data.currency}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 28,
              marginTop: 20,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>TERMS &amp; CONDITIONS</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 9,
                  lineHeight: "15px",
                  color: "#666666",
                  whiteSpace: "pre-wrap",
                }}
              >
                {invoice.termsAndConditions ||
                  invoice.notes ||
                  "Payment is due by the date shown above."}
              </p>
            </div>
            <div style={{ width: 240 }}>
              <p style={{ ...totalRowStyle, color: "#555555" }}>
                <span>Subtotal</span>
                <InvoiceMoney
                  amount={data.totals.subtotal}
                  currencyCode={data.currency}
                />
              </p>
              {data.taxOn ? (
                <p style={{ ...totalRowStyle, color: "#555555" }}>
                  <span>Tax ({data.taxPct}%)</span>
                  <InvoiceMoney amount={data.taxAmt} currencyCode={data.currency} />
                </p>
              ) : null}
              {data.totals.discountAmount > 0 ? (
                <p style={{ ...totalRowStyle, color: "#555555" }}>
                  <span>Discount</span>
                  <span style={{ display: "inline-flex", gap: 2 }}>
                    <span>-</span>
                    <InvoiceMoney
                      amount={data.totals.discountAmount}
                      currencyCode={data.currency}
                    />
                  </span>
                </p>
              ) : null}
              {data.additionalCharges.map((charge) => (
                <p
                  key={charge.id}
                  style={{ ...totalRowStyle, color: "#555555" }}
                >
                  <span>{charge.label || "Additional charge"}</span>
                  <InvoiceMoney
                    amount={charge.amount}
                    currencyCode={data.currency}
                  />
                </p>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 6,
                  padding: "10px 12px",
                  backgroundColor: data.accent,
                  color: data.accentText,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <span>TOTAL</span>
                <InvoiceMoney
                  amount={data.totals.total}
                  currencyCode={data.currency}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 26,
            }}
          >
            <InvoiceCompanySignature
              company={company}
              maxHeight={46}
              maxWidth={150}
              align="right"
            />
          </div>

          <footer
            style={{
              marginTop: 22,
              paddingTop: 10,
              borderTop: "1px solid #e2e2e2",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              fontSize: 8,
              color: "#777777",
            }}
          >
            <span>
              {[company.companyPhone, company.companyEmail]
                .filter(Boolean)
                .join("  ·  ")}
            </span>
            <span>{company.companyAddress}</span>
          </footer>
        </div>
      </div>

      {showPoweredBy ? (
        <InvoicePoweredBy pinned onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});

const labelStyle: CSSProperties = {
  margin: "0 0 6px",
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#888888",
};

const mutedStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 10,
  lineHeight: "16px",
  color: "#777777",
};

const cellStyle: CSSProperties = {
  padding: "10px 9px",
  fontSize: 10,
  verticalAlign: "top",
  borderBottom: "1px solid #e0e0e0",
  overflowWrap: "anywhere",
};

const totalRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  margin: 0,
  padding: "5px 0",
  fontSize: 10,
};

const sideLabel: CSSProperties = {
  margin: "0 0 4px",
  fontSize: 7,
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  opacity: 0.6,
};

const sideText: CSSProperties = {
  margin: "2px 0",
  fontSize: 9,
  lineHeight: "14px",
};

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span>{label}</span>
      <span style={{ color: "#111111", textAlign: "right" }}>{value}</span>
    </div>
  );
}
