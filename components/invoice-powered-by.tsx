import { invoiceDesign } from "@/lib/invoice-design";
import { invoiceBrandingLabel } from "@/lib/invoice-branding";

const d = invoiceDesign;

type InvoicePoweredByProps = {
  className?: string;
  /** Pin to the bottom of a full invoice page (flex child). */
  pinned?: boolean;
  /** Screen-only: open the branding removal flow */
  onRemoveBranding?: () => void;
};

/** Platform footer - removable with the Cloud plan. */
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
      {onRemoveBranding ? (
        <p
          className="invoice-screen-only"
          style={{ margin: "6px 0 0", fontSize: 9, lineHeight: "12px" }}
        >
          <button
            type="button"
            onClick={onRemoveBranding}
            style={{
              color: d.colors.textMuted,
              textDecoration: "underline",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Remove footer
          </button>
        </p>
      ) : null}
    </div>
  );
}
