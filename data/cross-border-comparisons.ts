export type CrossBorderComparisonRow = {
  channel: string;
  payoutSpeed: string;
  typicalFees: string;
  taxWithholding: string;
  bestFor: string;
};

export const indiaCrossBorderPayoutComparison: CrossBorderComparisonRow[] = [
  {
    channel: "Wise (USD → INR)",
    payoutSpeed: "1–2 business days",
    typicalFees: "0.4–1.5% FX margin + transfer fee",
    taxWithholding: "No TDS by Wise; report income in ITR",
    bestFor: "US/EU clients paying Indian freelancers regularly",
  },
  {
    channel: "PayPal (international)",
    payoutSpeed: "Instant to PayPal; 1–3 days to bank",
    typicalFees: "3–5% FX spread + withdrawal fee to INR",
    taxWithholding: "No Form 16A; keep PayPal statements for filing",
    bestFor: "Small one-off payments under $500",
  },
  {
    channel: "SWIFT wire (USD)",
    payoutSpeed: "2–5 business days",
    typicalFees: "$15–45 intermediary + receiving bank charges",
    taxWithholding: "Client may not withhold; FIRC required for export",
    bestFor: "Large enterprise clients with AP departments",
  },
  {
    channel: "Direct INR (NEFT/IMPS/UPI)",
    payoutSpeed: "Same day to 24 hours",
    typicalFees: "Minimal domestic transfer fees",
    taxWithholding: "Client deducts TDS u/s 194J if applicable",
    bestFor: "Indian domestic clients and GST-registered billing",
  },
  {
    channel: "Stripe / Mercury (US entity)",
    payoutSpeed: "2–4 days after US payout",
    typicalFees: "Platform + FX fees if repatriating",
    taxWithholding: "US 1099 if $600+ via US platform",
    bestFor: "Freelancers with a US LLC receiving client payments",
  },
];

export const globalWireFormatComparison = {
  caption: "Cross-border banking layouts by corridor",
  headers: ["Region", "Primary fields", "Wire standard", "Compliance note"],
  rows: [
    [
      "United States",
      "Routing (ABA) + account number",
      "ACH / Fedwire",
      "W-9 on file; 1099-NEC if $600+",
    ],
    [
      "United Kingdom",
      "Sort code + account number or IBAN",
      "Faster Payments / CHAPS",
      "VAT invoice if registered; MTD records",
    ],
    [
      "European Union",
      "IBAN + BIC/SWIFT",
      "SEPA / SWIFT",
      "Reverse-charge VAT for B2B services",
    ],
    [
      "India (export)",
      "SWIFT + IFSC + FIRC reference",
      "SWIFT (USD/EUR inward)",
      "LUT for zero-rated export; Form 15CA/CB",
    ],
    [
      "Australia",
      "BSB + account number",
      "EFT / SWIFT",
      "ABN on invoice; GST if registered",
    ],
  ],
};
