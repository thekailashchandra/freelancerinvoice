"use client";

import { memo, useMemo } from "react";
import type { Invoice } from "@/types/invoice";
import { calculateTotals } from "@/lib/calculations";
import {
  getInvoicePageSpec,
  getLogoDimensions,
  invoiceDesign,
  resolveInvoicePageSize,
  resolveLogoHeight,
} from "@/lib/invoice-design";
import { InvoiceMoney } from "@/components/invoice-money";
import { UpiQrCode } from "@/components/upi-qr-code";
import {
  getInvoicePaymentInfo,
  hasInvoicePaymentInfo,
} from "@/lib/invoice-payment-display";
import { buildInvoiceUpiLink } from "@/lib/upi";
import { shouldShowInvoiceBranding } from "@/lib/invoice-branding";
import { formatDate, formatInvoiceAmount } from "@/lib/utils";
import { InvoicePoweredBy } from "@/components/invoice-powered-by";

const d = invoiceDesign;

interface InvoicePreviewProps {
  invoice: Invoice;
  previewId?: string;
  /** Override profile branding preference (e.g. always show on marketing demos) */
  showBranding?: boolean;
  /** Screen-only: prompt to remove branding via Ko-fi tip */
  onRemoveBranding?: () => void;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "5px 0",
        fontSize: 13,
        lineHeight: "20px",
      }}
    >
      <span style={{ color: d.colors.textMuted, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        style={{
          color: d.colors.text,
          fontWeight: 500,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export const InvoicePreview = memo(function InvoicePreview({
  invoice,
  previewId = "invoice-preview",
  showBranding,
  onRemoveBranding,
}: InvoicePreviewProps) {
  const showPoweredBy =
    showBranding ??
    shouldShowInvoiceBranding(invoice.company.hideInvoiceBranding);
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
  const upiLink = useMemo(
    () => buildInvoiceUpiLink(invoice, totals.total),
    [invoice, totals.total]
  );
  const taxOn =
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false;
  const taxPct =
    invoice.taxDiscount.taxPercentage ??
    invoice.taxDiscount.gstPercentage ??
    0;
  const taxAmt = totals.taxAmount ?? totals.gstAmount ?? 0;
  const shipping = totals.shippingFee ?? 0;
  const paymentTerms =
    invoice.invoice.paymentTerms?.trim() || "Due on receipt";

  const clientLines = useMemo(
    () =>
      [
        invoice.client.address,
        invoice.client.email,
        invoice.client.phone,
      ].filter(Boolean) as string[],
    [invoice.client.address, invoice.client.email, invoice.client.phone]
  );

  const tableCols = ["#", "Item & Description", "Qty", "Rate", "Tax", "Amount"];
  const pageSpec = getInvoicePageSpec(resolveInvoicePageSize(invoice.pageSize));
  const logo = getLogoDimensions(resolveLogoHeight(invoice.company.logoHeight));

  return (
    <div
      id={previewId}
      className="invoice-print-area font-sans"
      data-page-size={pageSpec.pdfFormat}
      data-logo-height={String(logo.height)}
      style={{
        fontFamily: d.font,
        backgroundColor: d.colors.bg,
        color: d.colors.text,
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
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
      {/* Header: company left, invoice meta right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 32,
          marginBottom: 36,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            {invoice.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.company.logo}
                alt=""
                style={{
                  display: "block",
                  height: logo.height,
                  maxWidth: logo.maxWidth,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: logo.initialSize,
                  height: logo.initialSize,
                  borderRadius: "50%",
                  backgroundColor: d.colors.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
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
                  fontSize: d.type.companyName.size,
                  fontWeight: 700,
                  lineHeight: `${d.type.companyName.lineHeight}px`,
                  color: d.colors.text,
                }}
              >
                {invoice.company.companyName || "Your business"}
              </p>
              {invoice.company.companyAddress && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: d.type.bodySm.size,
                    lineHeight: `${d.type.bodySm.lineHeight}px`,
                    color: d.colors.textMuted,
                    whiteSpace: "pre-line",
                  }}
                >
                  {invoice.company.companyAddress}
                </p>
              )}
              {invoice.company.gstin?.trim() && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 12,
                    color: d.colors.textSecondary,
                  }}
                >
                  GSTIN: {invoice.company.gstin.trim()}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: d.type.sectionLabel.size,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: d.colors.textMuted,
              }}
            >
              Bill To
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: d.colors.text,
              }}
            >
              {invoice.client.name || "Client name"}
            </p>
            {invoice.client.company && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: d.colors.textSecondary,
                }}
              >
                {invoice.client.company}
              </p>
            )}
            {clientLines.map((line) => (
              <p
                key={line}
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: d.colors.textMuted,
                  whiteSpace: "pre-line",
                }}
              >
                {line}
              </p>
            ))}
            {invoice.client.gstin?.trim() && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 12,
                  color: d.colors.textSecondary,
                }}
              >
                GSTIN: {invoice.client.gstin.trim()}
              </p>
            )}
          </div>
        </div>

        <div style={{ width: 280, flexShrink: 0, textAlign: "right" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "0.12em",
              lineHeight: "36px",
              color: d.colors.text,
            }}
          >
            INVOICE
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              color: d.colors.textSecondary,
            }}
          >
            Invoice# {invoice.invoice.invoiceNumber}
          </p>
          <div
            style={{
              margin: "8px 0 0",
              fontSize: 28,
              fontWeight: 700,
              color: d.colors.text,
              lineHeight: "32px",
              justifyContent: "flex-end",
            }}
          >
            <InvoiceMoney amount={totals.total} currencyCode={currency} />
          </div>
          <div style={{ marginTop: 20, textAlign: "left" }}>
            <MetaRow
              label="Invoice Date"
              value={formatDate(invoice.invoice.invoiceDate)}
            />
            <MetaRow label="Terms" value={paymentTerms} />
            <MetaRow
              label="Due Date"
              value={formatDate(invoice.invoice.dueDate)}
            />
            <MetaRow
              label="P.O.#"
              value={invoice.invoice.purchaseOrder ?? ""}
            />
            <MetaRow
              label="Project Name"
              value={invoice.invoice.projectName ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: 36 }} />
          <col />
          <col style={{ width: 64 }} />
          <col style={{ width: 88 }} />
          <col style={{ width: 56 }} />
          <col style={{ width: 96 }} />
        </colgroup>
        <thead>
          <tr
            className="invoice-table-header"
            style={{ backgroundColor: d.colors.tableHeader }}
          >
            {tableCols.map((col, i) => (
              <th
                key={col}
                style={{
                  padding: "11px 12px",
                  fontSize: d.type.tableHead.size,
                  fontWeight: 600,
                  color: d.colors.tableHeaderText,
                  textAlign: i >= 2 ? "right" : "left",
                  width:
                    i === 0
                      ? 36
                      : i === 1
                        ? undefined
                        : i === 2
                          ? 64
                          : i === 3
                            ? 88
                            : i === 4
                              ? 56
                              : 96,
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
                    padding: "14px 12px",
                    fontSize: 13,
                    color: d.colors.textSecondary,
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
                        : "none",
                    verticalAlign: "top",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: "14px 12px",
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
                        : "none",
                    verticalAlign: "top",
                    minWidth: 0,
                    overflow: "hidden",
                    ...d.wrapText,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: d.colors.text,
                      ...d.wrapText,
                    }}
                  >
                    {item.name || "Service"}
                  </div>
                  {item.description && (
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        lineHeight: "18px",
                        color: d.colors.textMuted,
                        whiteSpace: "pre-wrap",
                        ...d.wrapText,
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                </td>
                <td
                  style={{
                    padding: "14px 12px",
                    textAlign: "right",
                    fontSize: 13,
                    color: d.colors.textSecondary,
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
                        : "none",
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
                    color: d.colors.textSecondary,
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
                        : "none",
                    verticalAlign: "top",
                  }}
                >
                  <InvoiceMoney amount={item.price} currencyCode={currency} />
                </td>
                <td
                  style={{
                    padding: "14px 12px",
                    textAlign: "right",
                    fontSize: 13,
                    color: d.colors.textSecondary,
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
                        : "none",
                    verticalAlign: "top",
                  }}
                >
                  {taxOn ? `${taxPct}%` : "-"}
                </td>
                <td
                  style={{
                    padding: "14px 12px",
                    textAlign: "right",
                    fontSize: 13,
                    fontWeight: 600,
                    color: d.colors.text,
                    borderBottom:
                      index < invoice.services.length - 1
                        ? `1px solid ${d.colors.border}`
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

      {/* Totals */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ width: 280 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              fontSize: 14,
              color: d.colors.textSecondary,
            }}
          >
            <span>Sub Total</span>
            <InvoiceMoney amount={totals.subtotal} currencyCode={currency} />
          </div>
          {totals.discountAmount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: d.colors.discount,
              }}
            >
              <span>Discount</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                <span>−</span>
                <InvoiceMoney
                  amount={totals.discountAmount}
                  currencyCode={currency}
                  style={{ color: d.colors.discount }}
                />
              </span>
            </div>
          )}
          {taxOn && totals.gstBreakdown?.type === "intra" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  fontSize: 14,
                  color: d.colors.textSecondary,
                }}
              >
                <span>
                  CGST (@{totals.gstBreakdown.cgst?.rate.toFixed(1)}%)
                </span>
                <InvoiceMoney
                  amount={totals.gstBreakdown.cgst?.amount ?? 0}
                  currencyCode={currency}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  fontSize: 14,
                  color: d.colors.textSecondary,
                }}
              >
                <span>
                  SGST (@{totals.gstBreakdown.sgst?.rate.toFixed(1)}%)
                </span>
                <InvoiceMoney
                  amount={totals.gstBreakdown.sgst?.amount ?? 0}
                  currencyCode={currency}
                />
              </div>
            </>
          )}
          {taxOn && totals.gstBreakdown?.type === "inter" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: d.colors.textSecondary,
              }}
            >
              <span>
                IGST (@{totals.gstBreakdown.igst?.rate.toFixed(1)}%)
              </span>
              <InvoiceMoney
                amount={totals.gstBreakdown.igst?.amount ?? 0}
                currencyCode={currency}
              />
            </div>
          )}
          {taxOn && !totals.gstBreakdown && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: d.colors.textSecondary,
              }}
            >
              <span>Total Tax</span>
              <InvoiceMoney amount={taxAmt} currencyCode={currency} />
            </div>
          )}
          {shipping > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                fontSize: 14,
                color: d.colors.textSecondary,
              }}
            >
              <span>Shipping</span>
              <InvoiceMoney amount={shipping} currencyCode={currency} />
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0 12px",
              fontSize: 15,
              fontWeight: 700,
              color: d.colors.text,
              borderBottom: `1px solid ${d.colors.border}`,
            }}
          >
            <span>Grand Total</span>
            <InvoiceMoney amount={totals.total} currencyCode={currency} />
          </div>
          <div
            className="invoice-balance-due"
            style={{
              marginTop: 12,
              padding: "12px 16px",
              backgroundColor: d.colors.balanceDueBg,
              borderRadius: d.radius.sm,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 15,
              fontWeight: 700,
              color: d.colors.text,
            }}
          >
            <span>Balance Due</span>
            <InvoiceMoney amount={totals.total} currencyCode={currency} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 32 }}>
        {invoice.notes && (
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: d.type.sectionLabel.size,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: d.colors.textMuted,
              }}
            >
              Notes
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: "20px",
                color: d.colors.textSecondary,
                whiteSpace: "pre-wrap",
              }}
            >
              {invoice.notes}
            </p>
          </div>
        )}

        {hasInvoicePaymentInfo(invoice.payment) && (
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: d.type.sectionLabel.size,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: d.colors.textMuted,
              }}
            >
              Payment Information
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                {paymentLines.map((line) => (
                  <p
                    key={line.label}
                    style={{
                      margin: "4px 0",
                      fontSize: 13,
                      lineHeight: "20px",
                      color: d.colors.textSecondary,
                    }}
                  >
                    <strong style={{ color: d.colors.text }}>
                      {line.label}:
                    </strong>{" "}
                    {line.value}
                  </p>
                ))}
              </div>
              {upiLink && (
                <div
                  style={{
                    flexShrink: 0,
                    textAlign: "center",
                    padding: 12,
                    borderRadius: d.radius.md,
                    border: "none",
                    backgroundColor: d.colors.surface,
                  }}
                >
                  <UpiQrCode value={upiLink} size={112} />
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 11,
                      lineHeight: "16px",
                      color: d.colors.textMuted,
                    }}
                  >
                    Scan to Pay via any UPI App
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {invoice.termsAndConditions && (
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: d.type.sectionLabel.size,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: d.colors.textMuted,
              }}
            >
              Terms &amp; Conditions
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: "18px",
                color: d.colors.textMuted,
                whiteSpace: "pre-wrap",
              }}
            >
              {invoice.termsAndConditions}
            </p>
          </div>
        )}
      </div>

      {invoice.company.signature && (
        <div style={{ marginTop: 32, textAlign: "right" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={invoice.company.signature}
            alt=""
            style={{
              display: "inline-block",
              maxHeight: d.signature.maxHeight,
              maxWidth: d.signature.maxWidth,
              objectFit: "contain",
            }}
          />
        </div>
      )}
      </div>

      {showPoweredBy && (
        <InvoicePoweredBy pinned onRemoveBranding={onRemoveBranding} />
      )}
    </div>
  );
});
