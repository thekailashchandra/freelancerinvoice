import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createDodoClient, getDodoProductId, isDodoConfigured } from "@/lib/dodo-payments";
import {
  isCloudBillingEnabled,
  isSelfHostedMode,
  type SubscriptionBillingInterval,
} from "@/lib/subscription";
import { getSiteUrl } from "@/lib/supabase/site-url";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (isSelfHostedMode() || !isCloudBillingEnabled()) {
    return NextResponse.json(
      { error: "Cloud billing is disabled on this deployment." },
      { status: 400 }
    );
  }

  if (!isDodoConfigured()) {
    return NextResponse.json(
      {
        error:
          "USD billing is not configured yet. Add the Dodo API key and product IDs.",
        code: "DODO_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json(
      { error: "Sign in to subscribe.", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  let body: { interval?: SubscriptionBillingInterval } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const interval: SubscriptionBillingInterval =
    body.interval === "yearly" ? "yearly" : "monthly";
  const productId = getDodoProductId(interval);
  if (!productId) {
    return NextResponse.json(
      { error: `No Dodo product configured for ${interval} billing.` },
      { status: 503 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", user.id)
    .maybeSingle();

  const client = createDodoClient();
  if (!client) {
    return NextResponse.json(
      { error: "USD billing is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: user.email,
        name: profile?.company_name || user.email,
      },
      billing_currency: "USD",
      metadata: {
        user_id: user.id,
        interval,
        plan: interval === "yearly" ? "cloud_yearly" : "cloud_monthly",
        market: "GLOBAL",
        source: "invoice-for-freelance",
      },
      return_url: `${getSiteUrl()}/subscribe?dodo=success`,
      cancel_url: `${getSiteUrl()}/subscribe?dodo=cancelled`,
      feature_flags: {
        redirect_immediately: true,
      },
      customization: {
        theme: "light",
      },
    });

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: "Dodo did not return a checkout URL." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
      interval,
      provider: "dodo",
    });
  } catch (err) {
    const dodoError = err as {
      status?: number;
      message?: string;
      error?: { code?: string; message?: string };
    };
    console.error("Dodo checkout session failed", {
      interval,
      status: dodoError.status,
      code: dodoError.error?.code,
      message: dodoError.error?.message || dodoError.message,
    });
    return NextResponse.json(
      {
        error:
          dodoError.error?.message ||
          dodoError.message ||
          "Dodo could not create the checkout session.",
        code: dodoError.error?.code || "DODO_CHECKOUT_FAILED",
      },
      { status: 502 }
    );
  }
}
