"use client";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

export type RazorpayCheckoutPayload = {
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
};

export type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(
  payload: RazorpayCheckoutPayload
): Promise<RazorpaySuccessResponse> {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: payload.keyId,
      amount: payload.amountPaise,
      currency: payload.currency,
      name: payload.name,
      description: payload.description,
      order_id: payload.orderId,
      prefill: payload.prefill,
      notes: payload.notes,
      theme: { color: "#111111" },
      handler(response: RazorpaySuccessResponse) {
        resolve(response);
      },
      modal: {
        ondismiss() {
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response: unknown) => {
      const message =
        typeof response === "object" &&
        response &&
        "error" in response &&
        typeof (response as { error?: { description?: string } }).error
          ?.description === "string"
          ? (response as { error: { description: string } }).error.description
          : "Payment failed";
      reject(new Error(message));
    });

    rzp.open();
  });
}
