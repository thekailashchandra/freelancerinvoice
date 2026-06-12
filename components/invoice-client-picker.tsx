"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronRight, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  createClientClient,
  signOutClient,
  uploadInvoiceAssetClient,
  uploadProfileAssetClient,
} from "@/lib/api/app-client";
import {
  savedClientToClientDetails,
  type SavedClient,
} from "@/lib/client-mapper";
import type { ClientDetails } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CustomerType = "individual" | "company";

const emptyForm = (): ClientDetails => ({
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  gstin: "",
});

function clientLabel(client: SavedClient): string {
  if (client.company) return `${client.name} · ${client.company}`;
  return client.name;
}

function matchesQuery(client: SavedClient, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [client.name, client.company, client.email, client.phone]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

type NewCustomerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (client: SavedClient) => void;
  initialName?: string;
};

export function NewCustomerDialog({
  open,
  onOpenChange,
  onCreated,
  initialName = "",
}: NewCustomerDialogProps) {
  const [customerType, setCustomerType] = useState<CustomerType>("individual");
  const [form, setForm] = useState<ClientDetails>(() => ({
    ...emptyForm(),
    name: initialName,
  }));
  const [showAddress, setShowAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  const reset = (name = "") => {
    setCustomerType("individual");
    setForm({ ...emptyForm(), name });
    setShowAddress(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    else reset(initialName);
    onOpenChange(next);
  };

  const updateField = (field: keyof ClientDetails, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) {
      toast.error("Customer name is required");
      return;
    }
    if (customerType === "company" && !form.company.trim()) {
      toast.error("Company name is required for business customers");
      return;
    }

    setSaving(true);
    try {
      const created = await createClientClient({
        ...form,
        name,
        company: form.company.trim(),
      });
      toast.success("Customer saved");
      onCreated(created);
      handleOpenChange(false);
    } catch (err) {
      toast.error("Could not save customer", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4 text-left">
          <DialogTitle>New customer</DialogTitle>
          <DialogDescription>
            Save customer details to reuse on future invoices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="customer-type">Type</Label>
            <Select
              value={customerType}
              onValueChange={(value) => setCustomerType(value as CustomerType)}
            >
              <SelectTrigger id="customer-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-name">
              {customerType === "company" ? "Contact name" : "Full name"}
            </Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          {customerType === "company" && (
            <div className="space-y-2">
              <Label htmlFor="customer-company">Company name</Label>
              <Input
                id="customer-company"
                placeholder="Enter company name"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customer-email">Email (optional)</Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone (optional)</Label>
            <Input
              id="customer-phone"
              type="tel"
              placeholder="Enter phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/40"
            onClick={() => setShowAddress((v) => !v)}
          >
            <span>
              <span className="font-medium">Billing address</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Optional — street, city, state, country
              </span>
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                showAddress && "rotate-90"
              )}
              aria-hidden
            />
          </button>

          {showAddress && (
            <Textarea
              placeholder="Street, city, state, country"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              rows={3}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="customer-gstin">GSTIN (optional)</Label>
            <Input
              id="customer-gstin"
              placeholder="Client GSTIN"
              value={form.gstin ?? ""}
              onChange={(e) => updateField("gstin", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            Save customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type InvoiceCustomerSectionProps = {
  clients: SavedClient[];
  selectedClientId?: string | null;
  currentClient: ClientDetails;
  onSelectClient: (client: ClientDetails, clientId: string | null) => void;
  onClientsChange: (clients: SavedClient[]) => void;
  onEditClientField?: (field: keyof ClientDetails, value: string) => void;
  showInlineFields?: boolean;
  /** Wider inputs and spacing on the create-invoice page */
  relaxed?: boolean;
};

export function InvoiceCustomerSection({
  clients,
  selectedClientId,
  currentClient,
  onSelectClient,
  onClientsChange,
  onEditClientField,
  showInlineFields = false,
  relaxed = false,
}: InvoiceCustomerSectionProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandDetails, setExpandDetails] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recentClients = useMemo(() => clients.slice(0, 5), [clients]);

  const filteredClients = useMemo(
    () => clients.filter((c) => matchesQuery(c, query)),
    [clients, query]
  );

  const selectedClient = selectedClientId
    ? clients.find((c) => c.id === selectedClientId)
    : null;

  const hasClientDetails =
    !!currentClient.name.trim() ||
    !!currentClient.email.trim() ||
    !!currentClient.company.trim();

  const showDropdown =
    focused && (query.length > 0 || filteredClients.length > 0);

  const pickClient = (client: SavedClient) => {
    setQuery("");
    setFocused(false);
    onSelectClient(savedClientToClientDetails(client), client.id);
  };

  const clearSelection = () => {
    setQuery("");
    onSelectClient(
      {
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        gstin: "",
      },
      null
    );
  };

  const handleCreated = (client: SavedClient) => {
    const next = [...clients, client].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    onClientsChange(next);
    pickClient(client);
  };

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(true);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setFocused(false), 150);
  };

  return (
    <section
      className={cn(relaxed ? "space-y-4" : "space-y-3")}
      aria-labelledby="customer-section-heading"
    >
      <h3
        id="customer-section-heading"
        className={cn(
          "font-semibold tracking-tight",
          relaxed ? "text-base" : "text-sm"
        )}
      >
        Customer
      </h3>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="customer-search"
          placeholder="Find or add a customer"
          value={selectedClient && !focused ? clientLabel(selectedClient) : query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedClientId) {
              onSelectClient(currentClient, null);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn("pl-9", relaxed && "h-11")}
          autoComplete="off"
        />
        {showDropdown && (
          <ul
            className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-popover py-1 shadow-md"
            role="listbox"
          >
            {filteredClients.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No customers found
              </li>
            ) : (
              filteredClients.map((client) => (
                <li key={client.id} role="option">
                  <button
                    type="button"
                    className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickClient(client)}
                  >
                    <span className="font-medium">{clientLabel(client)}</span>
                    {client.email ? (
                      <span className="text-xs text-muted-foreground">
                        {client.email}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
            {query.trim() && (
              <li>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm font-medium text-primary hover:bg-muted"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setFocused(false);
                    setDialogOpen(true);
                  }}
                >
                  Add &ldquo;{query.trim()}&rdquo; as new customer
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      <div
        className={cn(
          "rounded-xl border border-dashed border-border/80 bg-muted/10",
          relaxed ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Recents
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-primary hover:text-primary"
            onClick={() => setDialogOpen(true)}
          >
            Add customer
          </Button>
        </div>

        {recentClients.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No recent customers
          </p>
        ) : (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {recentClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => pickClient(client)}
                className={cn(
                  "max-w-[14rem] shrink-0 truncate rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:max-w-none",
                  selectedClientId === client.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                {clientLabel(client)}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasClientDetails && (
        <div
          className={cn(
            "rounded-xl border border-border bg-muted/20",
            relaxed ? "p-5" : "p-4"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 text-sm">
              <p className="font-semibold">
                {currentClient.company || currentClient.name}
              </p>
              {currentClient.company && currentClient.name ? (
                <p className="text-muted-foreground">{currentClient.name}</p>
              ) : null}
              {currentClient.email ? (
                <p className="text-muted-foreground">{currentClient.email}</p>
              ) : null}
              {currentClient.phone ? (
                <p className="text-muted-foreground">{currentClient.phone}</p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={clearSelection}
              aria-label="Clear customer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="mt-1 h-auto px-0 text-xs"
            onClick={() => setExpandDetails((v) => !v)}
          >
            {expandDetails ? "Hide details" : "Edit billing details"}
          </Button>
        </div>
      )}

      {(showInlineFields || expandDetails) && onEditClientField && (
        <div
          className={cn(
            "rounded-xl border border-border/60 bg-muted/10",
            relaxed ? "space-y-4 p-5" : "space-y-3 p-4"
          )}
        >
          <Input
            className={relaxed ? "h-11" : undefined}
            placeholder="Client or contact name"
            value={currentClient.name}
            onChange={(e) => onEditClientField("name", e.target.value)}
          />
          <Input
            className={relaxed ? "h-11" : undefined}
            placeholder="Company (optional)"
            value={currentClient.company}
            onChange={(e) => onEditClientField("company", e.target.value)}
          />
          <Input
            className={relaxed ? "h-11" : undefined}
            type="email"
            placeholder="Email address"
            value={currentClient.email}
            onChange={(e) => onEditClientField("email", e.target.value)}
          />
          <Input
            className={relaxed ? "h-11" : undefined}
            type="tel"
            placeholder="Phone"
            value={currentClient.phone}
            onChange={(e) => onEditClientField("phone", e.target.value)}
          />
          <Textarea
            placeholder="Billing address"
            value={currentClient.address}
            onChange={(e) => onEditClientField("address", e.target.value)}
            rows={2}
          />
          <Input
            className={relaxed ? "h-11" : undefined}
            placeholder="Client GSTIN (optional)"
            value={currentClient.gstin ?? ""}
            onChange={(e) => onEditClientField("gstin", e.target.value)}
          />
        </div>
      )}

      <NewCustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
        initialName={query.trim()}
      />
    </section>
  );
}

/** @deprecated Use InvoiceCustomerSection */
export const InvoiceClientPicker = InvoiceCustomerSection;
