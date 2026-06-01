"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanySettings } from "@/hooks/use-company-settings";
import type { CompanySettings } from "@/types/invoice";

export default function SettingsPage() {
  const { settings, loading, update } = useCompanySettings();
  const [form, setForm] = useState<CompanySettings>(settings);

  useEffect(() => {
    if (!loading) setForm(settings);
  }, [settings, loading]);

  const handleImage = (
    field: "logo" | "signature",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    update(form);
    toast.success("Settings saved", {
      description: "Default company info updated for new invoices.",
    });
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
          Default company details for new invoices
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
              Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyName">Company Name</Label>
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
                <Label>Default Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage("logo", e)}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Signature</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage("signature", e)}
                />
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="border-dashed">
        <CardContent className="p-6 text-sm text-muted-foreground">
          <p>
            All data is stored in your browser&apos;s localStorage. No account,
            no server — your invoices never leave this device unless you export
            them as PDF.
          </p>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
