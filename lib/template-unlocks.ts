import type { InvoiceTemplateId } from "@/lib/invoice-templates";

const STORAGE_KEY = "iff-template-unlocks";

export type TemplateUnlockRecord = {
  templateId: InvoiceTemplateId;
  sessionId: string;
  unlockedAt: string;
  amountDisplay: string;
  currency: string;
};

type UnlockStore = {
  unlocks: TemplateUnlockRecord[];
};

function readStore(): UnlockStore {
  if (typeof window === "undefined") return { unlocks: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocks: [] };
    const parsed = JSON.parse(raw) as UnlockStore;
    return { unlocks: parsed.unlocks ?? [] };
  } catch {
    return { unlocks: [] };
  }
}

function writeStore(store: UnlockStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function isTemplateUnlocked(templateId: InvoiceTemplateId): boolean {
  if (templateId === "classic") return true;
  return readStore().unlocks.some((u) => u.templateId === templateId);
}

export function unlockTemplate(record: TemplateUnlockRecord) {
  const store = readStore();
  if (store.unlocks.some((u) => u.sessionId === record.sessionId)) return;
  store.unlocks.push(record);
  writeStore(store);
}

export function getTemplateUnlock(
  templateId: InvoiceTemplateId
): TemplateUnlockRecord | null {
  return readStore().unlocks.find((u) => u.templateId === templateId) ?? null;
}

export function getLatestReceipt(): TemplateUnlockRecord | null {
  const { unlocks } = readStore();
  if (unlocks.length === 0) return null;
  return unlocks[unlocks.length - 1];
}
