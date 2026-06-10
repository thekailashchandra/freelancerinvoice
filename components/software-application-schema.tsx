import { WebApplicationSchema } from "@/components/web-application-schema";

type SoftwareApplicationSchemaProps = {
  /** Include Organization node for publisher/provider linking. */
  includeOrganization?: boolean;
};

/** @deprecated Prefer WebApplicationSchema — kept for backward-compatible imports. */
export function SoftwareApplicationSchema({
  includeOrganization = true,
}: SoftwareApplicationSchemaProps) {
  return <WebApplicationSchema includeOrganization={includeOrganization} />;
}
