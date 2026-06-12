export type SupportFormState = { ok: boolean; message: string };

export type SupportRequestPayload = {
  type: string;
  subject: string;
  message: string;
  contactName: string;
  contactEmail: string;
  source: string;
};

export async function submitSupportRequestClient(
  payload: SupportRequestPayload
): Promise<SupportFormState> {
  const res = await fetch("/api/support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as SupportFormState;
  return data;
}
