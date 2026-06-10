import { SchemaGraph } from "@/components/schema-graph";
import {
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
} from "@/data/structured-data";

type SoftwareApplicationSchemaProps = {
  /** Include Organization node for publisher/provider linking. */
  includeOrganization?: boolean;
};

export function SoftwareApplicationSchema({
  includeOrganization = true,
}: SoftwareApplicationSchemaProps) {
  const nodes = [
    ...(includeOrganization ? [buildOrganizationSchema()] : []),
    buildSoftwareApplicationSchema(),
  ];

  return <SchemaGraph nodes={nodes} />;
}
