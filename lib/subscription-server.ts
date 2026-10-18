import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isPlatformRazorpayConfigured } from "@/lib/razorpay-server";
import { isDodoConfigured } from "@/lib/dodo-payments";
import {
  SELF_HOSTED_ACCESS,
  SUBSCRIPTION_PERIOD_DAYS,
  isCloudBillingEnabled,
  isSelfHostedMode,
  type SubscriptionAccess,
  type SubscriptionBillingInterval,
  type SubscriptionPlanId,
  type SubscriptionStatus,
} from "@/lib/subscription";
import type { ProfileRow } from "@/types/database";

type SubscriptionProfileRow = Pick<
  ProfileRow,
  | "subscription_status"
  | "subscription_plan"
  | "subscription_started_at"
  | "subscription_expires_at"
>;

let schemaReadyCache: boolean | null = null;
let providerSchemaReadyCache: boolean | null = null;

type PaidSubscriptionRow = {
  created_at: string;
  razorpay_payment_id: string | null;
  metadata?: { interval?: string; periodDays?: number } | null;
};

function intervalFromMetadata(
  metadata: PaidSubscriptionRow["metadata"]
): SubscriptionBillingInterval {
  if (metadata?.interval === "yearly") return "yearly";
  if (metadata?.periodDays === 365) return "yearly";
  return "monthly";
}

/**
 * Fallback for deployments that have not run migration 018 yet.
 * A paid Cloud order is a 30-day or 365-day pass from the payment date.
 */
async function getSubscriptionFromPayments(userId: string): Promise<{
  active: boolean;
  status: SubscriptionStatus;
  plan: SubscriptionPlanId;
  startedAt: string | null;
  expiresAt: string | null;
} | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("razorpay_payments")
      .select("created_at, razorpay_payment_id, metadata")
      .eq("user_id", userId)
      .eq("status", "paid")
      .or("purpose.eq.subscription,template_id.eq.cloud_monthly")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as PaidSubscriptionRow;
    const started = new Date(row.created_at).getTime();
    if (!Number.isFinite(started)) return null;
    const interval = intervalFromMetadata(row.metadata);
    const expiresAt = new Date(
      started + SUBSCRIPTION_PERIOD_DAYS[interval] * 86_400_000
    ).toISOString();
    const active = new Date(expiresAt).getTime() > Date.now();

    return {
      active,
      status: active ? "active" : "canceled",
      plan: interval === "yearly" ? "cloud_yearly" : "cloud_monthly",
      startedAt: row.created_at,
      expiresAt,
    };
  } catch {
    return null;
  }
}

/** True when the 018 subscription migration has been applied. */
export async function isSubscriptionSchemaReady(): Promise<boolean> {
  if (schemaReadyCache === true) return true;
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .select("subscription_status")
      .limit(1);
    schemaReadyCache = !error;
    return schemaReadyCache;
  } catch {
    schemaReadyCache = false;
    return false;
  }
}

/** True when the 022 provider migration has been applied. */
async function isSubscriptionProviderSchemaReady(): Promise<boolean> {
  if (providerSchemaReadyCache === true) return true;
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .select("subscription_provider")
      .limit(1);
    providerSchemaReadyCache = !error;
    return providerSchemaReadyCache;
  } catch {
    providerSchemaReadyCache = false;
    return false;
  }
}

function resolveStatus(
  row: SubscriptionProfileRow | null
): { status: SubscriptionStatus; active: boolean } {
  if (!row) return { status: "none", active: false };

  const status = (row.subscription_status ?? "none") as SubscriptionStatus;
  if (status !== "active") return { status, active: false };

  if (!row.subscription_expires_at) {
    return { status: "active", active: true };
  }

  const expires = new Date(row.subscription_expires_at).getTime();
  if (Number.isFinite(expires) && expires <= Date.now()) {
    return { status: "canceled", active: false };
  }

  return { status: "active", active: true };
}

const INACTIVE_ACCESS: Omit<
  SubscriptionAccess,
  "billingEnabled" | "checkoutAvailable" | "dodoCheckoutAvailable" | "source"
> = {
  active: false,
  status: "none",
  plan: null,
  startedAt: null,
  expiresAt: null,
};

