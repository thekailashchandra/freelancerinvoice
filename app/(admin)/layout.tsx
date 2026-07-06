import type { Metadata } from "next";
import { privateAppRobots } from "@/data/seo";
import { SuperadminShell } from "@/components/superadmin/superadmin-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: privateAppRobots,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperadminShell>{children}</SuperadminShell>;
}
