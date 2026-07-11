"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  Globe2,
  Loader2,
  User,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadProfileAssetClient, deleteProfileAssetClient } from "@/lib/api/app-client";
import { updateProfileClient } from "@/lib/api/profile-client";
import { AssetFileField } from "@/components/asset-file-field";
import { PaymentFieldsForm } from "@/components/payment-fields-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  applyCountryDefaults,
  emptyPaymentDetails,
  type CountryCode,
} from "@/lib/country";
import { CountrySelect } from "@/components/country-select";
import { CurrencySelect } from "@/components/currency-select";
import type { AssetKind } from "@/lib/supabase/asset-storage";
import type { PaymentDetails } from "@/types/invoice";

const TOTAL_STEPS = 4;

export type AccountType = "individual" | "business";

type OnboardingFormProps = {
  initialEmail?: string;
  initialName?: string;
};

export function OnboardingForm({
  initialEmail = "",
  initialName = "",
}: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);

  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [displayName, setDisplayName] = useState(initialName);
  const [companyEmail, setCompanyEmail] = useState(initialEmail);
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [taxLabel, setTaxLabel] = useState("Sales Tax");
  const [defaultPayment, setDefaultPayment] = useState<PaymentDetails>(
    emptyPaymentDetails()
  );
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const isBusiness = accountType === "business";

  const handleCountryChange = (code: CountryCode) => {
    const defaults = applyCountryDefaults(code);
    setCountryCode(defaults.countryCode);
    setCurrencyCode(defaults.currencyCode);
    setTaxLabel(defaults.taxLabel);
    setDefaultPayment(defaults.payment);
  };

  const handleAssetUpload = async (kind: AssetKind, file: File) => {
    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);

    const result = await uploadProfileAssetClient(formData);
    if (!result.ok) {
      toast.error("Upload failed", { description: result.error });
      return null;
    }

    if (kind === "logo") setLogo(result.url);
    else setSignature(result.url);

    toast.success(`${kind === "logo" ? "Logo" : "Signature"} uploaded`);
    return result.url;
  };

  const handleAssetDelete = async (kind: AssetKind) => {
    const result = await deleteProfileAssetClient(kind);

    if (!result.ok) {
      toast.error("Remove failed", { description: result.error });
      return;
    }

    if (kind === "logo") setLogo(null);
    else setSignature(null);

    toast.success(`${kind === "logo" ? "Logo" : "Signature"} removed`);
  };

  const validateStep = (current: number): boolean => {
    if (current === 1 && !displayName.trim()) {
      toast.error(isBusiness ? "Business name is required" : "Your name is required");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleFinish = async () => {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      await updateProfileClient({
        companyName: displayName.trim(),
        companyEmail: companyEmail.trim(),
        companyPhone: companyPhone.trim(),
        companyAddress: companyAddress.trim(),
        countryCode,
        currencyCode,
        taxLabel: taxLabel.trim() || "Tax",
        defaultPayment,
        logo,
        signature,
      });
      toast.success("You're all set!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Could not save profile", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    try {
      const fallbackName =
        displayName.trim() ||
        initialName.trim() ||
        initialEmail.split("@")[0] ||
        "My Invoices";
      await updateProfileClient({
        companyName: fallbackName,
        companyEmail: companyEmail.trim() || initialEmail,
        countryCode: "US",
        currencyCode: "USD",
        taxLabel: "Sales Tax",
      });
      toast.success("Skipped for now. You can finish setup in Settings anytime.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error("Could not skip setup", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSkipping(false);
    }
  };

  const stepMeta = [
    {
      title: "Who is invoicing?",
      description: isBusiness
        ? "Set up your business or organization on invoices."
        : "Set up your personal freelancer profile on invoices.",
      icon: isBusiness ? Building2 : UserCircle2,
    },
    {
      title: "Contact details",
      description: "Shown on invoices so clients know how to reach you.",
      icon: User,
    },
    {
      title: "Region & tax defaults",
      description: "Currency, tax label, and payment fields for your country.",
      icon: Globe2,
    },
    {
      title: "Payment & branding",
      description: "Optional defaults for new invoices. You can change these later.",
      icon: CreditCard,
    },
  ][step - 1];

  const StepIcon = stepMeta.icon;

  return (
    <Card className="w-full max-w-2xl border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StepIcon className="h-5 w-5 text-primary" />
              {stepMeta.title}
            </CardTitle>
            <CardDescription className="mt-1.5">
              Step {step} of {TOTAL_STEPS} · {stepMeta.description}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={handleSkip}
            disabled={loading || skipping}
          >
            {skipping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Skip for now"
            )}
          </Button>
        </div>
        <div className="mt-4 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                i < step ? "bg-primary" : "bg-muted",
              ].join(" ")}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label>I am invoicing as</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={accountType === "individual" ? "default" : "outline"}
                  className="h-auto flex-col gap-1 py-3"
                  onClick={() => setAccountType("individual")}
                >
                  <UserCircle2 className="h-5 w-5" />
                  Individual
                </Button>
                <Button
                  type="button"
                  variant={accountType === "business" ? "default" : "outline"}
                  className="h-auto flex-col gap-1 py-3"
                  onClick={() => setAccountType("business")}
                >
                  <Building2 className="h-5 w-5" />
                  Business / org
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Freelancers and solo contractors can choose Individual. Agencies
                and registered companies can choose Business.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">
                {isBusiness ? "Business / organization name" : "Your full name"}
              </Label>
              <Input
                id="displayName"
                placeholder={
                  isBusiness ? "Acme Studio LLC" : "Alex Morgan"
                }
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="you@example.com"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                type="tel"
                placeholder="+1 555 0100"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="companyAddress">
                {isBusiness ? "Business address" : "Address"}
              </Label>
              <Textarea
                id="companyAddress"
                placeholder="Street, city, state, postal code"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Country / region</Label>
              <CountrySelect
                value={countryCode}
                onValueChange={(v) => handleCountryChange(v as CountryCode)}
              />
            </div>
            <div className="space-y-2">
              <Label>Default currency</Label>
              <CurrencySelect
                value={currencyCode}
                onValueChange={setCurrencyCode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxLabel">Default tax label</Label>
              <Input
                id="taxLabel"
                placeholder="VAT, GST, Sales Tax…"
                value={taxLabel}
                onChange={(e) => setTaxLabel(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Default payment details</Label>
              <p className="text-xs text-muted-foreground">
                Copied onto new invoices. Fields depend on your country.
              </p>
              <PaymentFieldsForm
                countryCode={countryCode}
                payment={defaultPayment}
                onChange={setDefaultPayment}
                idPrefix="onboard-pay"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AssetFileField
                id="onboard-logo"
                label="Logo (optional)"
                kind="logo"
                imageUrl={logo}
                onUpload={handleAssetUpload}
                onDelete={handleAssetDelete}
              />
              <AssetFileField
                id="onboard-signature"
                label="Signature (optional)"
                kind="signature"
                imageUrl={signature}
                onUpload={handleAssetUpload}
                onDelete={handleAssetDelete}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading || skipping}
            >
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              className="flex-1"
              onClick={goNext}
              disabled={loading || skipping}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1 gap-2"
              onClick={handleFinish}
              disabled={loading || skipping}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Finish setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
