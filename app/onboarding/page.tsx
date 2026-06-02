"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { completeOnboardingAction } from "@/lib/actions/profile";
import {
  applyCountryDefaults,
  COUNTRY_OPTIONS,
  getCurrencyOptionsForCountry,
  type CountryCode,
} from "@/lib/country";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [taxLabel, setTaxLabel] = useState("VAT");
  const [loading, setLoading] = useState(false);

  const currencyOptions = getCurrencyOptionsForCountry(countryCode);

  const handleCountryChange = (code: CountryCode) => {
    const defaults = applyCountryDefaults(code);
    setCountryCode(defaults.countryCode);
    setCurrencyCode(defaults.currencyCode);
    setTaxLabel(defaults.taxLabel);
  };

  const handleFinish = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    setLoading(true);
    try {
      await completeOnboardingAction({
        companyName: companyName.trim(),
        countryCode,
        currencyCode,
        taxLabel,
      });
      toast.success("Profile ready!");
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Welcome — Step {step} of 2
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Tell us your business name to personalize invoices."
              : "Choose your country — we’ll set currency, tax, and payment fields."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 ? (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Studio"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => {
                  if (!companyName.trim()) {
                    toast.error("Company name is required");
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Country / region</Label>
                <Select
                  value={countryCode}
                  onValueChange={(v) => handleCountryChange(v as CountryCode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default currency</Label>
                <Select value={currencyCode} onValueChange={setCurrencyCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Finish setup
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
