import type { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { privateAppRobots } from "@/data/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: privateAppRobots,
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
