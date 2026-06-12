"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanySettings } from "@/types/invoice";

type SettingsRazorpayCardProps = {
  form: CompanySettings;
  onChange: (next: Partial<CompanySettings>) => void;
  razorpaySecretStored: boolean;
};

export function SettingsRazorpayCard({
  form,
  onChange,
  razorpaySecretStored,
}: SettingsRazorpayCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Razorpay payment gateway</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Connect your Razorpay merchant account to accept client invoice payments.
          Money goes directly to your Razorpay account (BYOK). Premium template
          unlocks in India can also use these keys when signed in.
        </p>

        <div className="space-y-2">
          <Label htmlFor="razorpayKeyId">Key ID</Label>
          <Input
            id="razorpayKeyId"
            placeholder="rzp_test_… or rzp_live_…"
            value={form.razorpayKeyId ?? ""}
            onChange={(e) => onChange({ razorpayKeyId: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="razorpayKeySecret">Key Secret</Label>
          <Input
            id="razorpayKeySecret"
            type="password"
            placeholder={
              razorpaySecretStored
                ? "••••••••  (saved — enter new value to replace)"
                : "Paste from Razorpay Dashboard → API Keys"
            }
            value={form.razorpayKeySecret ?? ""}
            onChange={(e) => onChange({ razorpayKeySecret: e.target.value })}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">
            Stored server-side only. Never shown again after save.
          </p>
        </div>

        <p className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          Share invoice payment links from Invoice History. Clients pay at{" "}
          <code className="rounded bg-muted px-1">/pay/[invoiceId]</code>. For
          Razorpay integration review, see{" "}
          <Link
            href="/razorpay-integration"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            test credentials guide
          </Link>
          .
        </p>

        <a
          href="https://dashboard.razorpay.com/app/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Razorpay Dashboard → API Keys
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
