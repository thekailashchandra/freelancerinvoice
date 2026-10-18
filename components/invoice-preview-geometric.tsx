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

export const InvoicePreviewGeometric = memo(function InvoicePreviewGeometric({
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
      data-template="geometric"
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111111",
        padding: "30px 32px",
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
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: data.accent,
                  display: "block",
                }}
              />
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderTopRightRadius: 26,
                  backgroundColor: data.accent,
                  display: "block",
                  opacity: 0.45,
                }}
              />
            </div>
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt=""
                style={{
                  maxHeight: logo.height,
                  maxWidth: logo.maxWidth,
                  objectFit: "contain",
                }}
              />
            ) : (
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  {company.companyName || "Your business"}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 8,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#777777",
                  }}
                >
                  Independent studio
                </p>
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 8,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#777777",
            }}
          >
            Brand invoice
          </span>
        </header>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginTop: 22,
            paddingBottom: 16,
            borderBottom: `1px solid ${data.accent}55`,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 46,
                lineHeight: "48px",
                fontWeight: 800,
                letterSpacing: "0.16em",
              }}
            >
              INVOICE
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#777777",
              }}
            >
              {invoice.invoice.invoiceNumber}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 10,
              color: "#555555",
            }}
          >
            <span>{formatDate(invoice.invoice.invoiceDate)}</span>
            <span style={{ color: data.accent }}>|</span>
            <span>Due {formatDate(invoice.invoice.dueDate)}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 18,
            fontSize: 10,
            lineHeight: "17px",
          }}
        >
          <div style={{ flex: "1.1", minWidth: 0 }}>
            <p style={labelStyle}>BILLED TO</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {invoice.client.name || "Client name"}
            </p>
            {invoice.client.company ? (
              <p style={mutedStyle}>{invoice.client.company}</p>
            ) : null}
            {invoice.client.address ? (
              <p style={{ ...mutedStyle, whiteSpace: "pre-line" }}>
                {invoice.client.address}
              </p>
            ) : null}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              color: "#666666",
            }}
          >
            <MetaLine
              label="Client ID"
              value={
                invoice.clientId
                  ? invoice.clientId.slice(0, 10)
                  : invoice.invoice.invoiceNumber
              }
            />
            <MetaLine
              label="Date"
              value={formatDate(invoice.invoice.invoiceDate)}
            />
            <MetaLine
              label="Due date"
              value={formatDate(invoice.invoice.dueDate)}
            />
            <MetaLine label="Terms" value={data.paymentTerms} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 22,
          }}
        >
          <aside
            style={{
              width: 170,
              flexShrink: 0,
              backgroundColor: data.accentSoft,
              padding: "16px 14px",
              fontSize: 9,
              lineHeight: "16px",
              color: "#444444",
            }}
          >
            <p style={sideLabel}>ADDRESS</p>
            <p style={sideText}>{company.companyAddress || "Add address"}</p>
            <p style={{ ...sideLabel, marginTop: 12 }}>WEB</p>
            <p style={sideText}>{company.companyEmail || "hello@yourstudio.com"}</p>
            <p style={{ ...sideLabel, marginTop: 12 }}>PHONE</p>
            <p style={sideText}>{company.companyPhone || "Add phone"}</p>
            <p style={{ ...sideLabel, marginTop: 12 }}>ACCOUNT</p>
            <p style={sideText}>
              {data.paymentLines[0]?.value || "Add payment details"}
            </p>
            {data.paymentLines.slice(1).map((line) => (
              <p key={line.label} style={sideText}>
                {line.label}: {line.value}
              </p>
            ))}
            {company.gstin ? (
              <>
                <p style={{ ...sideLabel, marginTop: 12 }}>GSTIN</p>
                <p style={sideText}>{company.gstin}</p>
              </>
            ) : null}
          </aside>

          <div style={{ flex: 1, minWidth: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: 30 }} />
                <col />
                <col style={{ width: 60 }} />
                <col style={{ width: 58 }} />
                <col style={{ width: 78 }} />
              </colgroup>
              <thead>
                <tr
                  style={{
                    backgroundColor: data.accent,
                    color: data.accentText,
                  }}
                >
                  {["SL.", "ITEM DESCRIPTION", "RATE", "UNIT", "PRICE"].map(
                    (col, index) => (
                      <th
                        key={col}
                        style={{
                          padding: "9px 8px",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textAlign: index >= 2 ? "right" : "left",
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
                    <td style={{ ...cellStyle, color: "#888888" }}>
                      {index + 1}.
                    </td>
                    <td style={cellStyle}>
                      <div style={{ fontSize: 10, fontWeight: 600 }}>
                        {item.name || "Service"}
                      </div>
                      {item.description ? (
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 8,
                            lineHeight: "13px",
                            color: "#777777",
                          }}
                        >
                          {item.description}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ ...cellStyle, textAlign: "right" }}>
                      <InvoiceMoney
                        amount={item.price}
                        currencyCode={data.currency}
                      />
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
                gap: 16,
                marginTop: 14,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={labelStyle}>TERMS &amp; CONDITIONS</p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 8,
                    lineHeight: "14px",
                    color: "#666666",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {invoice.termsAndConditions ||
                    invoice.notes ||
                    "Payment is due by the date shown above."}
                </p>
              </div>
              <div style={{ width: 210, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "7px 10px",
                    backgroundColor: data.accentSoft,
                    fontSize: 9,
                  }}
                >
                  <span>Subtotal:</span>
                  <InvoiceMoney
                    amount={data.totals.subtotal}
                    currencyCode={data.currency}
                  />
                </div>
                {data.taxOn ? (
                  <div style={sumRowStyle}>
                    <span>Tax ({data.taxPct}%):</span>
                    <InvoiceMoney
                      amount={data.taxAmt}
                      currencyCode={data.currency}
                    />
                  </div>
                ) : null}
                {data.totals.discountAmount > 0 ? (
                  <div style={sumRowStyle}>
                    <span>Discount:</span>
                    <span style={{ display: "inline-flex", gap: 2 }}>
                      <span>-</span>
                      <InvoiceMoney
                        amount={data.totals.discountAmount}
                        currencyCode={data.currency}
                      />
                    </span>
                  </div>
                ) : null}
                {data.additionalCharges.map((charge) => (
                  <div key={charge.id} style={sumRowStyle}>
                    <span>{charge.label || "Additional charge"}:</span>
                    <InvoiceMoney
                      amount={charge.amount}
                      currencyCode={data.currency}
                    />
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginTop: 4,
                    padding: "8px 10px",
                    backgroundColor: data.accent,
                    color: data.accentText,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  <span>Total:</span>
                  <InvoiceMoney
                    amount={data.totals.total}
                    currencyCode={data.currency}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            marginTop: 26,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={labelStyle}>NOTES</p>
            <p
              style={{
                margin: 0,
                fontSize: 9,
                lineHeight: "15px",
                color: "#666666",
                whiteSpace: "pre-wrap",
              }}
            >
              {invoice.notes || "Thank you for your business."}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 150,
                borderTop: "1px solid #cfcfcf",
                paddingTop: 6,
                fontSize: 8,
                color: "#777777",
              }}
            >
              Company signature
            </div>
            <InvoiceCompanySignature
              company={company}
              maxHeight={40}
              maxWidth={140}
              align="center"
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 150,
                borderTop: "1px solid #cfcfcf",
                paddingTop: 6,
                fontSize: 8,
                color: "#777777",
              }}
            >
              Client signature
            </div>
          </div>
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 22,
            paddingTop: 10,
            borderTop: `2px solid ${data.accent}`,
            fontSize: 8,
            color: "#666666",
          }}
        >
          <span>{company.companyAddress}</span>
          <span>{company.companyPhone}</span>
          <span>{company.companyEmail}</span>
        </footer>
      </div>

      {showPoweredBy ? (
        <InvoicePoweredBy pinned onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});

const labelStyle: CSSProperties = {
  margin: "0 0 5px",
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#888888",
};

const mutedStyle: CSSProperties = {
  margin: "3px 0 0",
  fontSize: 9,
  lineHeight: "15px",
  color: "#777777",
};

const cellStyle: CSSProperties = {
  padding: "9px 8px",
  fontSize: 9,
  verticalAlign: "top",
  borderBottom: "1px solid #e2e2e2",
  overflowWrap: "anywhere",
};

const sumRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "4px 10px",
  fontSize: 9,
  color: "#666666",
};

const sideLabel: CSSProperties = {
  margin: "0 0 3px",
  fontSize: 7,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#777777",
};

const sideText: CSSProperties = {
  margin: "0 0 2px",
  fontSize: 9,
  lineHeight: "14px",
  overflowWrap: "anywhere",
};

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span>{label}</span>
      <span style={{ textAlign: "right", color: "#111111" }}>{value}</span>
    </div>
  );
}