export async function getSubscriptionAccess(): Promise<SubscriptionAccess> {
  if (isSelfHostedMode()) {
    return SELF_HOSTED_ACCESS;
  }

  const billingEnabled = isCloudBillingEnabled();
  const dodoCheckoutAvailable = billingEnabled && isDodoConfigured();
  const checkoutAvailable =
    billingEnabled && isPlatformRazorpayConfigured();

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ...INACTIVE_ACCESS,
        billingEnabled,
        checkoutAvailable,
        dodoCheckoutAvailable,
        source: "cloud",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "subscription_status, subscription_plan, subscription_started_at, subscription_expires_at"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) {
      const fallback = await getSubscriptionFromPayments(user.id);
      if (fallback) {
        return {
          active: fallback.active,
          status: fallback.status,
          plan: fallback.plan,
          startedAt: fallback.startedAt,
          expiresAt: fallback.expiresAt,
          billingEnabled,
          checkoutAvailable,
        dodoCheckoutAvailable,
          source: "cloud",
        };
      }
      return {
        ...INACTIVE_ACCESS,
        billingEnabled,
        checkoutAvailable,
        dodoCheckoutAvailable,
        source: "cloud",
      };
    }

    const row = data as SubscriptionProfileRow;
    const { status, active } = resolveStatus(row);

    if (!active) {
      const fallback = await getSubscriptionFromPayments(user.id);
      if (fallback?.active) {
        return {
          active: true,
          status: "active",
          plan: fallback.plan,
          startedAt: fallback.startedAt,
          expiresAt: fallback.expiresAt,
          billingEnabled,
          checkoutAvailable,
        dodoCheckoutAvailable,
          source: "cloud",
        };
      }
    }

    return {
      active,
      status,
      plan: (row.subscription_plan as SubscriptionPlanId | null) ?? null,
      startedAt: row.subscription_started_at ?? null,
      expiresAt: row.subscription_expires_at ?? null,
      billingEnabled,
      checkoutAvailable,
      dodoCheckoutAvailable,
      source: "cloud",
    };
  } catch {
    return {
      ...INACTIVE_ACCESS,
      billingEnabled,
      checkoutAvailable,
      dodoCheckoutAvailable,
      source: "cloud",
    };
  }
}

/** Extend access by one monthly or yearly period from the later of now or expiry. */
export async function activateSubscription(
  userId: string,
  paymentId: string,
  interval: SubscriptionBillingInterval = "monthly",
  provider: "razorpay" | "dodo" = "razorpay"
): Promise<{ expiresAt: string; startedAt: string; plan: SubscriptionPlanId }> {
  const admin = createAdminClient();
  const now = Date.now();
  const periodDays = SUBSCRIPTION_PERIOD_DAYS[interval];

  if (!(await isSubscriptionSchemaReady())) {
    const { data: payment } = await admin
      .from("razorpay_payments")
      .select("created_at")
      .eq("razorpay_payment_id", paymentId)
      .maybeSingle();
    const started = payment?.created_at
      ? new Date(payment.created_at).getTime()
      : now;
    const safeStarted = Number.isFinite(started) ? started : now;
    return {
      expiresAt: new Date(
        safeStarted + periodDays * 86_400_000
      ).toISOString(),
      startedAt: new Date(safeStarted).toISOString(),
      plan: interval === "yearly" ? "cloud_yearly" : "cloud_monthly",
    };
  }

  const { data: existing } = await admin
    .from("profiles")
    .select(
      "subscription_started_at, subscription_expires_at, subscription_last_payment_id"
    )
    .eq("id", userId)
    .maybeSingle();

  // Verify route and webhook can both report the same payment - credit once.
  if (
    existing?.subscription_last_payment_id === paymentId &&
    existing.subscription_expires_at
  ) {
    return {
      expiresAt: existing.subscription_expires_at,
      startedAt:
        existing.subscription_started_at ?? existing.subscription_expires_at,
      plan: interval === "yearly" ? "cloud_yearly" : "cloud_monthly",
    };
  }

  const currentExpiry = existing?.subscription_expires_at
    ? new Date(existing.subscription_expires_at).getTime()
    : 0;
  const base = Number.isFinite(currentExpiry) && currentExpiry > now ? currentExpiry : now;
  const expiresAt = new Date(
    base + periodDays * 86_400_000
  ).toISOString();
  const startedAt = existing?.subscription_started_at ?? new Date(now).toISOString();
  const plan: SubscriptionPlanId =
    interval === "yearly" ? "cloud_yearly" : "cloud_monthly";
  const providerReady = await isSubscriptionProviderSchemaReady();

  const { error } = await admin
    .from("profiles")
    .update({
      subscription_status: "active",
      subscription_plan: plan,
      ...(providerReady ? { subscription_provider: provider } : {}),
      subscription_started_at: startedAt,
      subscription_expires_at: expiresAt,
      subscription_last_payment_id: paymentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  return { expiresAt, startedAt, plan };
}
