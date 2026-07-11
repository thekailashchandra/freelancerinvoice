"use client";

import { memo, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { calculateTotals } from "@/lib/calculations";
import {
  getInvoicePageSpec,
  resolveInvoicePageSize,
} from "@/lib/invoice-design";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import {
  getSimpleFooterTagline,
  getSimpleHeaderMessage,
  simpleTemplateColors as c,
} from "@/lib/invoice-simple-theme";
import { InvoiceMoney } from "@/components/invoice-money";
import { InvoiceSummaryTaxRows } from "@/components/invoice-summary-tax-rows";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
  invoicePaymentDisplayOptions,
} from "@/lib/invoice-payment-display";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";
import {
  InvoiceCompanyContactDetails,
  InvoiceCompanyLogo,
  InvoiceCompanySignature,
} from "@/components/invoice-company-branding";

type InvoicePreviewBoldProps = {
  invoice: Invoice;
  previewId?: string;
  showBranding?: boolean;
  onRemoveBranding?: () => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 11,
        fontWeight: 500,
        color: c.textMuted,
      }}
    >
      {children}
    </p>
  );
}

function FieldValue({
  children,
  bold,
}: {
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <p
      style={{
        margin: "6px 0 0",
        fontSize: 13,
        fontWeight: bold ? 700 : 500,
        color: c.text,
        lineHeight: 1.45,
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </p>
  );
}

export const InvoicePreviewBold = memo(function InvoicePreviewBold({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: InvoicePreviewBoldProps) {
  const d = useMemo(
    () => resolveTemplateDesign(invoice.templateId ?? "bold"),
    [invoice.templateId]
  );
  const showPoweredBy =
    showBranding ?? shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding);
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));

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
  const shipping = totals.shippingFee ?? 0;

  const headerMessage = getSimpleHeaderMessage(invoice);
  const footerTagline = getSimpleFooterTagline(invoice);
  const notesText = invoice.notes?.trim();
  const termsText =
    invoice.termsAndConditions?.trim() ||
    "Payment is due by the date shown on this invoice. Late payments may incur additional fees.";
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

  return (
    <div
      id={previewId}
      className="invoice-print-area font-sans"
      data-page-size={pageSpec.pdfFormat}
      data-template="bold"
      data-logo-height={String(invoice.company.logoHeight ?? 80)}
      style={{
        fontFamily: d.font,
        backgroundColor: c.bg,
        color: c.text,
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
            gap: 16,
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <InvoiceCompanyLogo company={invoice.company} variant="bold" />
          <InvoiceCompanyContactDetails
            company={invoice.company}
            lineStyle={{ color: c.textMuted }}
            nameStyle={{ color: c.text, fontSize: 15 }}
          />
        </div>

        {/* Top meta row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div>
            <FieldLabel>Invoice Number</FieldLabel>
            <FieldValue bold>#{invoice.invoice.invoiceNumber}</FieldValue>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: 320,
              textAlign: "right",
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.45,
              color: c.text,
            }}
          >
            {headerMessage}
          </p>
        </div>

        {/* Title + rule */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: c.text,
            }}
          >
            INVOICE
          </h1>
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{ flex: 1, height: 1, backgroundColor: c.line }}
            />
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              color={c.textMuted}
              aria-hidden
            />
          </div>
        </div>

        {/* Date row + Billed To */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 48px" }}>
            <div>
              <FieldLabel>Date</FieldLabel>
              <FieldValue>{formatDate(invoice.invoice.invoiceDate)}</FieldValue>
            </div>
            <div>
              <FieldLabel>Due Date</FieldLabel>
              <FieldValue>{formatDate(invoice.invoice.dueDate)}</FieldValue>
            </div>
            <div>
              <FieldLabel>Payment Terms</FieldLabel>
              <FieldValue>{paymentTerms}</FieldValue>
            </div>
            {invoice.invoice.purchaseOrder?.trim() ? (
              <div>
                <FieldLabel>P.O.#</FieldLabel>
                <FieldValue>{invoice.invoice.purchaseOrder.trim()}</FieldValue>
              </div>
            ) : null}
            {invoice.invoice.projectName?.trim() ? (
              <div>
                <FieldLabel>Project</FieldLabel>
                <FieldValue>{invoice.invoice.projectName.trim()}</FieldValue>
              </div>
            ) : null}
          </div>
          <div>
            <FieldLabel>Billed To</FieldLabel>
            <FieldValue bold>{invoice.client.name || "Client name"}</FieldValue>
            {invoice.client.company ? (
              <FieldValue>{invoice.client.company}</FieldValue>
            ) : null}
            {invoice.client.address ? (
              <FieldValue>{invoice.client.address}</FieldValue>
            ) : null}
            {invoice.client.email ? (
              <FieldValue>{invoice.client.email}</FieldValue>
            ) : null}
            {invoice.client.phone ? (
              <FieldValue>{invoice.client.phone}</FieldValue>
            ) : null}
            {invoice.client.gstin?.trim() ? (
              <FieldValue>GSTIN: {invoice.client.gstin.trim()}</FieldValue>
            ) : null}
          </div>
        </div>

        {/* Payment sidebar + line items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "32% 68%",
            gap: 0,
            borderTop: `1px solid ${c.line}`,
          }}
        >
          {/* Left column */}
          <div
            style={{
              padding: "24px 24px 24px 0",
              borderRight: `1px solid ${c.line}`,
            }}
          >
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 13,
                fontWeight: 800,
                color: c.text,
              }}
            >
              Payment Details:
            </p>
            {hasInvoicePaymentInfo(invoice.payment, paymentOptions) ? (
              <div style={{ fontSize: 12, lineHeight: 1.7, color: c.textMuted }}>
                {paymentLines.map((line) => (
                  <p key={line.label} style={{ margin: "0 0 8px" }}>
                    <span style={{ fontWeight: 600, color: c.text }}>
                      {line.label}:{" "}
                    </span>
                    {line.value}
                  </p>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 12, color: c.textMuted }}>
                Add payment details in the invoice form.
              </p>
            )}

            <div style={{ marginTop: 32 }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  fontWeight: 800,
                  color: c.text,
                }}
              >
                Terms &amp; Conditions
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  lineHeight: 1.65,
                  color: c.textMuted,
                  whiteSpace: "pre-wrap",
                }}
              >
                {termsText}
              </p>
            </div>

            {notesText ? (
              <div style={{ marginTop: 24 }}>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    fontWeight: 800,
                    color: c.text,
                  }}
                >
                  Notes
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    lineHeight: 1.65,
                    color: c.textMuted,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {notesText}
                </p>
              </div>
            ) : null}
          </div>

          {/* Right column — table */}
          <div style={{ padding: "24px 0 0 24px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col />
                <col style={{ width: 56 }} />
                <col style={{ width: 88 }} />
                <col style={{ width: 96 }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${c.line}` }}>
                  {["Product Name", "Qty", "Unit Price", "Sub Total"].map(
                    (col, i) => (
                      <th
                        key={col}
                        style={{
                          padding: "0 12px 12px",
                          fontSize: 12,
                          fontWeight: 800,
                          textAlign: i === 0 ? "left" : "right",
                          color: c.text,
                          borderLeft:
                            i > 0 ? `1px solid ${c.line}` : undefined,
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {invoice.services.map((item) => {
                  const lineAmount = item.quantity * item.price;
                  return (
                    <tr key={item.id}>
                      <td
                        style={{
                          padding: "14px 12px 14px 0",
                          fontSize: 13,
                          color: c.text,
                          verticalAlign: "top",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {item.name || "Service"}
                        </div>
                        {item.description ? (
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 11,
                              color: c.textMuted,
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
                          fontSize: 13,
                          color: c.text,
                          borderLeft: `1px solid ${c.line}`,
                          verticalAlign: "top",
                        }}
                      >
                        {formatInvoiceAmount(item.quantity)}
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          textAlign: "right",
                          fontSize: 13,
                          color: c.text,
                          borderLeft: `1px solid ${c.line}`,
                          verticalAlign: "top",
                        }}
                      >
                        <InvoiceMoney
                          amount={item.price}
                          currencyCode={currency}
                        />
                      </td>
                      <td
                        style={{
                          padding: "14px 12px",
                          textAlign: "right",
                          fontSize: 13,
                          fontWeight: 600,
                          color: c.text,
                          borderLeft: `1px solid ${c.line}`,
                          verticalAlign: "top",
                        }}
                      >
                        <InvoiceMoney
                          amount={lineAmount}
                          currencyCode={currency}
                        />
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
                borderTop: `1px solid ${c.line}`,
                paddingTop: 12,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ width: 240 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 12,
                    color: c.textMuted,
                  }}
                >
                  <span>Sub Total</span>
                  <InvoiceMoney
                    amount={totals.subtotal}
                    currencyCode={currency}
                  />
                </div>
                {totals.discountAmount > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      fontSize: 12,
                      color: c.textMuted,
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
                  <InvoiceSummaryTaxRows
                    totals={totals}
                    currency={currency}
                    taxOn={taxOn}
                    taxLabel={invoice.taxLabel}
                    taxAmt={taxAmt}
                    taxPct={taxPct}
                    rowStyle={{
                      padding: "6px 0",
                      fontSize: 12,
                      color: c.textMuted,
                    }}
                  />
                ) : null}
                {shipping > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      fontSize: 12,
                      color: c.textMuted,
                    }}
                  >
                    <span>Shipping</span>
                    <InvoiceMoney amount={shipping} currencyCode={currency} />
                  </div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0 0",
                    marginTop: 8,
                    borderTop: `1px solid ${c.line}`,
                    fontSize: 16,
                    fontWeight: 800,
                    color: c.text,
                  }}
                >
                  <span>Total</span>
                  <InvoiceMoney amount={totals.total} currencyCode={currency} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceCompanySignature
        company={invoice.company}
        maxHeight={d.signature.maxHeight}
        maxWidth={d.signature.maxWidth}
        align="right"
      />

      {/* Footer */}
      <div
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: `1px solid ${c.line}`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          fontSize: 11,
          lineHeight: 1.55,
          color: c.textMuted,
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: c.text }}>
            {invoice.company.companyName || "Your business"}
          </p>
          {invoice.company.companyAddress ? (
            <p style={{ margin: "6px 0 0", whiteSpace: "pre-line" }}>
              {invoice.company.companyAddress}
            </p>
          ) : null}
        </div>
        <div style={{ textAlign: "center" }}>
          {invoice.company.companyPhone ? (
            <p style={{ margin: 0 }}>{invoice.company.companyPhone}</p>
          ) : null}
          {invoice.company.companyEmail ? (
            <p style={{ margin: "4px 0 0" }}>{invoice.company.companyEmail}</p>
          ) : null}
          {invoice.company.gstin?.trim() ? (
            <p style={{ margin: "4px 0 0" }}>GSTIN: {invoice.company.gstin.trim()}</p>
          ) : null}
        </div>
        <div style={{ textAlign: "right", fontStyle: "italic" }}>
          {footerTagline}
        </div>
      </div>

      {showPoweredBy ? (
        <InvoicePoweredBy onRemoveBranding={onRemoveBranding} />
      ) : null}
    </div>
  );
});
