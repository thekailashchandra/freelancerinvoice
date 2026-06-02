export type InvoiceStatus =
  | "draft"
  | "paid"
  | "pending"
  | "sent"
  | "overdue";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

export interface TaxDiscount {
  taxEnabled: boolean;
  taxPercentage: number;
  discount: number;
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
  signature: string | null;
  /** ISO country code — drives currency/tax/payment field defaults */
  countryCode: string;
  currencyCode: string;
  taxLabel: string;
  /** Default payment details copied onto new invoices */
  defaultPayment: PaymentDetails;
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
  company: CompanySettings;
}

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
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
