"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signInFormAction, type AuthFormState } from "@/lib/actions/auth";
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
      Sign in
    </Button>
  );
}

type LoginFormProps = {
  configured: boolean;
};

export function LoginForm({ configured }: LoginFormProps) {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? "/dashboard";
  const authError = searchParams.get("error");

  const [state, formAction] = useActionState<AuthFormState, FormData>(
    signInFormAction,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error("Sign in failed", { description: state.error });
    }
  }, [state]);

  return (
    <Card className="w-full max-w-md border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
          <SiteLogo variant="full" href={null} />
        </div>
        <CardTitle>Sign in to {brand.name}</CardTitle>
        <CardDescription>{brand.tagline}</CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Authentication failed. Please try again.
          </p>
        )}
        {!configured && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            Copy <code className="text-xs">.env.example</code> to{" "}
            <code className="text-xs">.env.local</code> and set your Supabase
            keys.
          </p>
        )}
        {state?.error && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </p>
        )}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectParam} />
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
              autoComplete="current-password"
              required
            />
          </div>
          <SubmitButton disabled={!configured} />
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
          {" · "}
          <Link href="/signup" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
