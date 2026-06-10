import { PublicPageShell } from "@/components/public-page-shell";

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
