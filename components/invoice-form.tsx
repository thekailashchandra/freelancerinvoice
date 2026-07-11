"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Loader2, Plus, Upload, X } from "lucide-react";
import type { CompanySettings, Invoice, InvoiceStatus } from "@/types/invoice";
import { createEmptyService } from "@/data/defaults";
import { calculateTotals, isIndianGstInvoice } from "@/lib/calculations";
import { formatMoney, getCurrencySymbol } from "@/lib/currency";
import { formatInvoiceMoney } from "@/lib/currency-display";
import { uploadInvoiceAssetClient } from "@/lib/api/app-client";
import { PaymentFieldsForm } from "@/components/payment-fields-form";
import { CurrencySelect } from "@/components/currency-select";
import { InvoiceCustomerSection } from "@/components/invoice-client-picker";
import type { SavedClient } from "@/lib/client-mapper";
import { sanitizePaymentForCountry } from "@/lib/country";
import { invoicePageSpecs, resolveLogoHeight } from "@/lib/invoice-design";
import type { InvoicePageSize } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
  /** Guest landing mode — logo uploads stay in-browser (no account). */
  guestMode?: boolean;
  savedClients?: SavedClient[];
  onClientsChange?: (clients: SavedClient[]) => void;
  /** Logged-in create page — customer first, compact layout */
  createFlow?: boolean;
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

function DetailBox({
  title,
  description,
  children,
  relaxed = false,
}: {
  title: string;
  description?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  relaxed?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/20",
        relaxed ? "p-5 sm:p-6" : "rounded-lg p-4"
      )}
    >
      <div className={cn(relaxed ? "mb-4" : "mb-3")}>
        <h3
          className={cn(
            "font-semibold tracking-tight",
            relaxed ? "text-base" : "text-sm font-medium"
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className={cn(relaxed ? "space-y-4" : "space-y-3")}>{children}</div>
    </div>
  );
}

