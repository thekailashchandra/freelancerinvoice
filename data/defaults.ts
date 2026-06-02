import type { CompanySettings, Invoice, ServiceItem } from "@/types/invoice";
import { generateId, generateInvoiceNumber } from "@/lib/utils";
import { defaultCompanySettings } from "@/lib/storage";
import { emptyPaymentDetails, getCountryConfig } from "@/lib/country";

function newInvoiceId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return generateId();
}

export function createEmptyService(): ServiceItem {
  return {
    id: generateId(),
    name: "",
    description: "",
    quantity: 1,
    price: 0,
  };
}

export function createDefaultInvoice(company: CompanySettings = defaultCompanySettings): Invoice {
  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 14);

  return {
    id: newInvoiceId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    currencyCode: company.currencyCode,
    taxLabel: company.taxLabel,
    client: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    },
    invoice: {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: today,
      dueDate: due.toISOString().split("T")[0],
    },
    services: [
      {
        id: generateId(),
        name: "Web Design",
        description: "",
        quantity: 1,
        price: 15000,
      },
    ],
    taxDiscount: {
      taxEnabled: true,
      taxPercentage: getCountryConfig(company.countryCode).defaultTaxPercent,
      discount: 0,
    },
    payment: { ...company.defaultPayment },
    notes: "Thank you for your business! Payment is due within 14 days.",
    company,
  };
}
