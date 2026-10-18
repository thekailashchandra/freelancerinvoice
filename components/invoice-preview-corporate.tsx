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

export const InvoicePreviewCorporate = memo(function InvoicePreviewCorporate({
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
      data-template="corporate"
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111111",
        padding: `${spec.paddingPx}px`,
        width: `${spec.widthPx}px`,
        maxWidth: `${spec.widthPx}px`,
        minHeight: `${spec.heightPx}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt=""
                style={{
                  height: logo.height,
                  maxWidth: logo.maxWidth,
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: logo.initialSize,
                  height: logo.initialSize,
                  backgroundColor: "#111111",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {(company.companyName || "Y").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {company.companyName || "Your business"}
              </p>
              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#777777",
                }}
              >
                Invoice for freelance
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: "38px",
                fontWeight: 800,
                letterSpacing: "0.02em",
              }}
            >
              INVOICE
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#555555" }}>
              DATE: {formatDate(invoice.invoice.invoiceDate)}
            </p>
          </div>
        </header>

        <section
          style={{
            display: "flex",
            gap: 36,
            marginTop: 30,
            backgroundColor: "#f4f4f4",
            padding: "22px 24px",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>INVOICE TO</p>
            <p style={strongStyle}>{invoice.client.name || "Client name"}</p>
            {invoice.client.company ? (
              <p style={mutedStyle}>{invoice.client.company}</p>
            ) : null}
            {invoice.client.address ? (
              <p style={mutedStyle}>{invoice.client.address}</p>
            ) : null}
            {invoice.client.phone ? (
              <p style={mutedStyle}>{invoice.client.phone}</p>
            ) : null}
            {invoice.client.email ? (
              <p style={mutedStyle}>{invoice.client.email}</p>
            ) : null}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>SHIP TO</p>
            <p style={strongStyle}>
              {invoice.client.company || invoice.client.name || "Client name"}
            </p>
            {invoice.client.address ? (
              <p style={mutedStyle}>{invoice.client.address}</p>
            ) : null}
            {invoice.client.gstin ? (
              <p style={mutedStyle}>GSTIN: {invoice.client.gstin}</p>
            ) : null}
            <p style={mutedStyle}>
              Terms: {data.paymentTerms}
            </p>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 22,
            paddingBottom: 10,
            fontSize: 12,
            color: "#555555",
          }}
        >
          <span>DATE: {formatDate(invoice.invoice.invoiceDate)}</span>
          <span>INVOICE NO: {invoice.invoice.invoiceNumber}</span>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            borderTop: `2px solid ${data.accent}`,
          }}
        >
          <colgroup>
            <col style={{ width: 34 }} />
            <col />
            <col style={{ width: 84 }} />
            <col style={{ width: 60 }} />
            <col style={{ width: 92 }} />
          </colgroup>
          <thead>
            <tr>
              {["NO", "ITEM DESCRIPTION", "PRICE", "QUANTITY", "TOTAL"].map(
                (col, index) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textAlign: index >= 2 ? "right" : "left",
                      color: "#333333",
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((item, index) => (
              <tr key={item.id}>
                <td style={{ ...cellStyle, color: "#777777" }}>{index + 1}.</td>
                <td style={cellStyle}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {item.name || "Service"}
                  </div>
                  {item.description ? (
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 11,
                        lineHeight: "16px",
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
                <td
                  style={{
                    ...cellStyle,
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
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
            alignItems: "flex-start",
            gap: 32,
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1px solid #d8d8d8",
          }}
        >
          <div
            style={{
              minWidth: 220,
              borderLeft: `4px solid ${data.accent}`,
              backgroundColor: data.accentSoft,
              padding: "14px 16px",
            }}
          >
            <p style={labelStyle}>TOTAL DUE</p>
            <p style={{ margin: "4px 0 0", fontSize: 30, fontWeight: 700 }}>
              <InvoiceMoney
                amount={data.totals.total}
                currencyCode={data.currency}
              />
            </p>
          </div>
          <div style={{ width: 260 }}>
            <TotalRow
              label="SUBTOTAL:"
              amount={data.totals.subtotal}
              currency={data.currency}
            />
            {data.taxOn ? (
              <TotalRow
                label="TAX:"
                amount={data.taxAmt}
                currency={data.currency}
              />
            ) : (
              <TotalRow label="TAX:" value="0" />
            )}
            {data.totals.discountAmount > 0 ? (
              <TotalRow
                label="DISCOUNT:"
                amount={data.totals.discountAmount}
                currency={data.currency}
                negative
              />
            ) : null}
            {data.additionalCharges.map((charge) => (
              <TotalRow
                key={charge.id}
                label={`${(charge.label || "Additional charge").toUpperCase()}:`}
                amount={charge.amount}
                currency={data.currency}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                padding: "8px 0 0",
                marginTop: 4,
                borderTop: `2px solid ${data.accent}`,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>GRAND TOTAL:</span>
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
            gap: 24,
            marginTop: 32,
            paddingTop: 18,
            borderTop: "1px solid #e2e2e2",
          }}
        >
          <div style={{ flex: "1.2", minWidth: 0 }}>
            <p style={labelStyle}>PAYMENT INFO</p>
            {data.paymentLines.map((line) => (
              <p key={line.label} style={mutedStyle}>
                <strong style={{ color: "#333333" }}>{line.label}:</strong>{" "}
                {line.value}
              </p>
            ))}
            {data.paymentLines.length === 0 ? (
              <p style={mutedStyle}>Add payment details in Settings.</p>
            ) : null}
          </div>
          <div style={{ flex: "1", minWidth: 0 }}>
            <p style={labelStyle}>TERMS &amp; CONDITIONS</p>
            <p style={{ ...mutedStyle, whiteSpace: "pre-wrap" }}>
              {invoice.termsAndConditions ||
                invoice.notes ||
                "Payment is due by the date shown above."}
            </p>
          </div>
          <div style={{ flex: "0.9", minWidth: 0, textAlign: "right" }}>
            <p style={labelStyle}>ACCOUNT MANAGER</p>
            <InvoiceCompanySignature
              company={company}
              maxHeight={46}
              maxWidth={160}
              align="right"
            />
          </div>
        </div>

        <footer
          style={{
            marginTop: 28,
            paddingTop: 12,
            borderTop: "1px solid #e4e4e4",
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
            fontSize: 9,
            color: "#777777",
          }}
        >
          <span>
            {[company.companyAddress, company.companyPhone, company.companyEmail]
              .filter(Boolean)
              .join("  ·  ")}
          </span>
          <span>{invoice.invoice.projectName || ""}</span>
        </footer>
      </div>

      {data.upiLink ? (
        <p style={{ margin: "14px 0 0", fontSize: 9, color: "#777777" }}>
          Scan the QR code in the payment section to pay via UPI.
        </p>
      ) : null}

      {showPoweredBy ? (
        <InvoicePoweredBy pinned onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});

const labelStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#777777",
};

const strongStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  color: "#111111",
};

const mutedStyle: CSSProperties = {
  margin: "4px 0 0",
  fontSize: 11,
  lineHeight: "17px",
  color: "#666666",
};

const cellStyle: CSSProperties = {
  padding: "12px 8px",
  fontSize: 12,
  verticalAlign: "top",
  borderBottom: "1px solid #e2e2e2",
  overflowWrap: "anywhere",
};

function TotalRow({
  label,
  amount,
  value,
  currency,
  negative = false,
}: {
  label: string;
  amount?: number;
  value?: string;
  currency?: string;
  negative?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "4px 0",
        fontSize: 11,
        color: "#444444",
      }}
    >
      <span>{label}</span>
      {typeof amount === "number" ? (
        <span style={{ display: "inline-flex", gap: 2 }}>
          {negative ? <span>-</span> : null}
          <InvoiceMoney amount={amount} currencyCode={currency ?? "USD"} />
        </span>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
