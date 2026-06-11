"use client";

import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";
import { deriveInvoiceStatus, getInvoiceTotals } from "@/lib/calculations";
import type { SavedClient } from "@/lib/client-mapper";
import { clientDisplayName } from "@/lib/customer-invoices";
import type { Invoice } from "@/types/invoice";

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-").trim() || "customer-statement";
}

export async function downloadClientStatementPdf(
  client: SavedClient,
  invoices: Invoice[],
  issuerName: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  const addLine = (text: string, size = 10, bold = false) => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += size + 6;
  };

  addLine("Customer statement", 18, true);
  y += 4;
  addLine(`Issued by: ${issuerName || "Your business"}`, 10);
  addLine(`Customer: ${clientDisplayName(client)}`, 10);
  if (client.name && client.company) addLine(`Contact: ${client.name}`, 10);
  if (client.email) addLine(`Email: ${client.email}`, 10);
  if (client.phone) addLine(`Phone: ${client.phone}`, 10);
  if (client.address) {
    const lines = doc.splitTextToSize(`Address: ${client.address}`, pageWidth - margin * 2);
    for (const line of lines) addLine(line, 10);
  }
  y += 8;

  addLine("Invoices", 12, true);
  y += 4;

  const colX = {
    number: margin,
    date: margin + 100,
    due: margin + 180,
    status: margin + 260,
    amount: pageWidth - margin - 80,
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Invoice #", colX.number, y);
  doc.text("Date", colX.date, y);
  doc.text("Due", colX.due, y);
  doc.text("Status", colX.status, y);
  doc.text("Amount", colX.amount, y);
  y += 14;

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);

  let totalInvoiced = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  for (const invoice of invoices) {
    if (y > doc.internal.pageSize.getHeight() - margin - 40) {
      doc.addPage();
      y = margin;
    }

    const { total } = getInvoiceTotals(invoice);
    const status = deriveInvoiceStatus(
      invoice.status,
      invoice.invoice.dueDate
    );
    const currency = invoice.currencyCode;

    totalInvoiced += total;
    if (status === "paid") totalPaid += total;
    else if (status !== "void") totalOutstanding += total;

    doc.text(invoice.invoice.invoiceNumber.slice(0, 16), colX.number, y);
    doc.text(formatDate(invoice.invoice.invoiceDate), colX.date, y);
    doc.text(formatDate(invoice.invoice.dueDate), colX.due, y);
    doc.text(status, colX.status, y);
    doc.text(formatMoney(total, currency), colX.amount, y);
    y += 14;
  }

  if (invoices.length === 0) {
    addLine("No invoices on file for this customer.", 10);
  }

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  const primaryCurrency = invoices[0]?.currencyCode ?? "USD";
  addLine(`Total invoiced: ${formatMoney(totalInvoiced, primaryCurrency)}`, 10, true);
  addLine(`Total paid: ${formatMoney(totalPaid, primaryCurrency)}`, 10, true);
  addLine(
    `Balance due: ${formatMoney(totalOutstanding, primaryCurrency)}`,
    10,
    true
  );

  const filename = `${sanitizeFilename(clientDisplayName(client))}-statement.pdf`;
  doc.save(filename);
}
