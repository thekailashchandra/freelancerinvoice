import type { CompanySettings, Invoice, ServiceItem } from "@/types/invoice";
import { generateId, generateInvoiceNumber } from "@/lib/utils";
import { defaultCompanySettings } from "@/lib/storage";
import { emptyPaymentDetails, getCountryConfig } from "@/lib/country";
import { getDefaultCompanySettingsForCountry } from "@/lib/geo-market";

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

/** Blank invoice prefilled for a detected or selected country. */
export function createDefaultInvoiceForCountry(countryCode: string): Invoice {
  return createDefaultInvoice(getDefaultCompanySettingsForCountry(countryCode));
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
      gstin: "",
    },
    invoice: {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: today,
      dueDate: due.toISOString().split("T")[0],
      paymentTerms: "Due on receipt",
      purchaseOrder: "",
      projectName: "",
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
      gstSupplyType:
        getCountryConfig(company.countryCode).taxLabel === "GST"
          ? "intra"
          : undefined,
    },
    payment: { ...company.defaultPayment },
    notes: "Thanks for your business.",
    termsAndConditions: "",
    pageSize: "a4",
    company,
  };
}
