"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signUpFormAction, type AuthFormState } from "@/lib/actions/auth";
import { brand } from "@/data/navigation";
import { SiteLogo } from "@/components/site-logo";
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

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full gap-2" disabled={disabled || pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Create account
    </Button>
  );
}

type SignupFormProps = {
  /** From server — avoids client env mismatch during hydration */
  configured: boolean;
  canSignUp: boolean;
};

export function SignupForm({ configured, canSignUp }: SignupFormProps) {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    signUpFormAction,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error("Sign up failed", { description: state.error });
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <SiteLogo variant="full" href={null} />
        </div>
        <CardTitle>Create your {brand.name} account</CardTitle>
        <CardDescription>Cloud-backed invoices for freelancers</CardDescription>
      </CardHeader>
      <CardContent>
        {!configured && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            Copy <code className="text-xs">.env.example</code> to{" "}
            <code className="text-xs">.env.local</code> and set{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
            , and <code className="text-xs">SUPABASE_SECRET_KEY</code>. Restart{" "}
            <code className="text-xs">npm run dev</code> after saving.
          </p>
        )}
        {state?.error && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </p>
        )}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <SubmitButton disabled={!canSignUp} />
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
          {" · "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
