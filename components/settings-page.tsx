"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MessageSquarePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useTranslation } from "@/components/locale-provider";
import { uploadProfileAssetClient, deleteProfileAssetClient } from "@/lib/api/app-client";
import { AssetFileField } from "@/components/asset-file-field";
import { CountrySelect } from "@/components/country-select";
import { CurrencySelect } from "@/components/currency-select";
import {
  applyCountryDefaults,
  emptyPaymentDetails,
  type CountryCode,
} from "@/lib/country";
import { PaymentFieldsForm } from "@/components/payment-fields-form";
import { SettingsRazorpayCard } from "@/components/settings-razorpay-card";
import { useRazorpayAccess } from "@/hooks/use-razorpay-access";
import type { AssetKind } from "@/lib/supabase/asset-storage";
import type { CompanySettings } from "@/types/invoice";

export default function SettingsPage() {
  const { settings, loading, update } = useProfile();
  const { isOwner: razorpayOwner } = useRazorpayAccess();
  const { t } = useTranslation();
  const [form, setForm] = useState<CompanySettings>(settings);
  const [defaultPayment, setDefaultPayment] = useState(emptyPaymentDetails());
  const [saving, setSaving] = useState(false);

  const handleCountryChange = (countryCode: CountryCode) => {
    const defaults = applyCountryDefaults(countryCode);
    setForm((prev) => ({
      ...prev,
      countryCode: defaults.countryCode,
      currencyCode: defaults.currencyCode,
      taxLabel: defaults.taxLabel,
    }));
    setDefaultPayment(defaults.payment);
  };

  useEffect(() => {
    if (!loading) {
      setForm(settings);
      setDefaultPayment(settings.defaultPayment ?? emptyPaymentDetails());
    }
  }, [settings, loading]);

  const handleAssetUpload = async (kind: AssetKind, file: File) => {
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);

    const result = await uploadProfileAssetClient(formData);

    if (!result.ok) {
      toast.error("Upload failed", { description: result.error });
      return null;
    }

    setForm((prev) => ({ ...prev, [kind]: result.url }));
    toast.success(`${kind === "logo" ? "Logo" : "Signature"} uploaded`);
    return result.url;
  };

  const handleAssetDelete = async (kind: AssetKind) => {
    const result = await deleteProfileAssetClient(kind);

    if (!result.ok) {
      toast.error("Remove failed", { description: result.error });
      return;
    }

    setForm((prev) => ({ ...prev, [kind]: null }));
    toast.success(`${kind === "logo" ? "Logo" : "Signature"} removed`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: CompanySettings = {
        ...form,
        defaultPayment,
      };
      await update(payload);
      setForm((prev) => ({ ...prev, razorpayKeySecret: "" }));
      toast.success(t("settings.saved"), {
        description: t("settings.savedDescription"),
      });
    } catch (err) {
      toast.error(t("settings.saveFailed"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <PageTransition className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {t("settings.title")}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              {t("settings.profileSection")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyName">
                  Name on invoices (you or your business)
                </Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={form.companyEmail}
                  onChange={(e) =>
                    setForm({ ...form, companyEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={form.companyPhone}
                  onChange={(e) =>
                    setForm({ ...form, companyPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t("settings.country")}</Label>
                <CountrySelect
                  value={form.countryCode}
                  onValueChange={(v) => handleCountryChange(v as CountryCode)}
                />
                <p className="text-xs text-muted-foreground">
                  Updates default currency, tax label, and which payment fields
                  appear on invoices (e.g. UPI is only for India).
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  value={form.companyAddress}
                  onChange={(e) =>
                    setForm({ ...form, companyAddress: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.currency")}</Label>
                <CurrencySelect
                  value={form.currencyCode}
                  onValueChange={(v) =>
                    setForm({ ...form, currencyCode: v })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxLabel">{t("settings.taxLabel")}</Label>
                <Input
                  id="taxLabel"
                  value={form.taxLabel}
                  onChange={(e) =>
                    setForm({ ...form, taxLabel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3 sm:col-span-2">
                <Label className="text-base">{t("settings.paymentDetails")}</Label>
                <p className="text-xs text-muted-foreground">
                  {t("settings.paymentHint")}
                </p>
                <PaymentFieldsForm
                  countryCode={form.countryCode}
                  payment={defaultPayment}
                  onChange={setDefaultPayment}
                  idPrefix="settings-pay"
                />
              </div>
              <AssetFileField
                id="default-logo"
                label="Default Logo"
                kind="logo"
                imageUrl={form.logo}
                onUpload={handleAssetUpload}
                onDelete={handleAssetDelete}
              />
              <AssetFileField
                id="default-signature"
                label="Default Signature"
                kind="signature"
                imageUrl={form.signature}
                onUpload={handleAssetUpload}
                onDelete={handleAssetDelete}
              />
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="space-y-1">
                    <Label htmlFor="signature-text-fallback">
                      {t("settings.signatureFallback")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("settings.signatureFallbackHint")}
                    </p>
                  </div>
                  <Switch
                    id="signature-text-fallback"
                    checked={!form.hideSignatureTextFallback}
                    onCheckedChange={(checked) =>
                      setForm({
                        ...form,
                        hideSignatureTextFallback: !checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? t("settings.saving") : t("settings.save")}
            </Button>
          </CardContent>
        </Card>

      {razorpayOwner ? (
        <SettingsRazorpayCard
          form={form}
          onChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
          razorpaySecretStored={Boolean(form.razorpayConfigured)}
        />
      ) : null}

      <Card className="border-dashed">
        <CardContent className="p-6 text-sm text-muted-foreground">
          <p>
            Your profile, invoices, and assets are stored securely in Supabase.
            Logo and signature files live in the{" "}
            <code className="text-xs">invoice-assets</code> bucket under your
            user folder.
          </p>
          <Button variant="outline" asChild className="mt-4 gap-2">
            <Link href="/support">
              <MessageSquarePlus className="h-4 w-4" />
              Raise support or feature request
            </Link>
          </Button>
        </CardContent>
      </Card>

    </PageTransition>
  );
}
