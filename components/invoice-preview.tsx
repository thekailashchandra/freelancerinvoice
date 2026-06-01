"use client";

import { Inter } from "next/font/google";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { calculateTotals, deriveInvoiceStatus } from "@/lib/calculations";
import { invoiceDesign, invoiceStatusColors } from "@/lib/invoice-design";
import { formatCurrency, formatDate } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const d = invoiceDesign;

interface InvoicePreviewProps {
  invoice: Invoice;
  previewId?: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "normal",
        color: d.colors.label,
        margin: 0,
        lineHeight: "16px",
      }}
    >
      {children}
    </p>
  );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const s = invoiceStatusColors[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 9999,
        border: `1px solid ${s.border}`,
        backgroundColor: s.bg,
        color: s.color,
        padding: "4px 12px",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "capitalize",
        letterSpacing: "normal",
      }}
    >
      {status}
    </span>
  );
}

function CompanyLogo({ invoice }: { invoice: Invoice }) {
  const box = d.logo.boxSize;
  const boxStyle: React.CSSProperties = {
    width: box,
    height: box,
    minWidth: box,
    minHeight: box,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: d.colors.surface,
    border: `1px solid ${d.colors.border}`,
    borderRadius: 10,
    padding: 8,
  };

  if (invoice.company.logo) {
    return (
      <div style={boxStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={invoice.company.logo}
          alt="Company logo"
          style={{
            display: "block",
            maxWidth: d.logo.imageMax,
            maxHeight: d.logo.imageMax,
            width: "auto",
            height: "auto",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...boxStyle,
        backgroundColor: d.colors.accent,
        borderColor: d.colors.accent,
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        {invoice.company.companyName.charAt(0) || "?"}
      </span>
    </div>
  );
}

export function InvoicePreview({
  invoice,
  previewId = "invoice-preview",
}: InvoicePreviewProps) {
  const totals = calculateTotals(invoice.services, invoice.taxDiscount);
  const displayStatus = deriveInvoiceStatus(
    invoice.status,
    invoice.invoice.dueDate
  );

  return (
    <div
      id={previewId}
      className={`invoice-print-area mx-auto w-full max-w-2xl overflow-hidden rounded-2xl ${inter.className}`}
      style={{
        backgroundColor: d.colors.bg,
        color: d.colors.text,
        border: `1px solid ${d.colors.border}`,
        boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.12)",
        padding: "36px 40px",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          height: 3,
          width: "100%",
          backgroundColor: d.colors.accent,
          marginBottom: 24,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: 28,
          borderBottom: `1px solid ${d.colors.border}`,
        }}
      >
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <CompanyLogo invoice={invoice} />
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: d.colors.text,
                letterSpacing: "normal",
                lineHeight: "24px",
                margin: 0,
              }}
            >
              {invoice.company.companyName || "Your Company"}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: d.colors.textMuted,
                marginTop: 4,
                lineHeight: "20px",
                letterSpacing: "normal",
              }}
            >
              {invoice.company.companyEmail}
            </p>
            <p
              style={{
                fontSize: 13,
                color: d.colors.textMuted,
                lineHeight: "20px",
                letterSpacing: "normal",
              }}
            >
              {invoice.company.companyPhone}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: d.colors.text,
              letterSpacing: "normal",
              lineHeight: "30px",
              margin: 0,
            }}
          >
            INVOICE
          </h1>
          <p
            style={{
              fontFamily: d.fontMono,
              fontSize: 13,
              fontWeight: 600,
              color: d.colors.textSecondary,
              marginTop: 6,
              letterSpacing: "normal",
            }}
          >
            {invoice.invoice.invoiceNumber}
          </p>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
            <StatusBadge status={displayStatus} />
          </div>
        </div>
      </div>

      {/* Bill to + dates */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 28,
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>
          <SectionLabel>Bill To</SectionLabel>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: d.colors.text,
              marginTop: 8,
              lineHeight: "24px",
              letterSpacing: "normal",
            }}
          >
            {invoice.client.name || "Client Name"}
          </p>
          {invoice.client.company && (
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: d.colors.textSecondary,
                marginTop: 4,
              }}
            >
              {invoice.client.company}
            </p>
          )}
          <p
            style={{
              fontSize: 13,
              color: d.colors.textMuted,
              marginTop: 6,
              lineHeight: 1.55,
              whiteSpace: "pre-line",
            }}
          >
            {invoice.client.address || "Client address"}
          </p>
          {invoice.client.email && (
            <p style={{ fontSize: 13, color: d.colors.textMuted, marginTop: 4 }}>
              {invoice.client.email}
            </p>
          )}
          {invoice.client.phone && (
            <p style={{ fontSize: 13, color: d.colors.textMuted, marginTop: 2 }}>
              {invoice.client.phone}
            </p>
          )}
        </div>
        <div style={{ minWidth: 200 }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "5px 16px 5px 0",
                    color: d.colors.label,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Invoice Date
                </td>
                <td
                  style={{
                    padding: "5px 0",
                    textAlign: "right",
                    fontWeight: 700,
                    color: d.colors.text,
                    whiteSpace: "nowrap",
                    letterSpacing: "normal",
                  }}
                >
                  {formatDate(invoice.invoice.invoiceDate)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "5px 16px 5px 0",
                    color: d.colors.label,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Due Date
                </td>
                <td
                  style={{
                    padding: "5px 0",
                    textAlign: "right",
                    fontWeight: 700,
                    color: d.colors.text,
                    whiteSpace: "nowrap",
                    letterSpacing: "normal",
                  }}
                >
                  {formatDate(invoice.invoice.dueDate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          marginTop: 32,
          border: `1px solid ${d.colors.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: d.colors.surface }}>
              {["Description", "Qty", "Rate", "Amount"].map((col, i) => (
                <th
                  key={col}
                  style={{
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: d.colors.label,
                    textAlign:
                      i === 0 ? "left" : i === 1 ? "center" : "right",
                    width: i === 1 ? 72 : i > 1 ? 120 : undefined,
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
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: d.colors.textSecondary,
                    borderBottom: `1px solid ${d.colors.border}`,
                  }}
                >
                  {item.name || "Service"}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "center",
                    fontSize: 14,
                    color: d.colors.textMuted,
                    borderBottom: `1px solid ${d.colors.border}`,
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontSize: 14,
                    color: d.colors.textMuted,
                    borderBottom: `1px solid ${d.colors.border}`,
                  }}
                >
                  {formatCurrency(item.price)}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 600,
                    color: d.colors.text,
                    borderBottom: `1px solid ${d.colors.border}`,
                  }}
                >
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            width: 300,
            backgroundColor: d.colors.surface,
            border: `1px solid ${d.colors.border}`,
            borderRadius: 12,
            padding: 20,
            fontSize: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: d.colors.textSecondary,
            }}
          >
            <span style={{ fontWeight: 500 }}>Subtotal</span>
            <span style={{ fontWeight: 600, color: d.colors.text }}>
              {formatCurrency(totals.subtotal)}
            </span>
          </div>
          {totals.discountAmount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#059669",
                marginTop: 10,
              }}
            >
              <span style={{ fontWeight: 500 }}>Discount</span>
              <span style={{ fontWeight: 600 }}>
                -{formatCurrency(totals.discountAmount)}
              </span>
            </div>
          )}
          {invoice.taxDiscount.gstEnabled && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: d.colors.textSecondary,
                marginTop: 10,
              }}
            >
              <span style={{ fontWeight: 500 }}>
                GST ({invoice.taxDiscount.gstPercentage}%)
              </span>
              <span style={{ fontWeight: 600, color: d.colors.text }}>
                {formatCurrency(totals.gstAmount)}
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 14,
              paddingTop: 14,
              borderTop: `2px solid ${d.colors.text}`,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: d.colors.text }}>
              Total
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: d.colors.accent }}>
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment */}
      {(invoice.payment.bankName ||
        invoice.payment.accountNumber ||
        invoice.payment.upiId) && (
        <div
          style={{
            marginTop: 28,
            backgroundColor: d.colors.surface,
            border: `1px solid ${d.colors.border}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <SectionLabel>Payment Details</SectionLabel>
          {invoice.payment.bankName && (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                fontWeight: 500,
                color: d.colors.textSecondary,
              }}
            >
              <span style={{ color: d.colors.label }}>Bank</span>
              {"  "}
              {invoice.payment.bankName}
            </p>
          )}
          {invoice.payment.accountNumber && (
            <p
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: 500,
                color: d.colors.textSecondary,
              }}
            >
              <span style={{ color: d.colors.label }}>Account</span>
              {"  "}
              {invoice.payment.accountNumber}
            </p>
          )}
          {invoice.payment.upiId && (
            <p
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: 500,
                color: d.colors.textSecondary,
              }}
            >
              <span style={{ color: d.colors.label }}>UPI</span>
              {"  "}
              {invoice.payment.upiId}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div style={{ marginTop: 24 }}>
          <SectionLabel>Notes</SectionLabel>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: "22px",
              color: d.colors.textSecondary,
              whiteSpace: "pre-wrap",
              letterSpacing: "normal",
              wordSpacing: "normal",
            }}
          >
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 24,
          borderTop: `1px solid ${d.colors.border}`,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, color: d.colors.label }}>
          Thank you for your business
        </p>
        {invoice.company.signature ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              minHeight: d.signature.maxHeight,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={invoice.company.signature}
              alt="Signature"
              style={{
                display: "block",
                maxHeight: d.signature.maxHeight,
                maxWidth: d.signature.maxWidth,
                width: "auto",
                height: "auto",
                objectFit: "contain",
                objectPosition: "right bottom",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              minWidth: 160,
              paddingTop: 28,
              borderTop: `1px solid ${d.colors.borderStrong}`,
              fontSize: 13,
              color: d.colors.textMuted,
              textAlign: "right",
            }}
          >
            Authorized Signature
          </div>
        )}
      </div>
    </div>
  );
}
