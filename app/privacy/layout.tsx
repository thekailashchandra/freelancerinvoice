import { PublicPageShell } from "@/components/public-page-shell";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
