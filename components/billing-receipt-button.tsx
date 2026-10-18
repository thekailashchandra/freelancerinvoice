"use client";

import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import type { BillingHistoryItem } from "@/lib/billing-types";

function formatReceiptDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BillingReceiptButton({
  payment,
}: {
  payment: BillingHistoryItem;
}) {
  function downloadReceipt() {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 48;
    const right = pageWidth - margin;
    let y = 64;

    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Invoice for Freelance", margin, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(110, 110, 110);
    pdf.text("PAYMENT RECEIPT", margin, y + 20);

    y += 48;
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, y, right, y);

    y += 34;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(17, 17, 17);
    pdf.text(payment.amountDisplay, margin, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(110, 110, 110);
    pdf.text(payment.statusLabel.toUpperCase(), right, y - 4, { align: "right" });

    y += 34;
    const rows: Array<[string, string]> = [
      ["Date", formatReceiptDate(payment.paidAt)],
      ["Description", payment.description],
      ["Provider", payment.providerLabel],
      ["Payment ID", payment.paymentId],
    ];
    if (payment.customerEmail) rows.push(["Billed to", payment.customerEmail]);
    if (payment.paymentMethod) rows.push(["Payment method", payment.paymentMethod]);

    for (const [label, value] of rows) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(110, 110, 110);
      pdf.text(label, margin, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(17, 17, 17);
      const lines = pdf.splitTextToSize(value, pageWidth - margin * 2 - 130);
      pdf.text(lines, margin + 130, y);
      y += Math.max(22, lines.length * 14);
    }

    y += 18;
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, y, right, y);
    y += 24;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(110, 110, 110);
    pdf.text(
      "This receipt confirms payment for your Invoice for Freelance Cloud plan.",
      margin,
      y
    );
    pdf.text(
      "Dodo Payments and Razorpay are the payment processors for their respective currencies.",
      margin,
      y + 14
    );

    const suffix = payment.paymentId.replace(/[^a-zA-Z0-9]/g, "").slice(-8);
    pdf.save(`cloud-receipt-${suffix || "payment"}.pdf`);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={downloadReceipt}
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      Receipt
    </Button>
  );
}
