"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/invoice-form";
import { PageTransition } from "@/components/page-transition";
import {
  InvoicePdfDialog,
  type InvoicePdfDialogPhase,
} from "@/components/invoice-pdf-dialog";
import { InvoiceTemplatePicker } from "@/components/invoice-template-picker";
import { RemoveBrandingDialog } from "@/components/remove-branding-dialog";
import { ExportLockBanner } from "@/components/export-lock-banner";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { useInvoiceBrandingRemoval } from "@/hooks/use-invoice-branding-removal";
import { useSubscriptionCheckout } from "@/hooks/use-subscription-checkout";
import type { MarketRegion } from "@/lib/geo-market";
import type { InvoiceTemplateId } from "@/lib/invoice-templates";
import {
  canExportWithAccess,
  type SubscriptionAccess,
} from "@/lib/subscription";
import { CurrencySelect } from "@/components/currency-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createDefaultInvoice } from "@/data/defaults";
import { saveInvoiceClient } from "@/lib/api/invoices-client";
import { trackActivity } from "@/lib/activity-client";
import { updateProfileClient } from "@/lib/api/profile-client";
import { mergeProfileIntoInvoice } from "@/lib/invoice-mapper";
import { invoiceActionState } from "@/lib/invoice-actions";
import { deriveInvoiceStatus } from "@/lib/calculations";
import type { CompanySettings, Invoice } from "@/types/invoice";
import type { SavedClient } from "@/lib/client-mapper";
import Link from "next/link";
import { InvoicePreviewFrame } from "@/components/invoice-preview-frame";
import { InvoicePreview } from "@/components/invoice-preview";
import { printInvoice } from "@/lib/invoice-print";
import { cn } from "@/lib/utils";

type MobileCreateTab = "edit" | "preview";

type CreateInvoiceClientProps = {
  editId: string | null;
  initialSettings: CompanySettings | null;
  initialInvoice: Invoice | null;
  initialClients: SavedClient[];
  subscription: SubscriptionAccess;
};

function buildInitialInvoice(
  settings: CompanySettings | null,
  existing: Invoice | null
): Invoice | null {
  if (existing) return existing;
  return null;
}

