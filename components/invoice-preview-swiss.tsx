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

export const InvoicePreviewSwiss = memo(function InvoicePreviewSwiss({
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
      data-template="swiss"
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
        padding: "34px 38px 26px 56px",
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 30,
          top: 34,
          bottom: 26,
          width: 1,
          backgroundColor: "#111111",
        }}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            paddingBottom: 18,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 30,
                lineHeight: "34px",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Invoice #{invoice.invoice.invoiceNumber}
            </h1>
            <p style={{ margin: "7px 0 0", fontSize: 10, color: "#666666" }}>
              {formatDate(invoice.invoice.invoiceDate)} · Due{" "}
              {formatDate(invoice.invoice.dueDate)}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <div style={{ display: "flex", gap: 3 }} aria-hidden>
                <span style={{ width: 14, height: 14, backgroundColor: "#111111" }} />
                <span style={{ width: 14, height: 14, backgroundColor: "#111111" }} />
                <span style={{ width: 14, height: 14, backgroundColor: "#111111" }} />
              </div>
            )}
          </div>
        </header>

        <div
          style={{
            display: "flex",
            gap: 32,
            padding: "16px 0 18px",
            borderTop: "1px solid #111111",
            borderBottom: "1px solid #111111",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>Billing details</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>Payment details</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
              {company.companyName || "Your business"}
            </p>
            {company.companyEmail ? (
              <p style={mutedStyle}>{company.companyEmail}</p>
            ) : null}
            {company.companyPhone ? (
              <p style={mutedStyle}>{company.companyPhone}</p>
            ) : null}
            {data.paymentLines.slice(0, 2).map((line) => (
              <p key={line.label} style={mutedStyle}>
                {line.label}: {line.value}
              </p>
            ))}
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            marginTop: 20,
          }}
        >
          <colgroup>
            <col />
            <col style={{ width: 58 }} />
            <col style={{ width: 88 }} />
            <col style={{ width: 94 }} />
          </colgroup>
          <thead>
            <tr
              style={{
                backgroundColor: data.accent,
                color: data.accentText,
              }}
            >
              {["Item", "Qty", "Price", "Total"].map((col, index) => (
                <th
                  key={col}
                  style={{
                    padding: "9px 10px",
                    fontSize: 9,
                    fontWeight: 600,
                    textAlign: index === 0 ? "left" : "right",
                    letterSpacing: "0.02em",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((item) => (
              <tr key={item.id}>
                <td style={cellStyle}>
                  <div style={{ fontSize: 10, fontWeight: 500 }}>
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
                  {formatInvoiceAmount(item.quantity)}
                </td>
                <td style={{ ...cellStyle, textAlign: "right" }}>
                  <InvoiceMoney amount={item.price} currencyCode={data.currency} />
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
            gap: 24,
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid #111111",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>Notes</p>
            <p
              style={{
                margin: 0,
                fontSize: 9,
                lineHeight: "15px",
                color: "#666666",
                whiteSpace: "pre-wrap",
                maxWidth: 320,
              }}
            >
              {invoice.notes || "Thank you for your business."}
            </p>
          </div>
          <div style={{ width: 230, flexShrink: 0 }}>
            <SumRow
              label="Subtotal"
              amount={data.totals.subtotal}
              currency={data.currency}
            />
            {data.taxOn ? (
              <SumRow
                label={`Tax (${data.taxPct}%)`}
                amount={data.taxAmt}
                currency={data.currency}
              />
            ) : null}
            {data.totals.discountAmount > 0 ? (
              <SumRow
                label="Discount"
                amount={data.totals.discountAmount}
                currency={data.currency}
                negative
              />
            ) : null}
            {data.additionalCharges.map((charge) => (
              <SumRow
                key={charge.id}
                label={charge.label || "Additional charge"}
                amount={charge.amount}
                currency={data.currency}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 6,
                paddingTop: 7,
                borderTop: "2px solid #111111",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span>Total</span>
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
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            marginTop: 28,
          }}
        >
          <div>
            <p style={labelStyle}>Terms</p>
            <p
              style={{
                margin: 0,
                maxWidth: 330,
                fontSize: 9,
                lineHeight: "15px",
                color: "#666666",
                whiteSpace: "pre-wrap",
              }}
            >
              {invoice.termsAndConditions || data.paymentTerms}
            </p>
          </div>
          <InvoiceCompanySignature
            company={company}
            maxHeight={42}
            maxWidth={150}
            align="right"
          />
        </div>

        <footer
          style={{
            display: "flex",
            gap: 20,
            marginTop: 30,
            paddingTop: 16,
            borderTop: "1px solid #111111",
          }}
        >
          <div style={{ flex: "1.2", minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>
              {company.companyName || "Your business"}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 9, color: "#666666" }}>
              Invoices, without the busywork.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>Address</p>
            <p style={footerText}>{company.companyAddress || "Add address"}</p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={labelStyle}>Contact</p>
            <p style={footerText}>{company.companyPhone || "Add phone"}</p>
            <p style={footerText}>{company.companyEmail || "Add email"}</p>
          </div>
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
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#888888",
};

const mutedStyle: CSSProperties = {
  margin: "3px 0 0",
  fontSize: 9,
  lineHeight: "14px",
  color: "#666666",
};

const cellStyle: CSSProperties = {
  padding: "8px 10px",
  fontSize: 9,
  verticalAlign: "top",
  borderBottom: "1px solid #dedede",
  overflowWrap: "anywhere",
};

const footerText: CSSProperties = {
  margin: "0 0 2px",
  fontSize: 9,
  lineHeight: "14px",
  color: "#666666",
};

function SumRow({
  label,
  amount,
  currency,
  negative = false,
}: {
  label: string;
  amount: number;
  currency: string;
  negative?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "3px 0",
        fontSize: 9,
        color: "#666666",
      }}
    >
      <span>{label}</span>
      <span style={{ display: "inline-flex", gap: 2 }}>
        {negative ? <span>-</span> : null}
        <InvoiceMoney amount={amount} currencyCode={currency} />
      </span>
    </div>
  );
}
