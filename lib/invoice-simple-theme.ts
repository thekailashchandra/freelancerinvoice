/** Shared tokens for the Simple (bold) invoice template. */

export const simpleTemplateColors = {
  bg: "#f7f7f5",
  text: "#111111",
  textMuted: "#555555",
  border: "#d4d4d4",
  line: "#c9c9c9",
} as const;

export function getSimpleHeaderMessage(invoice: {
  notes?: string;
  invoice: { projectName?: string };
}): string {
  const fromNotes = invoice.notes?.trim().split(/[.!?]/)[0]?.trim();
  if (fromNotes && fromNotes.length > 8) return fromNotes;
  if (invoice.invoice.projectName?.trim()) {
    return `Thank you for your order - ${invoice.invoice.projectName.trim()}.`;
  }
  return "Thank you for your order.";
}

export function getSimpleFooterTagline(invoice: {
  notes?: string;
  company: { companyName: string };
}): string {
  const notes = invoice.notes?.trim();
  if (notes) {
    const lastLine = notes.split("\n").filter(Boolean).pop();
    if (lastLine && lastLine.length < 60) return lastLine;
  }
  return "Thank you for your business.";
}
