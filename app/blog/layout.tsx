import { PublicPageShell } from "@/components/public-page-shell";
import { CONTENT_ISR_SECONDS } from "@/lib/cache-config";

export const revalidate = CONTENT_ISR_SECONDS;

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
