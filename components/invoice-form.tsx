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

export function InvoiceForm({ invoice, onChange }: InvoiceFormProps) {
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

  const updatePayment = (field: keyof Invoice["payment"], value: string) => {
    onChange({ ...invoice, payment: { ...invoice.payment, [field]: value } });
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

  const handleImageUpload = (
    field: "logo" | "signature",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...invoice,
        company: {
          ...invoice.company,
          [field]: reader.result as string,
        },
      });
    };
    reader.readAsDataURL(file);
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("logo", e)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="signature">Signature</Label>
            <Input
              id="signature"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("signature", e)}
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
                <div className="space-y-2 sm:col-span-5">
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
                  <Label>Price (₹)</Label>
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
                <div className="flex items-end sm:col-span-2">
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
              id="gst"
              checked={invoice.taxDiscount.gstEnabled}
              onCheckedChange={(checked) =>
                onChange({
                  ...invoice,
                  taxDiscount: { ...invoice.taxDiscount, gstEnabled: checked },
                })
              }
            />
            <Label htmlFor="gst">Enable GST</Label>
          </div>
          {invoice.taxDiscount.gstEnabled && (
            <div className="space-y-2">
              <Label htmlFor="gstPercent">GST %</Label>
              <Input
                id="gstPercent"
                type="number"
                min={0}
                max={100}
                className="w-24"
                value={invoice.taxDiscount.gstPercentage}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    taxDiscount: {
                      ...invoice.taxDiscount,
                      gstPercentage: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (₹)</Label>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="HDFC Bank"
              value={invoice.payment.bankName}
              onChange={(e) => updatePayment("bankName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="XXXX XXXX XXXX"
              value={invoice.payment.accountNumber}
              onChange={(e) => updatePayment("accountNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="name@upi"
              value={invoice.payment.upiId}
              onChange={(e) => updatePayment("upiId", e.target.value)}
            />
          </div>
        </div>
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