export function InvoiceForm({
  invoice,
  onChange,
  guestMode = false,
  savedClients = [],
  onClientsChange,
  createFlow = false,
}: InvoiceFormProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const isLoggedInCreate = createFlow && !guestMode && !!onClientsChange;
  const isGuestRelaxed = guestMode && !createFlow;
  const fieldClass = isLoggedInCreate || isGuestRelaxed ? "h-11" : undefined;

  const currency = invoice.currencyCode;
  const currencySymbol = getCurrencySymbol(currency);
  const taxLabel = invoice.taxLabel;
  const countryCode = invoice.company.countryCode;

  const totals = calculateTotals(
    invoice.services,
    invoice.taxDiscount,
    taxLabel
  );
  const showGstSplit = isIndianGstInvoice(taxLabel);
  const gstSupplyType = invoice.taxDiscount.gstSupplyType ?? "intra";

  const update = (partial: Partial<Invoice>) => {
    onChange({ ...invoice, ...partial });
  };

  const updateClient = (field: keyof Invoice["client"], value: string) => {
    onChange({
      ...invoice,
      clientId: null,
      client: { ...invoice.client, [field]: value },
    });
  };

  const handleSelectClient = (
    client: Invoice["client"],
    clientId: string | null
  ) => {
    onChange({ ...invoice, client, clientId });
  };

  const updateCompany = (
    field: keyof CompanySettings,
    value: string | number | null
  ) => {
    onChange({
      ...invoice,
      company: { ...invoice.company, [field]: value },
    });
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

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      if (guestMode) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Could not read image file"));
          reader.readAsDataURL(file);
        });
        updateCompany("logo", dataUrl);
        toast.success("Logo added");
        return;
      }

      const formData = new FormData();
      formData.set("kind", "logo");
      formData.set("file", file);
      const result = await uploadInvoiceAssetClient(formData);
      if (!result.ok) {
        toast.error("Upload failed", { description: result.error });
        return;
      }
      updateCompany("logo", result.url);
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoDelete = () => {
    updateCompany("logo", null);
    toast.success("Logo removed");
  };

  const lineItemsBlock = (
    <div
      className={cn(
        "rounded-xl bg-muted/40",
        isLoggedInCreate ? "p-5 md:p-6" : isGuestRelaxed ? "p-5 md:p-6" : "p-4 md:p-5"
      )}
    >
      <div className={cn(isLoggedInCreate || isGuestRelaxed ? "space-y-5" : "space-y-4")}>
        {invoice.services.map((service) => {
          const lineTotal = service.quantity * service.price;
          return (
            <article
              key={service.id}
              className={cn(
                "rounded-xl border border-border/50 bg-background/60",
                isLoggedInCreate || isGuestRelaxed ? "p-5" : "p-4"
              )}
            >
              <div className="min-w-0 space-y-3">
                <Label className="text-xs text-muted-foreground">Item</Label>
                <Input
                  className={fieldClass}
                  placeholder="Product or service"
                  value={service.name}
                  onChange={(e) =>
                    updateService(service.id, "name", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={service.description}
                  onChange={(e) =>
                    updateService(service.id, "description", e.target.value)
                  }
                  rows={2}
                  className="min-h-[56px] resize-y text-sm"
                />
              </div>

              <div className="mt-3 space-y-3 sm:space-y-0">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-end sm:gap-2">
                  <div className="w-full shrink-0 sm:w-17">
                    <Label className="mb-1.5 block text-xs text-muted-foreground">
                      Qty
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      className="h-11 px-2 text-center tabular-nums sm:h-10"
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

                  <div className="min-w-0 flex-1">
                    <Label className="mb-1.5 block text-xs text-muted-foreground">
                      Rate
                    </Label>
                    <div className="flex h-11 min-w-0 overflow-hidden rounded-xl border border-input bg-background/50 shadow-sm sm:h-10">
                      <span className="flex w-9 shrink-0 items-center justify-center border-r border-input/60 text-xs text-muted-foreground">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        className="min-w-0 flex-1 border-0 bg-transparent px-2 text-right text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        value={service.price || ""}
                        onChange={(e) =>
                          updateService(
                            service.id,
                            "price",
                            Number(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <Label className="mb-1.5 block text-xs text-muted-foreground">
                      Amount
                    </Label>
                    <div className="flex h-11 min-w-0 items-center justify-end rounded-xl border border-input bg-muted/30 px-3 text-sm font-semibold tabular-nums sm:h-10">
                      <span className="truncate">
                        {formatInvoiceMoney(lineTotal, currency)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:h-10 sm:w-10"
                    onClick={() => removeService(service.id)}
                    disabled={invoice.services.length <= 1}
                    aria-label="Remove line item"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={addService}
          className="gap-2 rounded-full border-primary/40 bg-primary/10 px-6 text-primary hover:bg-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>
    </div>
  );

  const businessDetailsBlock = (
    <DetailBox
      title="Your business details"
      description={
        <>
          Loaded from your organization profile. Saved with each invoice and
          synced to{" "}
          <Link href="/settings" className="text-primary hover:underline">
            Settings
          </Link>
          .
        </>
      }
      relaxed
    >
      <div className="space-y-2">
        <Label htmlFor="companyName">Business name</Label>
        <Input
          id="companyName"
          className={fieldClass}
          placeholder="Your name or business name"
          value={invoice.company.companyName}
          onChange={(e) => updateCompany("companyName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyEmail">Email</Label>
        <Input
          id="companyEmail"
          className={fieldClass}
          type="email"
          placeholder="Email address"
          value={invoice.company.companyEmail}
          onChange={(e) => updateCompany("companyEmail", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyPhone">Phone</Label>
        <Input
          id="companyPhone"
          className={fieldClass}
          type="tel"
          placeholder="Phone"
          value={invoice.company.companyPhone}
          onChange={(e) => updateCompany("companyPhone", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyAddress">Address</Label>
        <Textarea
          id="companyAddress"
          placeholder="Street, city, state, country"
          value={invoice.company.companyAddress}
          onChange={(e) => updateCompany("companyAddress", e.target.value)}
          rows={3}
          className="min-h-[96px] resize-y"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyGstin">GSTIN (optional)</Label>
        <Input
          id="companyGstin"
          className={fieldClass}
          placeholder="Your GSTIN (optional)"
          value={invoice.company.gstin ?? ""}
          onChange={(e) => updateCompany("gstin", e.target.value)}
        />
      </div>
    </DetailBox>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className={cn(
          isLoggedInCreate
            ? "space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-7"
            : isGuestRelaxed
              ? "space-y-6 p-5 sm:p-6 lg:p-7"
              : "space-y-5 p-4 sm:p-5"
        )}
      >
        {isLoggedInCreate && businessDetailsBlock}

        {isLoggedInCreate && (
          <InvoiceCustomerSection
            clients={savedClients}
            selectedClientId={invoice.clientId}
            currentClient={invoice.client}
            onSelectClient={handleSelectClient}
            onClientsChange={onClientsChange}
            onEditClientField={updateClient}
            relaxed
          />
        )}

        {isLoggedInCreate && (
          <section aria-labelledby="items-section-heading">
            <h3
              id="items-section-heading"
              className="mb-4 text-base font-semibold tracking-tight"
            >
              Items
            </h3>
            {lineItemsBlock}
          </section>
        )}

        {!isLoggedInCreate && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoice.invoiceNumber}
                onChange={(e) =>
                  updateInvoiceDetails("invoiceNumber", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={invoice.status}
                onValueChange={(v) => update({ status: v as InvoiceStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {!isLoggedInCreate && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label>Logo</Label>
            {invoice.company.logo ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive"
                onClick={handleLogoDelete}
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </Button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-8 transition-colors hover:bg-primary/10"
          >
            {uploadingLogo ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : invoice.company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.company.logo}
                alt="Logo"
                className="max-h-20 max-w-[280px] object-contain"
              />
            ) : (
              <>
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-foreground">
                  Upload logo
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, WebP under 5MB
                </span>
              </>
            )}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleLogoUpload(file);
              e.target.value = "";
            }}
          />
        </div>
        )}

        {!isLoggedInCreate && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="logoHeight">Logo size</Label>
              <span className="text-xs text-muted-foreground">
                {resolveLogoHeight(invoice.company.logoHeight)}px
              </span>
            </div>
            <input
              id="logoHeight"
              type="range"
              min={32}
              max={200}
              step={4}
              value={resolveLogoHeight(invoice.company.logoHeight)}
              onChange={(e) =>
                updateCompany("logoHeight", Number(e.target.value))
              }
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </div>
          <div className="space-y-2">
            <Label>Paper size</Label>
            <Select
              value={invoice.pageSize ?? "a4"}
              onValueChange={(v) =>
                update({ pageSize: v as InvoicePageSize })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">{invoicePageSpecs.a4.label}</SelectItem>
                <SelectItem value="letter">
                  {invoicePageSpecs.letter.label}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        )}

        {/* From / To */}
        {!isLoggedInCreate && (
        <div className="grid gap-4 lg:grid-cols-2">
          <DetailBox title="Your details" badge="From">
            <Input
              placeholder="Your name or business name"
              value={invoice.company.companyName}
              onChange={(e) => updateCompany("companyName", e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email address"
              value={invoice.company.companyEmail}
              onChange={(e) => updateCompany("companyEmail", e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={invoice.company.companyPhone}
              onChange={(e) => updateCompany("companyPhone", e.target.value)}
            />
            <Textarea
              placeholder="Street, city, state, country"
              value={invoice.company.companyAddress}
              onChange={(e) => updateCompany("companyAddress", e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Your GSTIN (optional)"
              value={invoice.company.gstin ?? ""}
              onChange={(e) => updateCompany("gstin", e.target.value)}
            />
          </DetailBox>

          <DetailBox title="Client's details" badge="To">
            {!guestMode && onClientsChange && (
              <InvoiceCustomerSection
                clients={savedClients}
                selectedClientId={invoice.clientId}
                currentClient={invoice.client}
                onSelectClient={handleSelectClient}
                onClientsChange={onClientsChange}
                onEditClientField={updateClient}
                showInlineFields
              />
            )}
            <Input
              placeholder="Client or company name"
              value={invoice.client.name}
              onChange={(e) => updateClient("name", e.target.value)}
            />
            <Input
              placeholder="Company (optional)"
              value={invoice.client.company}
              onChange={(e) => updateClient("company", e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email address"
              value={invoice.client.email}
              onChange={(e) => updateClient("email", e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={invoice.client.phone}
              onChange={(e) => updateClient("phone", e.target.value)}
            />
            <Textarea
              placeholder="Street, city, state, country"
              value={invoice.client.address}
              onChange={(e) => updateClient("address", e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Client GSTIN (optional)"
              value={invoice.client.gstin ?? ""}
              onChange={(e) => updateClient("gstin", e.target.value)}
            />
          </DetailBox>
        </div>
        )}

        {isLoggedInCreate && (
          <h3 className="text-base font-semibold tracking-tight">
            Invoice details
          </h3>
        )}

        {/* Dates, currency & invoice meta */}
        <div
          className={cn(
            "grid gap-4 sm:grid-cols-2",
            isLoggedInCreate ? "lg:grid-cols-4 lg:gap-5" : "lg:grid-cols-3"
          )}
        >
          {isLoggedInCreate && (
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label>Paper size</Label>
              <Select
                value={invoice.pageSize ?? "a4"}
                onValueChange={(v) =>
                  update({ pageSize: v as InvoicePageSize })
                }
              >
                <SelectTrigger className={fieldClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">{invoicePageSpecs.a4.label}</SelectItem>
                  <SelectItem value="letter">
                    {invoicePageSpecs.letter.label}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {!isLoggedInCreate && (
          <div className="space-y-2">
            <Label>Currency</Label>
            <CurrencySelect
              value={currency}
              onValueChange={(code) => update({ currencyCode: code })}
            />
          </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice date</Label>
            <Input
              id="invoiceDate"
              className={fieldClass}
              type="date"
              value={invoice.invoice.invoiceDate}
              onChange={(e) =>
                updateInvoiceDetails("invoiceDate", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              className={fieldClass}
              type="date"
              value={invoice.invoice.dueDate}
              onChange={(e) => updateInvoiceDetails("dueDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment terms</Label>
            <Input
              id="paymentTerms"
              className={fieldClass}
              placeholder="Due on receipt"
              value={invoice.invoice.paymentTerms ?? ""}
              onChange={(e) =>
                updateInvoiceDetails("paymentTerms", e.target.value)
              }
            />
          </div>
        </div>

        {!isLoggedInCreate && lineItemsBlock}

        {/* Notes + totals */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Thanks for your business."
                value={invoice.notes}
                onChange={(e) => update({ notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">Terms &amp; conditions</Label>
              <Textarea
                id="termsAndConditions"
                placeholder="Optional legal or payment terms for the client."
                value={invoice.termsAndConditions ?? ""}
                onChange={(e) =>
                  update({ termsAndConditions: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
              <Label className="text-sm font-semibold text-primary">
                Bank account details
              </Label>
              <PaymentFieldsForm
                countryCode={countryCode}
                payment={sanitizePaymentForCountry(invoice.payment, countryCode)}
                onChange={updatePayment}
                idPrefix="invoice-pay"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Invoice summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold tabular-nums">
                {formatMoney(totals.subtotal, currency)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
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
                  <Label htmlFor="tax" className="text-muted-foreground">
                    {taxLabel} %
                  </Label>
                </div>
                {taxEnabled(invoice) ? (
                  <Input
                    id="taxPercent"
                    type="number"
                    min={0}
                    max={100}
                    className="h-8 w-20 text-right tabular-nums"
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
                ) : (
                  <span className="font-semibold tabular-nums">-</span>
                )}
              </div>

              {showGstSplit && taxEnabled(invoice) && (
                <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3">
                  <Label className="text-xs text-muted-foreground">
                    Invoice type (GST)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={gstSupplyType === "intra" ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() =>
                        onChange({
                          ...invoice,
                          taxDiscount: {
                            ...invoice.taxDiscount,
                            gstSupplyType: "intra",
                          },
                        })
                      }
                    >
                      Intra-state (CGST + SGST)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={gstSupplyType === "inter" ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() =>
                        onChange({
                          ...invoice,
                          taxDiscount: {
                            ...invoice.taxDiscount,
                            gstSupplyType: "inter",
                          },
                        })
                      }
                    >
                      Inter-state (IGST)
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {taxEnabled(invoice) && totals.gstBreakdown?.type === "intra" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    CGST ({totals.gstBreakdown.cgst?.rate.toFixed(1)}%)
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatMoney(totals.gstBreakdown.cgst?.amount ?? 0, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    SGST ({totals.gstBreakdown.sgst?.rate.toFixed(1)}%)
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatMoney(totals.gstBreakdown.sgst?.amount ?? 0, currency)}
                  </span>
                </div>
              </>
            )}
            {taxEnabled(invoice) && totals.gstBreakdown?.type === "inter" && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  IGST ({totals.gstBreakdown.igst?.rate.toFixed(1)}%)
                </span>
                <span className="font-semibold tabular-nums">
                  {formatMoney(totals.gstBreakdown.igst?.amount ?? 0, currency)}
                </span>
              </div>
            )}
            {taxEnabled(invoice) &&
              !totals.gstBreakdown &&
              totals.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total tax</span>
                  <span className="font-semibold tabular-nums">
                    {formatMoney(totals.taxAmount, currency)}
                  </span>
                </div>
              )}

            <div className="flex items-center justify-between gap-3 text-sm">
              <Label htmlFor="discount" className="text-muted-foreground">
                Discount ({currencySymbol})
              </Label>
              <Input
                id="discount"
                type="number"
                min={0}
                className="h-8 w-28 text-right"
                value={invoice.taxDiscount.discount || ""}
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

            <div className="flex items-center justify-between gap-3 text-sm">
              <Label htmlFor="shipping" className="text-muted-foreground">
                Shipping fee
              </Label>
              <Input
                id="shipping"
                type="number"
                min={0}
                className="h-8 w-28 text-right"
                value={invoice.taxDiscount.shippingFee || ""}
                onChange={(e) =>
                  onChange({
                    ...invoice,
                    taxDiscount: {
                      ...invoice.taxDiscount,
                      shippingFee: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>

            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">
                {formatMoney(totals.total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
