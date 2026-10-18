import type { TemplateFaqItem } from "@/data/template-pages/types";

export const customerFaqs: TemplateFaqItem[] = [
  {
    question: "How do I delete a customer from my list?",
    answer:
      "Open Customers, select the customer, and click Delete customer. Confirm the prompt - they are removed from your saved customer list immediately.",
  },
  {
    question: "Will deleting a customer delete their invoices?",
    answer:
      "No. Existing invoices stay in your invoice history with the client details that were saved on each invoice. Only the saved customer profile is removed.",
  },
  {
    question: "Can I recover a deleted customer?",
    answer:
      "Deleted customers cannot be restored. Add them again from Create invoice if you need the profile back in your customer list.",
  },
  {
    question: "How do I add a customer?",
    answer:
      "While creating or editing an invoice, use the customer picker to select an existing customer or add a new one. New customers then appear on the Customers page.",
  },
];
