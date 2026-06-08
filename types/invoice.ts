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

export interface TaxDiscount {
  taxEnabled: boolean;
  taxPercentage: number;
  discount: number;
  shippingFee?: number;
  /** Indian GST: intra-state (CGST+SGST) or inter-state (IGST) */
  gstSupplyType?: GstSupplyType;
  /** @deprecated Use taxEnabled */
  gstEnabled?: boolean;
  /** @deprecated Use taxPercentage */
  gstPercentage?: number;
}

export interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  upiId: string;
  routingNumber: string;
  iban: string;
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
  /** ISO country code — drives currency/tax/payment field defaults */
  countryCode: string;
  currencyCode: string;
  taxLabel: string;
  gstin?: string;
  /** Default payment details copied onto new invoices */
  defaultPayment: PaymentDetails;
  /** When true, omit the platform "Powered by" footer on invoices */
  hideInvoiceBranding?: boolean;
}

export interface Invoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: InvoiceStatus;
  currencyCode: string;
  taxLabel: string;
  client: ClientDetails;
  invoice: InvoiceDetails;
  services: ServiceItem[];
  taxDiscount: TaxDiscount;
  payment: PaymentDetails;
  notes: string;
  termsAndConditions?: string;
  /** Paper size for preview, print, and PDF */
  pageSize?: InvoicePageSize;
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
  shippingFee?: number;
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
