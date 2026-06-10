import { PublicPageShell } from "@/components/public-page-shell";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
