import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { buildBreadcrumbItems } from "@/data/structured-data";

type PublicBreadcrumbSchemaProps = {
  segments: { name: string; path: string }[];
};

export function PublicBreadcrumbSchema({ segments }: PublicBreadcrumbSchemaProps) {
  return <BreadcrumbSchema items={buildBreadcrumbItems(segments)} />;
}
