"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ServerActionRecovery } from "@/components/server-action-recovery";
import { WelcomeTransition } from "@/components/welcome-transition";
import { PolicyUpdateGate } from "@/components/policy-update-gate";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServerActionRecovery />
      <WelcomeTransition />
      <PolicyUpdateGate />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
