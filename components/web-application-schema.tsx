import type { WebApplicationSchemaOptions } from "@/data/structured-data";
import { SchemaGraph } from "@/components/schema-graph";
import {
  buildOrganizationSchema,
  buildWebApplicationSchema,
} from "@/data/structured-data";

type WebApplicationSchemaProps = WebApplicationSchemaOptions & {
  /** Additional schema.org nodes (WebPage, FAQ, Breadcrumb, etc.). */
  nodes?: Record<string, unknown>[];
  /** Include Organization node (default true). */
  includeOrganization?: boolean;
};

/**
 * Deep WebApplication JSON-LD for landing and conversion pages.
 * Signals to search engines that the page represents a functional software tool.
 */
export function WebApplicationSchema({
  nodes = [],
  includeOrganization = true,
  ...webAppOptions
}: WebApplicationSchemaProps) {
  return (
    <SchemaGraph
      nodes={[
        ...(includeOrganization ? [buildOrganizationSchema()] : []),
        buildWebApplicationSchema(webAppOptions),
        ...nodes,
      ]}
    />
  );
}
