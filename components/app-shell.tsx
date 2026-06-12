"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ServerActionRecovery } from "@/components/server-action-recovery";
import { WelcomeTransition } from "@/components/welcome-transition";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServerActionRecovery />
      <WelcomeTransition />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
