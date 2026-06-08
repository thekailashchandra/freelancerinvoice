import { invoiceDesign } from "@/lib/invoice-design";
import { invoiceBrandingLabel } from "@/lib/invoice-branding";

const d = invoiceDesign;

type InvoicePoweredByProps = {
  className?: string;
  /** Pin to the bottom of a full invoice page (flex child). */
  pinned?: boolean;
  /** Screen-only: opens Ko-fi tip flow to remove branding. */
  onRemoveBranding?: () => void;
};

/** Small footer shown on exported invoices when branding is enabled. */
export function InvoicePoweredBy({
  className,
  pinned,
  onRemoveBranding,
}: InvoicePoweredByProps) {
  return (
    <div
      className={className}
      style={{
        marginTop: pinned ? "auto" : 28,
        paddingTop: 12,
        borderTop: `1px solid ${d.colors.border}`,
        textAlign: "center",
        flexShrink: 0,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 10,
          lineHeight: "14px",
          letterSpacing: "0.02em",
          color: d.colors.textMuted,
        }}
      >
        Powered by{" "}
        <span style={{ color: d.colors.textSecondary, fontWeight: 500 }}>
          {invoiceBrandingLabel}
        </span>
      </p>
      {onRemoveBranding && (
        <button
          type="button"
          className="invoice-screen-only"
          onClick={onRemoveBranding}
          style={{
            display: "block",
            margin: "6px auto 0",
            padding: 0,
            border: "none",
            background: "none",
            fontSize: 9,
            lineHeight: "12px",
            color: d.colors.textMuted,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Remove · tip on Ko-fi
        </button>
      )}
    </div>
  );
}
