"use client";

import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { createEmptyService } from "@/data/defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getCurrencySymbol } from "@/lib/currency";
import { uploadInvoiceAssetAction } from "@/lib/actions/profile-assets";
import { AssetFileField } from "@/components/asset-file-field";
import { PaymentFieldsForm } from "@/components/payment-fields-form";
import { sanitizePaymentForCountry } from "@/lib/country";
import type { AssetKind } from "@/lib/supabase/asset-storage";
import { toast } from "sonner";

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

function FormSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function taxEnabled(invoice: Invoice): boolean {
  return (
    invoice.taxDiscount.taxEnabled ?? invoice.taxDiscount.gstEnabled ?? false
  );
}

function taxPercent(invoice: Invoice): number {
  return (
    invoice.taxDiscount.taxPercentage ??
    invoice.taxDiscount.gstPercentage ??
    0
  );
}

export function InvoiceForm({ invoice, onChange }: InvoiceFormProps) {
  const currencySymbol = getCurrencySymbol(invoice.currencyCode);
  const taxLabel = invoice.taxLabel;

  const update = (partial: Partial<Invoice>) => {
    onChange({ ...invoice, ...partial });
  };

  const updateClient = (field: keyof Invoice["client"], value: string) => {
    onChange({ ...invoice, client: { ...invoice.client, [field]: value } });
  };

  const updateInvoiceDetails = (
    field: keyof Invoice["invoice"],
    value: string
  ) => {
    onChange({
      ...invoice,
      invoice: { ...invoice.invoice, [field]: value },
    });
  };

  const countryCode = invoice.company.countryCode;

  const updatePayment = (payment: Invoice["payment"]) => {
    onChange({ ...invoice, payment });
  };

  const updateService = (
    id: string,
    field: keyof Invoice["services"][0],
    value: string | number
  ) => {
    onChange({
      ...invoice,
      services: invoice.services.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const addService = () => {
    onChange({
      ...invoice,
      services: [...invoice.services, createEmptyService()],
    });
  };

  const removeService = (id: string) => {
    if (invoice.services.length <= 1) return;
    onChange({
      ...invoice,
      services: invoice.services.filter((s) => s.id !== id),
    });
  };

  const handleDescriptionPaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
    serviceId: string
  ) => {
    const html = e.clipboardData.getData("text/html");
    if (!html) return;

    e.preventDefault();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const blocks = new Set([
      "p",
      "div",
      "section",
      "article",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "pre",
    ]);

    const parts: string[] = [];

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        parts.push(node.textContent ?? "");
        return;
      }

      if (!(node instanceof HTMLElement)) return;

      const tag = node.tagName.toLowerCase();

      if (tag === "br") {
        parts.push("\n");
        return;
      }

      if (tag === "li") {
        parts.push("• ");
      }

      node.childNodes.forEach(walk);

      if (blocks.has(tag)) {
        parts.push("\n");
      }
    };

    doc.body.childNodes.forEach(walk);

    const pasted = parts
      .join("")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const current = invoice.services.find((s) => s.id === serviceId)?.description ?? "";
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    const next = `${current.slice(0, start)}${pasted}${current.slice(end)}`;

    updateService(serviceId, "description", next);
  };

  const handleImageUpload = async (kind: AssetKind, file: File) => {
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);

    const result = await uploadInvoiceAssetAction(formData);

    if (!result.ok) {
      toast.error("Upload failed", { description: result.error });
      return null;
    }

    onChange({
      ...invoice,
      company: { ...invoice.company, [kind]: result.url },
    });
    return result.url;
  };

  return (
    <div className="space-y-6">
      <FormSection title="Status & Branding" delay={0}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Invoice Status</Label>
            <Select
              value={invoice.status}
              onValueChange={(v) =>
                update({ status: v as InvoiceStatus })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AssetFileField
            id="invoice-logo"
            label="Company Logo"
            kind="logo"
            imageUrl={invoice.company.logo}
            onUpload={handleImageUpload}
          />
          <div className="sm:col-span-2">
            <AssetFileField
              id="invoice-signature"
              label="Signature"
              kind="signature"
              imageUrl={invoice.company.signature}
              onUpload={handleImageUpload}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Client Details" delay={0.05}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="John Doe"
              value={invoice.client.name}
              onChange={(e) => updateClient("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              placeholder="john@company.com"
              value={invoice.client.email}
              onChange={(e) => updateClient("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone</Label>
            <Input
              id="clientPhone"
              placeholder="+91 98765 43210"
              value={invoice.client.phone}
              onChange={(e) => updateClient("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientCompany">Company</Label>
            <Input
              id="clientCompany"
              placeholder="Acme Inc."
              value={invoice.client.company}
              onChange={(e) => updateClient("company", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="clientAddress">Address</Label>
            <Textarea
              id="clientAddress"
              placeholder="Street, City, State, ZIP"
              value={invoice.client.address}
              onChange={(e) => updateClient("address", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Invoice Details" delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoice.invoiceNumber}
              onChange={(e) =>
                updateInvoiceDetails("invoiceNumber", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoice.invoice.invoiceDate}
              onChange={(e) =>
                updateInvoiceDetails("invoiceDate", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.invoice.dueDate}
              onChange={(e) => updateInvoiceDetails("dueDate", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Services" delay={0.15}>
        <div className="space-y-4">
          {invoice.services.map((service, index) => (
            <div key={service.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="grid gap-3 sm:grid-cols-12">
                <div className="space-y-2 sm:col-span-4">
                  <Label>Service Name</Label>
                  <Input
                    placeholder="Web Design"
                    value={service.name}
                    onChange={(e) =>
                      updateService(service.id, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={service.quantity}
                    onChange={(e) =>
                      updateService(
                        service.id,
                        "quantity",
                        Number(e.target.value) || 1
                      )
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-3">
                  <Label>Price ({currencySymbol})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={service.price}
                    onChange={(e) =>
                      updateService(
                        service.id,
                        "price",
                        Number(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="flex items-end sm:col-span-3 sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeService(service.id)}
                    disabled={invoice.services.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 sm:col-span-12">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Add a detailed description (scope, deliverables, timeline, revisions, etc.)"
                    value={service.description}
                    onChange={(e) =>
                      updateService(service.id, "description", e.target.value)
                    }
                    onPaste={(e) => handleDescriptionPaste(e, service.id)}
                    rows={5}
                    className="min-h-36 resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use line breaks to keep this easy to read in the invoice
                    preview and PDF.
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addService}>
            <Plus className="h-4 w-4" />
            Add More Items
          </Button>
        </div>
      </FormSection>

      <FormSection title="Tax & Discount" delay={0.2}>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch
              id="tax"
              checked={taxEnabled(invoice)}
              onCheckedChange={(checked) =>
                onChange({
                  ...invoice,
                  taxDiscount: {
                    ...invoice.taxDiscount,
                    taxEnabled: checked,
                    gstEnabled: checked,
                  },
                })
              }
            />
            <Label htmlFor="tax">Enable {taxLabel}</Label>
          </div>
          {taxEnabled(invoice) && (
            <div className="space-y-2">
              <Label htmlFor="taxPercent">{taxLabel} %</Label>
              <Input
                id="taxPercent"
                type="number"
                min={0}
                max={100}
                className="w-24"
                value={taxPercent(invoice)}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    taxDiscount: {
                      ...invoice.taxDiscount,
                      taxPercentage: Number(e.target.value) || 0,
                      gstPercentage: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount ({currencySymbol})</Label>
            <Input
              id="discount"
              type="number"
              min={0}
              className="w-32"
              value={invoice.taxDiscount.discount}
              onChange={(e) =>
                onChange({
                  ...invoice,
                  taxDiscount: {
                    ...invoice.taxDiscount,
                    discount: Number(e.target.value) || 0,
                  },
                })
              }
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Payment Details" delay={0.25}>
        <PaymentFieldsForm
          countryCode={countryCode}
          payment={sanitizePaymentForCountry(invoice.payment, countryCode)}
          onChange={updatePayment}
          idPrefix="invoice-pay"
        />
      </FormSection>

      <FormSection title="Notes" delay={0.3}>
        <Textarea
          placeholder="Additional notes for the client..."
          value={invoice.notes}
          onChange={(e) => update({ notes: e.target.value })}
          rows={4}
        />
      </FormSection>
    </div>
  );
}
