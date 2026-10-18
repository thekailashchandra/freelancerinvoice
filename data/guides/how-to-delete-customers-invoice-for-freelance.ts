import type { GuideArticle } from "./types";

export const howToDeleteCustomersInvoiceForFreelance: GuideArticle = {
  slug: "how-to-delete-customers-invoice-for-freelance",
  title: "How to Delete a Customer in Invoice for Freelance",
  description:
    "Remove a saved customer from your list in Invoice for Freelance - step-by-step instructions, what happens to linked invoices, and how to add customers again.",
  keywords: [
    "delete customer invoice for freelance",
    "remove client from customer list",
    "how to delete customers",
    "invoice for freelance customers",
  ],
  category: "Client Management",
  pillar: "client-management",
  publishedAt: "2026-07-06",
  readingTimeMinutes: 3,
  sections: [
    {
      id: "why-delete",
      heading: "When to delete a customer",
      paragraphs: [
        "You might remove a customer after a one-off project ends, when you entered a duplicate profile, or when you no longer work with that client and want a cleaner customer list.",
        "Deleting a customer only removes their saved profile - not your billing history.",
      ],
    },
    {
      id: "steps",
      heading: "How to delete a customer",
      steps: [
        {
          title: "Open Customers",
          description: "Sign in and choose Customers from the sidebar.",
        },
        {
          title: "Select the customer",
          description: "Click the customer you want to remove from your list.",
        },
        {
          title: "Delete customer",
          description:
            "On the customer detail page, click Delete customer and confirm the prompt.",
        },
      ],
    },
    {
      id: "invoices",
      heading: "What happens to invoices",
      paragraphs: [
        "Invoices you already created for that customer remain in your invoice history. Each invoice keeps the client name, email, and address that were saved when you issued it.",
        "Deleting a customer does not delete invoices. If you need to remove an invoice itself, open it from Invoice history and delete it separately.",
      ],
    },
    {
      id: "add-again",
      heading: "Adding a customer again",
      paragraphs: [
        "Deleted customers cannot be restored automatically. To work with the same client again, add them while creating a new invoice using the customer picker.",
        "Their previous invoices will still appear in your history if the details match, even though the saved customer profile was removed.",
      ],
    },
  ],
  contentUpgrade: {
    title: "Manage customers while you invoice",
    description:
      "Save clients once, reuse them on every invoice, and download statements from the Customers page.",
    items: [
      "Saved customer profiles",
      "Per-customer invoice history",
      "Statement PDF download",
    ],
    ctaLabel: "Open Customers",
    ctaHref: "/customers",
  },
};
