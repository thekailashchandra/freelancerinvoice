import { SchemaGraph } from "@/components/schema-graph";
import { buildFaqPageSchema } from "@/data/structured-data";

export function FaqSchema() {
  return <SchemaGraph nodes={[buildFaqPageSchema()]} />;
}
