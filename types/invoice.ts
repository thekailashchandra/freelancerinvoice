export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface ServiceItem {
  id: string;
  name: string;
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
  gstEnabled: boolean;
  gstPercentage: number;
  discount: number;
}

export interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  upiId: string;
}

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  logo: string | null;
  signature: string | null;
}

export interface Invoice {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: InvoiceStatus;
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
  gstAmount: number;
  discountAmount: number;
  total: number;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingAmount: number;
  totalRevenue: number;
}
