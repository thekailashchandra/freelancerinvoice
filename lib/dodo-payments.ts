import DodoPayments from "dodopayments";
import type { SubscriptionBillingInterval } from "@/lib/subscription";

export type DodoEnvironment = "test_mode" | "live_mode";

export function getDodoEnvironment(): DodoEnvironment {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
    ? "test_mode"
    : "live_mode";
}

export function getDodoApiKey(): string | null {
  return process.env.DODO_PAYMENTS_API_KEY?.trim() || null;
}

export function getDodoWebhookKey(): string | null {
  return process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim() || null;
}

export function getDodoProductId(
  interval: SubscriptionBillingInterval
): string | null {
  const raw =
    interval === "yearly"
      ? process.env.DODO_PAYMENTS_PRODUCT_ID_YEARLY
      : process.env.DODO_PAYMENTS_PRODUCT_ID_MONTHLY;
  return raw?.trim() || null;
}

export function isDodoConfigured(): boolean {
  return Boolean(
    getDodoApiKey() &&
      getDodoProductId("monthly") &&
      getDodoProductId("yearly")
  );
}

export function createDodoClient(): DodoPayments | null {
  const apiKey = getDodoApiKey();
  if (!apiKey) return null;
  return new DodoPayments({
    bearerToken: apiKey,
    environment: getDodoEnvironment(),
  });
}
