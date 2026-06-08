"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { WelcomeTransition } from "@/components/welcome-transition";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WelcomeTransition />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
