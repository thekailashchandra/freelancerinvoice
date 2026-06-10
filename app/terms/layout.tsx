import { PublicPageShell } from "@/components/public-page-shell";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
