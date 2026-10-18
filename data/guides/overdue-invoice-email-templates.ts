import type { GuideArticle } from "./types";

export const overdueInvoiceEmailTemplates: GuideArticle = {
  slug: "overdue-invoice-email-templates",
  title: "How to Write a Polite but Firm Overdue Invoice Email (With Templates)",
  description:
    "Copy-paste overdue invoice email templates for freelancers - friendly reminders, firm follow-ups, and final notices that recover payment without damaging client relationships.",
  keywords: [
    "overdue invoice email template",
    "late payment email freelancer",
    "chase invoice email",
    "polite overdue payment reminder",
    "freelancer invoice follow up email",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  hubClusterId: "freelance-invoicing-getting-paid",
  publishedAt: "2026-06-11",
  readingTimeMinutes: 8,
  coreBlock: {
    id: "overdue-email-sequence",
    heading: "Overdue invoice email escalation sequence",
    steps: [
      {
        title: "Day −3: Friendly pre-due reminder",
        description:
          "Confirm the invoice arrived and remind the client of the upcoming due date. Attach the PDF.",
      },
      {
        title: "Day 0: Due-date notice",
        description:
          "State that payment is due today. Ask if anything is blocking accounts payable.",
      },
      {
        title: "Day 7: First overdue follow-up",
        description:
          "Reference invoice number, amount, and original due date. Request a payment ETA.",
      },
      {
        title: "Day 14: Firm follow-up",
        description:
          "Note the invoice is two weeks overdue. Mention late-fee policy if your contract includes one.",
      },
      {
        title: "Day 21–30: Final notice",
        description:
          "Set a hard deadline, pause new work, and CC the project sponsor or finance lead.",
      },
    ],
  },
  sections: [
    {
      id: "principles",
      heading: "Principles for overdue invoice emails",
      list: [
        "Reference the specific invoice number, amount, and due date every time",
        "Assume good intent - the invoice may be stuck in accounts payable",
        "Escalate tone gradually over 2–3 weeks, not in the first email",
        "Attach the original invoice PDF to every message",
        "Keep emails short - busy clients skim, not read essays",
        "CC the project sponsor if the billing contact is unresponsive",
      ],
    },
    {
      id: "template-1",
      heading: "Template 1: Friendly pre-due reminder (3 days before)",
      paragraphs: [
        "Subject: Reminder - Invoice #[NUMBER] due [DATE]",
        "",
        "Hi [Name],",
        "",
        "Hope you're well. A quick heads-up that Invoice #[NUMBER] for [PROJECT/SERVICE] - amount [CURRENCY][AMOUNT] - is due on [DATE].",
        "",
        "I've attached the invoice for convenience. Please let me know if you need anything from my side to process payment.",
        "",
        "Thank you,",
        "[Your name]",
      ],
    },
    {
      id: "template-2",
      heading: "Template 2: Due-date reminder (day of)",
      paragraphs: [
        "Subject: Invoice #[NUMBER] due today - [CURRENCY][AMOUNT]",
        "",
        "Hi [Name],",
        "",
        "Invoice #[NUMBER] for [PROJECT/SERVICE] is due today ([DATE]). Total: [CURRENCY][AMOUNT].",
        "",
        "Payment details are on the attached invoice. Happy to resend bank details if helpful.",
        "",
        "Best,",
        "[Your name]",
      ],
    },
    {
      id: "template-3",
      heading: "Template 3: Polite overdue notice (+3 days)",
      paragraphs: [
        "Subject: Overdue - Invoice #[NUMBER] ([CURRENCY][AMOUNT])",
        "",
        "Hi [Name],",
        "",
        "I wanted to follow up on Invoice #[NUMBER], which was due on [DATE] and remains outstanding. The balance is [CURRENCY][AMOUNT].",
        "",
        "Could you confirm when payment will be processed? If there is a blocker on your end, I'm happy to help resolve it.",
        "",
        "Invoice attached for reference.",
        "",
        "Thank you,",
        "[Your name]",
      ],
    },
    {
      id: "template-4",
      heading: "Template 4: Firm follow-up (+7 days overdue)",
      paragraphs: [
        "Subject: Second notice - Invoice #[NUMBER] now 7 days overdue",
        "",
        "Hi [Name],",
        "",
        "I'm following up again on Invoice #[NUMBER] for [CURRENCY][AMOUNT], originally due [DATE]. Per our agreement, payment was due within [NET TERMS] of the invoice date.",
        "",
        "Please arrange payment by [NEW DEADLINE - e.g. 5 business days] or let me know if there is a dispute I should address.",
        "",
        "Regards,",
        "[Your name]",
      ],
    },
    {
      id: "template-5",
      heading: "Template 5: Final notice before late fees (+14 days)",
      paragraphs: [
        "Subject: Final notice - Invoice #[NUMBER] - late fee may apply",
        "",
        "Hi [Name],",
        "",
        "This is a final reminder that Invoice #[NUMBER] ([CURRENCY][AMOUNT]) is now [X] days overdue. Per our contract (Section [X]), a late fee of [X%] per month may apply to balances unpaid after [X] days.",
        "",
        "Please remit payment by [DEADLINE] to avoid additional charges. If payment has already been sent, please share the transaction reference so I can reconcile.",
        "",
        "Sincerely,",
        "[Your name]",
      ],
      note: "Only reference late fees if your contract includes them. Late fee enforceability varies by jurisdiction.",
    },
    {
      id: "tips",
      heading: "Tips that improve response rates",
      list: [
        "Send emails Tuesday–Thursday mornings in the client's timezone",
        "Use the client's accounts payable email when you have it",
        "Include your payment details in the email body, not only the PDF",
        "Log every follow-up date in your invoice tracker",
        "If no response after 3 emails, call the project sponsor directly",
      ],
    },
  ],
};
