import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        }
      >
        <LoginForm configured={configured} />
      </Suspense>
    </div>
  );
}
