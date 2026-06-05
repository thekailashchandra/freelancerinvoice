"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, MessageSquarePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { uploadProfileAssetAction } from "@/lib/actions/profile-assets";
import { AssetFileField } from "@/components/asset-file-field";
import { CountrySelect } from "@/components/country-select";
import { CurrencySelect } from "@/components/currency-select";
import {
  applyCountryDefaults,
  emptyPaymentDetails,
  type CountryCode,
} from "@/lib/country";
import { PaymentFieldsForm } from "@/components/payment-fields-form";
import type { AssetKind } from "@/lib/supabase/asset-storage";
import type { CompanySettings } from "@/types/invoice";

export default function SettingsPage() {
  const { settings, loading, update } = useProfile();
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

    const result = await uploadProfileAssetAction(formData);

    if (!result.ok) {
      toast.error("Upload failed", { description: result.error });
      return null;
    }

    setForm((prev) => ({ ...prev, [kind]: result.url }));
    toast.success(`${kind === "logo" ? "Logo" : "Signature"} uploaded`);
    return result.url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({ ...form, defaultPayment });
      toast.success("Settings saved", {
        description: "Default company info updated for new invoices.",
      });
    } catch (err) {
      toast.error("Save failed", {
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
    <PageTransition className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Your profile details for new invoices — works for individuals and
          businesses
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              Profile & billing defaults
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
                <Label>Country / region</Label>
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
                <Label>Default currency</Label>
                <CurrencySelect
                  value={form.currencyCode}
                  onValueChange={(v) =>
                    setForm({ ...form, currencyCode: v })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxLabel">Tax label</Label>
                <Input
                  id="taxLabel"
                  value={form.taxLabel}
                  onChange={(e) =>
                    setForm({ ...form, taxLabel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3 sm:col-span-2">
                <Label className="text-base">Default payment details</Label>
                <p className="text-xs text-muted-foreground">
                  Shown on new invoices. Fields depend on your country above.
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
              />
              <AssetFileField
                id="default-signature"
                label="Default Signature"
                kind="signature"
                imageUrl={form.signature}
                onUpload={handleAssetUpload}
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

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
