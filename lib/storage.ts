import type { CompanySettings, DashboardStats, Invoice } from "@/types/invoice";
import { emptyPaymentDetails } from "@/lib/country";
import { getInvoiceTotals } from "./calculations";

const INVOICES_KEY = "freelancer-invoices";
const SETTINGS_KEY = "freelancer-settings";

export const defaultCompanySettings: CompanySettings = {
  companyName: "Your Studio",
  companyEmail: "hello@yourstudio.com",
  companyPhone: "+91 98765 43210",
  companyAddress: "123 Creative Lane, Mumbai, India",
  logo: null,
  signature: null,
  countryCode: "US",
  currencyCode: "USD",
  taxLabel: "VAT",
  defaultPayment: emptyPaymentDetails(),
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  return safeParse<Invoice[]>(localStorage.getItem(INVOICES_KEY), []);
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const index = invoices.findIndex((i) => i.id === invoice.id);
  if (index >= 0) {
    invoices[index] = invoice;
  } else {
    invoices.unshift(invoice);
  }
  saveInvoices(invoices);
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((i) => i.id !== id);
  saveInvoices(invoices);
}

export function getInvoiceById(id: string): Invoice | undefined {
  return getInvoices().find((i) => i.id === id);
}

export function getCompanySettings(): CompanySettings {
  if (typeof window === "undefined") return defaultCompanySettings;
  return safeParse<CompanySettings>(
    localStorage.getItem(SETTINGS_KEY),
    defaultCompanySettings
  );
}

export function saveCompanySettings(settings: CompanySettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getDashboardStats(invoices: Invoice[]): DashboardStats {
  let paidInvoices = 0;
  let pendingAmount = 0;
  let totalRevenue = 0;

  for (const invoice of invoices) {
    const { total } = getInvoiceTotals(invoice);
    if (invoice.status === "paid") {
      paidInvoices += 1;
      totalRevenue += total;
    } else {
      pendingAmount += total;
    }
  }

  return {
    totalInvoices: invoices.length,
    paidInvoices,
    pendingAmount,
    totalRevenue,
    currencyCode: "USD",
  };
}