export function CreateInvoiceClient({
  editId,
  initialSettings,
  initialInvoice,
  initialClients,
  subscription,
}: CreateInvoiceClientProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(() =>
    buildInitialInvoice(initialSettings, initialInvoice)
  );
  const [savedClients, setSavedClients] = useState(initialClients);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfDialogPhase, setPdfDialogPhase] =
    useState<InvoicePdfDialogPhase>("generating");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileCreateTab>("edit");

  const market: MarketRegion =
    initialSettings?.countryCode === "IN" ? "IN" : "GLOBAL";

  const {
    hideBranding,
    dialogOpen: brandingDialogOpen,
    setDialogOpen: setBrandingDialogOpen,
    requestRemoval: requestBrandingRemoval,
    confirmKofiRemoval,
    confirming: brandingConfirming,
    pricing: brandingPricing,
  } = useInvoiceBrandingRemoval(invoice, setInvoice);

  const canExport = canExportWithAccess(subscription);

  const {
    dialogOpen: upgradeDialogOpen,
    setDialogOpen: setUpgradeDialogOpen,
    openUpgrade,
    pay: payForSubscription,
    paying: payingSubscription,
    pricing: subscriptionPricing,
    reason: upgradeReason,
    interval: subscriptionInterval,
    setInterval: setSubscriptionInterval,
    checkoutAvailable,
    provider: checkoutProvider,
  } = useSubscriptionCheckout({
    market,
    checkoutAvailable: subscription.checkoutAvailable,
    dodoCheckoutAvailable: subscription.dodoCheckoutAvailable,
  });

  useEffect(() => {
    if (initialInvoice) return;
    if (!initialSettings) return;
    setInvoice((prev) => {
      if (prev) return prev;
      return mergeProfileIntoInvoice(
        createDefaultInvoice(initialSettings),
        initialSettings
      );
    });
  }, [initialInvoice, initialSettings]);

  const handleSave = useCallback(async () => {
    if (!invoice) return;

    if (!invoice.company.companyName.trim()) {
      toast.error("Business name is required", {
        description: "Add your business name at the top of the form.",
      });
      return;
    }

    setSaving(true);
    try {
      const { id } = await saveInvoiceClient(invoice);
      await updateProfileClient({
        companyName: invoice.company.companyName.trim(),
        companyEmail: invoice.company.companyEmail,
        companyPhone: invoice.company.companyPhone,
        companyAddress: invoice.company.companyAddress,
        logo: invoice.company.logo ?? null,
        logoHeight: invoice.company.logoHeight,
      });
      setInvoice((prev) => (prev ? { ...prev, id } : prev));
      toast.success("Invoice saved!", {
        description: `${invoice.invoice.invoiceNumber} synced to the cloud.`,
      });
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }, [invoice]);

  const handleDownloadPdf = async () => {
    if (!invoice) return;

    if (!canExport) {
      openUpgrade("download");
      return;
    }

    setMobileTab("preview");
    await new Promise((r) => setTimeout(r, 120));

    setExporting(true);
    setPdfError(null);
    setPdfDialogPhase("generating");
    setPdfDialogOpen(true);

    try {
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
      const { downloadInvoicePdf } = await import("@/lib/pdf");
      await downloadInvoicePdf(invoice, `${invoice.invoice.invoiceNumber}.pdf`, {
        previewId: "invoice-preview",
      });
      trackActivity({
        action: "invoice.pdf_downloaded",
        resourceType: "invoice",
        resourceId: invoice.id,
        metadata: { invoiceNumber: invoice.invoice.invoiceNumber },
      });
      setPdfDialogPhase("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setPdfError(message);
      setPdfDialogPhase("error");
      console.error("PDF export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const setTemplateId = (templateId: InvoiceTemplateId) => {
    setInvoice((prev) => (prev ? { ...prev, templateId } : prev));
  };

  const handlePrint = async () => {
    if (!invoice) return;

    if (!canExport) {
      openUpgrade("print");
      return;
    }

    setMobileTab("preview");
    await new Promise((r) => setTimeout(r, 120));

    toast.info("Opening print dialog…");
    try {
      await printInvoice({ previewId: "invoice-preview" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not open print dialog.";
      toast.error("Print failed", { description: message });
    }
  };

  if (!invoice) {
    return (
      <div className="@container mx-auto w-full max-w-[1600px]">
        <div className="flex flex-col gap-5 @min-[680px]:grid @min-[680px]:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] @min-[680px]:gap-6">
        <Skeleton className="h-[600px] rounded-2xl" />
        <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const displayStatus = deriveInvoiceStatus(
    invoice.status,
    invoice.invoice.dueDate
  );
  const { isLocked } = invoiceActionState(displayStatus);

  if (editId && isLocked) {
    return (
      <PageTransition className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-semibold">This invoice cannot be edited</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {displayStatus === "void"
            ? "Voided invoices are locked. View or download instead."
            : "Paid invoices are locked. View or download instead."}
        </p>
        <Button asChild className="mt-6">
          <Link href={`/invoice-history/${editId}`}>View invoice</Link>
        </Button>
      </PageTransition>
    );
  }

  const previewPanel = (
    <>
      <p className="mb-2 hidden text-xs font-medium uppercase tracking-wide text-muted-foreground @min-[680px]:block">
        Live preview
      </p>
      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-1 @min-[680px]:max-h-[calc(100vh-9rem)] @min-[680px]:overflow-y-auto sm:p-2">
        <InvoicePreviewFrame
          pageSize={invoice.pageSize}
          exportLocked={!canExport}
          maxScale={1}
        >
          <InvoicePreview
            invoice={invoice}
            onRemoveBranding={
              hideBranding
                ? undefined
                : canExport
                  ? requestBrandingRemoval
                  : () => openUpgrade("generic")
            }
          />
        </InvoicePreviewFrame>
      </div>
    </>
  );

  return (
    <PageTransition className="create-invoice-page mx-auto w-full max-w-[1600px] md:pb-0">
      <ExportLockBanner
        className="mb-3"
        billingEnabled={subscription.billingEnabled}
        active={subscription.active}
        pricing={subscriptionPricing}
        onUpgrade={() => openUpgrade("generic")}
      />
      <div className="sticky top-14 z-30 -mx-4 mb-4 space-y-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <Input
            value={invoice.invoice.invoiceNumber}
            onChange={(e) =>
              setInvoice({
                ...invoice,
                invoice: { ...invoice.invoice, invoiceNumber: e.target.value },
              })
            }
            className="h-10 min-w-0 flex-1 border-transparent bg-muted/50 font-semibold shadow-none focus-visible:border-border"
            aria-label="Invoice number"
          />
          <CurrencySelect
            value={invoice.currencyCode}
            onValueChange={(code) =>
              setInvoice({ ...invoice, currencyCode: code })
            }
            compact
            className="w-[7.5rem] shrink-0"
          />
        </div>
        <div
          className="grid grid-cols-2 gap-1 rounded-lg bg-muted/60 p-1"
          role="tablist"
          aria-label="Create invoice view"
        >
          {(
            [
              ["edit", "Edit invoice"],
              ["preview", "Preview"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mobileTab === tab}
              className={cn(
                "create-invoice-mobile-tab rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                mobileTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setMobileTab(tab)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative -mx-4 mb-4 hidden border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:-mx-5 md:sticky md:top-16 md:z-30 md:-mt-4 md:flex md:items-center md:justify-between md:gap-4 md:px-5 lg:-mx-6 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Input
            value={invoice.invoice.invoiceNumber}
            onChange={(e) =>
              setInvoice({
                ...invoice,
                invoice: { ...invoice.invoice, invoiceNumber: e.target.value },
              })
            }
            className="h-9 max-w-[140px] border-transparent bg-muted/50 font-semibold shadow-none focus-visible:border-border"
            aria-label="Invoice number"
          />
        </div>
        <div className="flex min-w-0 flex-1 justify-center px-4">
          <CurrencySelect
            value={invoice.currencyCode}
            onValueChange={(code) =>
              setInvoice({ ...invoice, currencyCode: code })
            }
          />
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleDownloadPdf()}
            disabled={exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? "Generating…" : "Download PDF"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="@container w-full">
        <div
          className={cn(
            "flex flex-col gap-5 @min-[680px]:grid @min-[680px]:grid-cols-[minmax(0,1fr)_minmax(320px,40%)] @min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(360px,42%)] @min-[1400px]:grid-cols-[minmax(0,1fr)_460px] @min-[680px]:items-start @min-[680px]:gap-5"
          )}
        >
        <div
          className={cn(
            "min-w-0 space-y-4",
            mobileTab !== "edit" && "hidden md:block"
          )}
        >
          <div className="space-y-1 md:hidden">
            <h2 className="text-lg font-semibold tracking-tight">
              {editId ? "Edit invoice" : "New invoice"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Fields update the preview instantly
            </p>
          </div>
          <InvoiceTemplatePicker
            value={invoice.templateId ?? "classic"}
            market={market}
            onChange={setTemplateId}
            compact
          />
          <InvoiceForm
            invoice={invoice}
            onChange={setInvoice}
            savedClients={savedClients}
            onClientsChange={setSavedClients}
            createFlow
            compact
          />
        </div>

        <aside
          className={cn(
            "min-w-0 @min-[680px]:sticky @min-[680px]:top-28 @min-[680px]:self-start",
            mobileTab !== "preview" && "hidden md:block"
          )}
        >
          {previewPanel}
        </aside>
        </div>
      </div>

      <div className="create-invoice-mobile-actions safe-bottom fixed inset-x-0 z-40 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-sm md:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            variant="outline"
            size="default"
            className="h-11 min-w-0 flex-1 gap-1.5 px-2 text-xs sm:text-sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 shrink-0" />
            <span className="truncate">Print</span>
          </Button>
          <Button
            variant="outline"
            size="default"
            className="h-11 min-w-0 flex-1 gap-1.5 px-2 text-xs sm:text-sm"
            onClick={() => void handleDownloadPdf()}
            disabled={exporting}
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="truncate">{exporting ? "PDF…" : "PDF"}</span>
          </Button>
          <Button
            size="default"
            className="h-11 min-w-0 flex-1 gap-1.5 px-2 text-xs sm:text-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Save className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate">Save</span>
          </Button>
        </div>
      </div>

      <InvoicePdfDialog
        open={pdfDialogOpen}
        onOpenChange={setPdfDialogOpen}
        phase={pdfDialogPhase}
        errorMessage={pdfError}
      />
      <RemoveBrandingDialog
        open={brandingDialogOpen}
        onOpenChange={setBrandingDialogOpen}
        displayAmount={brandingPricing.displayAmount}
        onConfirmPaid={() => void confirmKofiRemoval()}
        confirming={brandingConfirming}
      />
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        pricing={subscriptionPricing}
        reason={upgradeReason}
        interval={subscriptionInterval}
        onIntervalChange={setSubscriptionInterval}
        checkoutAvailable={checkoutAvailable}
        provider={checkoutProvider}
        paying={payingSubscription}
        onSubscribe={payForSubscription}
      />
    </PageTransition>
  );
}
