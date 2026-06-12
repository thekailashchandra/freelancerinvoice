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
  formatModernHeaderDate,
  formatModernMetaDate,
  modernTotalDuePattern,
} from "@/lib/invoice-modern-dates";
import { InvoiceMoney } from "@/components/invoice-money";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
} from "@/lib/invoice-payment-display";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { formatInvoiceAmount } from "@/lib/utils";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";

type InvoicePreviewModernProps = {
  invoice: Invoice;
  previewId?: string;
  showBranding?: boolean;
  onRemoveBranding?: () => void;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#111827",
      }}
    >
      {children}
    </p>
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
  const paymentLines = useMemo(
    () => getInvoicePaymentInfo(invoice.payment),
    [invoice.payment]
  );
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;

  const clientAddress = invoice.client.address?.trim();
  const clientPhone = invoice.client.phone?.trim();
  const companyTagline =
    invoice.company.companyEmail?.trim() ||
    invoice.company.companyPhone?.trim() ||
    "";

  return (
    <div
      id={previewId}
      className="invoice-print-area font-sans"
      data-page-size={pageSpec.pdfFormat}
      data-template="modern"
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: d.font,
        backgroundColor: "#ffffff",
        color: "#111827",
        padding: `${pageSpec.paddingPx}px`,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {invoice.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.company.logo}
                alt=""
                style={{
                  display: "block",
                  width: logo.height,
                  height: logo.height,
                  objectFit: "contain",
                  backgroundColor: "#111827",
                }}
              />
            ) : (
              <div
                style={{
                  width: logo.height,
                  height: logo.height,
                  backgroundColor: "#111827",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: Math.round(logo.height * 0.38),
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {(invoice.company.companyName || "Y").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                }}
              >
                {invoice.company.companyName || "Your business"}
              </p>
              {companyTagline ? (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 11,
                    color: "#6b7280",
                    lineHeight: 1.4,
                  }}
                >
                  {companyTagline}
                </p>
              ) : null}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <h1
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              INVOICE
            </h1>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#374151",
              }}
            >
              {formatModernHeaderDate(invoice.invoice.invoiceDate)}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f2f2f2",
            padding: "22px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 20,
          }}
        >
          <div>
            <SectionLabel>Invoice To</SectionLabel>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
              {invoice.client.name || "Client name"}
            </p>
            {invoice.client.company ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#374151" }}>
                {invoice.client.company}
              </p>
            ) : null}
            {clientAddress ? (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {clientAddress}
              </p>
            ) : null}
            {clientPhone ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7280" }}>
                {clientPhone}
              </p>
            ) : null}
          </div>
          <div>
            <SectionLabel>Ship To</SectionLabel>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#374151" }}>
              {invoice.client.company ? "Office Address" : "Billing Address"}
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                color: "#6b7280",
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}
            >
              {clientAddress || invoice.client.email || "—"}
            </p>
            {clientPhone ? (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7280" }}>
                {clientPhone}
              </p>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>Date: {formatModernMetaDate(invoice.invoice.invoiceDate)}</span>
          <span>Invoice No: {invoice.invoice.invoiceNumber}</span>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: 40 }} />
            <col />
            <col style={{ width: 88 }} />
            <col style={{ width: 72 }} />
            <col style={{ width: 96 }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: "2px solid #111827" }}>
              {["No", "Item Description", "Price", "Quantity", "Total"].map(
                (col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      textAlign: i >= 2 ? "right" : "left",
                      color: "#111827",
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((item, index) => {
              const lineAmount = item.quantity * item.price;
              return (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: "16px 8px 14px",
                      fontSize: 12,
                      color: "#374151",
                      borderBottom:
                        index < invoice.services.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                      verticalAlign: "top",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td
                    style={{
                      padding: "16px 8px 14px",
                      borderBottom:
                        index < invoice.services.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                      verticalAlign: "top",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {item.name || "Service"}
                    </div>
                    {item.description ? (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          lineHeight: 1.5,
                          color: "#6b7280",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {item.description}
                      </div>
                    ) : null}
                  </td>
                  <td
                    style={{
                      padding: "16px 8px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      color: "#374151",
                      borderBottom:
                        index < invoice.services.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                      verticalAlign: "top",
                    }}
                  >
                    <InvoiceMoney amount={item.price} currencyCode={currency} />
                  </td>
                  <td
                    style={{
                      padding: "16px 8px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      color: "#374151",
                      borderBottom:
                        index < invoice.services.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                      verticalAlign: "top",
                    }}
                  >
                    {formatInvoiceAmount(item.quantity)}
                  </td>
                  <td
                    style={{
                      padding: "16px 8px 14px",
                      textAlign: "right",
                      fontSize: 12,
                      fontWeight: 700,
                      borderBottom:
                        index < invoice.services.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
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

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 32,
          }}
        >
          <div style={{ flex: 1, maxWidth: 320 }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Total Due
            </p>
            <div
              style={{
                padding: "20px 24px",
                background: modernTotalDuePattern,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>
                <InvoiceMoney amount={totals.total} currencyCode={currency} />
              </div>
            </div>
          </div>

          <div style={{ width: 240, alignSelf: "flex-end" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#374151",
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
                  padding: "6px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#047857",
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
                  padding: "6px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#374151",
                }}
              >
                <span>Tax</span>
                <InvoiceMoney amount={taxAmt} currencyCode={currency} />
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0 0",
                marginTop: 6,
                borderTop: "2px solid #111827",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <span>Grand Total</span>
              <InvoiceMoney amount={totals.total} currencyCode={currency} />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
          }}
        >
          {hasInvoicePaymentInfo(invoice.payment) ? (
            <div>
              <SectionLabel>Payment Info</SectionLabel>
              {paymentLines.map((line) => (
                <p
                  key={line.label}
                  style={{
                    margin: "0 0 6px",
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: "#374151",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{line.label}: </span>
                  {line.value}
                </p>
              ))}
            </div>
          ) : (
            <div />
          )}

          <div>
            <SectionLabel>Terms &amp; Condition</SectionLabel>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                lineHeight: 1.6,
                color: "#6b7280",
                whiteSpace: "pre-wrap",
              }}
            >
              {invoice.termsAndConditions?.trim() ||
                invoice.notes?.trim() ||
                "Payment is due by the date shown above. Thank you for your business."}
            </p>
          </div>

          <div>
            <SectionLabel>Account Manager</SectionLabel>
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
                  marginBottom: 8,
                }}
              />
            ) : (
              <p
                style={{
                  margin: "0 0 8px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 28,
                  fontStyle: "italic",
                  color: "#111827",
                }}
              >
                {invoice.company.companyName?.split(" ")[0] || "Manager"}
              </p>
            )}
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {invoice.company.companyName || "Your business"}
            </p>
          </div>
        </div>

        {(invoice.company.companyEmail || invoice.company.companyPhone) && (
          <div style={{ marginTop: 28 }}>
            <SectionLabel>Questions?</SectionLabel>
            <p style={{ margin: 0, fontSize: 11, color: "#374151" }}>
              {invoice.company.companyEmail ? (
                <>
                  Email:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {invoice.company.companyEmail}
                  </span>
                </>
              ) : null}
              {invoice.company.companyEmail && invoice.company.companyPhone
                ? " · "
                : null}
              {invoice.company.companyPhone ? (
                <>
                  Phone:{" "}
                  <span style={{ fontWeight: 600 }}>
                    {invoice.company.companyPhone}
                  </span>
                </>
              ) : null}
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            fontSize: 10,
            color: "#6b7280",
          }}
        >
          <div>
            {invoice.company.companyAddress ? (
              <span>{invoice.company.companyAddress}</span>
            ) : null}
            {invoice.company.companyEmail ? (
              <span>
                {invoice.company.companyAddress ? " · " : ""}
                {invoice.company.companyEmail}
              </span>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 12, fontWeight: 600 }}>
            {invoice.company.companyPhone ? <span>☎</span> : null}
            {invoice.company.companyEmail ? <span>✉</span> : null}
          </div>
        </div>
      </div>

      {showPoweredBy ? (
        <InvoicePoweredBy onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});
