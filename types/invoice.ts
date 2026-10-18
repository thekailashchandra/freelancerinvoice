export type InvoiceStatus =
  | "draft"
  | "paid"
  | "pending"
  | "sent"
  | "overdue"
  | "void";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export type GstSupplyType = "intra" | "inter";

export type InvoicePageSize = "a4" | "letter";

export type InvoiceTemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "bold"
  | "corporate"
  | "studio"
  | "geometric"
  | "swiss";

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  gstin?: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  /** e.g. "Due on receipt", "Net 30" */
  paymentTerms?: string;
  purchaseOrder?: string;
  projectName?: string;
}

export interface AdditionalCharge {
  id: string;
  label: string;
  amount: number;
}

export interface TaxDiscount {
  taxEnabled: boolean;
  taxPercentage: number;
  discount: number;
  additionalCharges?: AdditionalCharge[];
  /** Indian GST: intra-state (CGST+SGST) or inter-state (IGST) */
  gstSupplyType?: GstSupplyType;
  /** @deprecated Use taxEnabled */
  gstEnabled?: boolean;
  /** @deprecated Use taxPercentage */
  gstPercentage?: number;
}

export interface PaymentDetails {
  /** Name on the bank account (may differ from company name) */
  accountName: string;
  bankName: string;
  accountNumber: string;
  upiId: string;
  routingNumber: string;
  iban: string;
  swiftCode: string;
  bankAddress: string;
  sortCode: string;
}

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  logo: string | null;
  /** Logo height in px on invoice (32–200) */
  logoHeight?: number;
  signature: string | null;
  /** When true, omit the italic first-name text when no signature image is uploaded */
  hideSignatureTextFallback?: boolean;
  /** ISO country code — drives currency/tax/payment field defaults */
  countryCode: string;
  currencyCode: string;
  taxLabel: string;
  /** Brand accent used by invoice templates (hex, e.g. #111111) */
  brandColor?: string;
  gstin?: string;
  /** Default payment details copied onto new invoices */
  defaultPayment: PaymentDetails;
  /** When true, omit the platform footer after a Ko-fi contribution is confirmed */
  hideInvoiceBranding?: boolean;
  /** Razorpay Key ID (BYOK) — safe to show in Settings */
  razorpayKeyId?: string;
  /** Sent only when saving; never returned from the profile API */
  razorpayKeySecret?: string;
  /** True when Key ID and Secret are stored server-side */
  razorpayConfigured?: boolean;
}

export interface Invoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: InvoiceStatus;
  currencyCode: string;
  taxLabel: string;
  /** Saved customer id when chosen from address book */
  clientId?: string | null;
  client: ClientDetails;
  invoice: InvoiceDetails;
  services: ServiceItem[];
  taxDiscount: TaxDiscount;
  payment: PaymentDetails;
  notes: string;
  termsAndConditions?: string;
  /** Paper size for preview, print, and PDF */
  pageSize?: InvoicePageSize;
  /** Visual PDF layout style */
  templateId?: InvoiceTemplateId;
  company: CompanySettings;
}

export interface GstTaxLine {
  rate: number;
  amount: number;
}

export interface GstBreakdown {
  type: GstSupplyType | "standard";
  cgst?: GstTaxLine;
  sgst?: GstTaxLine;
  igst?: GstTaxLine;
}

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  additionalCharges: AdditionalCharge[];
  additionalChargesTotal: number;
  total: number;
  gstBreakdown?: GstBreakdown;
  /** @deprecated Use taxAmount */
  gstAmount?: number;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingAmount: number;
  totalRevenue: number;
  currencyCode: string;
}
