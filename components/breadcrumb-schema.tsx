import { SchemaGraph } from "@/components/schema-graph";
import {
  buildBreadcrumbListSchema,
  type BreadcrumbItem,
} from "@/data/structured-data";

type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return <SchemaGraph nodes={[buildBreadcrumbListSchema(items)]} />;
}
