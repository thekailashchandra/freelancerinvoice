import type { MessageTree } from "@/lib/i18n/types";

export function patchMessages(base: MessageTree, patch: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      typeof value === "object" &&
      value !== null &&
      typeof result[key] === "object" &&
      result[key] !== null
    ) {
      result[key] = patchMessages(result[key] as MessageTree, value as MessageTree);
    } else {
      result[key] = value;
    }
  }
  return result;
}
