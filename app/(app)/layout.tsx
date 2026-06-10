import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { privateAppRobots } from "@/data/seo";

export const metadata: Metadata = {
  robots: privateAppRobots,
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
