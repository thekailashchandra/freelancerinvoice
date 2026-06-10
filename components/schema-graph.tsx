import { JsonLd } from "@/components/json-ld";
import { buildSchemaGraph } from "@/data/structured-data";

type SchemaGraphProps = {
  nodes: Record<string, unknown>[];
};

export function SchemaGraph({ nodes }: SchemaGraphProps) {
  return <JsonLd data={buildSchemaGraph(...nodes)} />;
}
