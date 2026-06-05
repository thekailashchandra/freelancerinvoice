import type { ProfileRow, InvoiceRow, InvoiceItemRow, InvoiceWithItems } from "@/types/database";
import type {
  CompanySettings,
  Invoice,
  InvoicePageSize,
  InvoiceStatus,
  PaymentDetails,
  ServiceItem,
} from "@/types/invoice";
import { resolveInvoicePageSize } from "@/lib/invoice-design";
import { sanitizePaymentForCountry } from "@/lib/country";
import { generateId } from "@/lib/utils";

function profileRowToPayment(profile: ProfileRow): PaymentDetails {
  return sanitizePaymentForCountry(
    {
      bankName: profile.default_bank_name ?? "",
      accountNumber: profile.default_account_number ?? "",
      upiId: profile.default_upi_id ?? "",
      routingNumber: profile.default_routing_number ?? "",
      iban: profile.default_iban ?? "",
      sortCode: profile.default_sort_code ?? "",
    },
    profile.country_code
  );
}

export function profileToCompanySettings(profile: ProfileRow): CompanySettings {
  return {
    companyName: profile.company_name ?? "",
    companyEmail: profile.email ?? "",
    companyPhone: profile.phone ?? "",
    companyAddress: profile.address ?? "",
    logo: profile.logo_url,
    logoHeight: profile.logo_height ?? 80,
    signature: profile.signature_url,
    countryCode: profile.country_code ?? "OTHER",
    currencyCode: profile.currency_code,
    taxLabel: profile.tax_label,
    defaultPayment: profileRowToPayment(profile),
  };
}

function mapDbStatusToUi(status: InvoiceRow["status"]): InvoiceStatus {
  if (status === "draft" || status === "sent") return "pending";
  if (status === "paid" || status === "pending" || status === "overdue") {
    return status;
  }
  return "pending";
}

function mapUiStatusToDb(status: InvoiceStatus): InvoiceRow["status"] {
  return status;
}

export function dbInvoiceToApp(
  row: InvoiceWithItems,
  company: CompanySettings
): Invoice {
  const items = [...row.invoice_items].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: mapDbStatusToUi(row.status),
    currencyCode: row.currency_code,
    taxLabel: row.tax_label,
    client: {
      name: row.client_name_snapshot,
      email: row.client_email_snapshot,
      phone: row.client_phone_snapshot,
      company: row.client_company_snapshot,
      address: row.client_address_snapshot,
      gstin: row.client_gstin ?? "",
    },
    invoice: {
      invoiceNumber: row.invoice_number,
      invoiceDate: row.invoice_date,
      dueDate: row.due_date,
      paymentTerms: row.payment_terms ?? "Due on receipt",
      purchaseOrder: row.purchase_order ?? "",
      projectName: row.project_name ?? "",
    },
    services: items.map((item) => ({
      id: item.id,
      name: item.service_name,
      description: item.service_description ?? "",
      quantity: item.qty,
      price: Number(item.price),
    })),
    taxDiscount: {
      taxEnabled: Number(row.tax_percent) > 0,
      taxPercentage: Number(row.tax_percent),
      discount: Number(row.discount_amount),
      gstSupplyType:
        row.gst_supply_type === "inter" ? "inter" : "intra",
    },
    payment: {
      bankName: row.bank_name,
      accountNumber: row.account_number,
      upiId: row.upi_id,
      routingNumber: row.routing_number ?? "",
      iban: row.iban ?? "",
      sortCode: row.sort_code ?? "",
    },
    notes: row.notes,
    termsAndConditions: row.terms_and_conditions ?? "",
    pageSize: resolveInvoicePageSize(
      (row.page_size as InvoicePageSize | undefined) ?? "a4"
    ),
    company: {
      ...company,
      gstin: row.seller_gstin ?? "",
    },
  };
}

export function appInvoiceToDbPayload(
  invoice: Invoice,
  userId: string
): {
  invoice: Omit<InvoiceRow, "id" | "created_at" | "updated_at"> & { id?: string };
  items: Omit<InvoiceItemRow, "id" | "invoice_id">[];
} {
  const taxPercent = invoice.taxDiscount.taxEnabled
    ? invoice.taxDiscount.taxPercentage
    : 0;

  const payment = sanitizePaymentForCountry(
    invoice.payment,
    invoice.company.countryCode
  );

  return {
    invoice: {
      id: invoice.id,
      user_id: userId,
      invoice_number: invoice.invoice.invoiceNumber,
      client_id: null,
      client_name_snapshot: invoice.client.name,
      client_email_snapshot: invoice.client.email,
      client_phone_snapshot: invoice.client.phone,
      client_company_snapshot: invoice.client.company,
      client_address_snapshot: invoice.client.address,
      invoice_date: invoice.invoice.invoiceDate,
      due_date: invoice.invoice.dueDate,
      tax_percent: taxPercent,
      discount_amount: invoice.taxDiscount.discount,
      currency_code: invoice.currencyCode,
      tax_label: invoice.taxLabel,
      status: mapUiStatusToDb(invoice.status),
      notes: invoice.notes,
      payment_terms: invoice.invoice.paymentTerms ?? "Due on receipt",
      purchase_order: invoice.invoice.purchaseOrder ?? "",
      project_name: invoice.invoice.projectName ?? "",
      terms_and_conditions: invoice.termsAndConditions ?? "",
      gst_supply_type: invoice.taxDiscount.gstSupplyType ?? "intra",
      seller_gstin: invoice.company.gstin ?? "",
      client_gstin: invoice.client.gstin ?? "",
      bank_name: payment.bankName,
      account_number: payment.accountNumber,
      upi_id: payment.upiId,
      routing_number: payment.routingNumber,
      iban: payment.iban,
      sort_code: payment.sortCode,
      page_size: resolveInvoicePageSize(invoice.pageSize),
    },
    items: invoice.services.map((s, index) => ({
      service_name: s.name,
      service_description: s.description,
      qty: s.quantity,
      price: s.price,
      sort_order: index,
    })),
  };
}

export function mergeProfileIntoInvoice(
  invoice: Invoice,
  profile: CompanySettings
): Invoice {
  return {
    ...invoice,
    currencyCode: invoice.currencyCode || profile.currencyCode,
    taxLabel: invoice.taxLabel || profile.taxLabel,
    payment:
      invoice.payment.bankName ||
      invoice.payment.accountNumber ||
      invoice.payment.upiId ||
      invoice.payment.routingNumber ||
      invoice.payment.iban ||
      invoice.payment.sortCode
        ? invoice.payment
        : { ...profile.defaultPayment },
    company: {
      ...profile,
      logo: invoice.company.logo ?? profile.logo,
      signature: invoice.company.signature ?? profile.signature,
    },
  };
}

export function ensureClientIds(services: ServiceItem[]): ServiceItem[] {
  return services.map((s) =>
    s.id ? s : { ...s, id: generateId() }
  );
}
