import type { Invoice, ServiceItem } from "@/types/invoice";
import { generateId, generateInvoiceNumber } from "@/lib/utils";
import { defaultCompanySettings } from "@/lib/storage";

export function createEmptyService(): ServiceItem {
  return {
    id: generateId(),
    name: "",
    quantity: 1,
    price: 0,
  };
}

export function createDefaultInvoice(company = defaultCompanySettings): Invoice {
  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 14);

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
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
        quantity: 1,
        price: 15000,
      },
    ],
    taxDiscount: {
      gstEnabled: true,
      gstPercentage: 18,
      discount: 0,
    },
    payment: {
      bankName: "",
      accountNumber: "",
      upiId: "",
    },
    notes: "Thank you for your business! Payment is due within 14 days.",
    company,
  };
}
