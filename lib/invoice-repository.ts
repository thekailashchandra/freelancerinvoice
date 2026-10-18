import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-log";
import {
  appInvoiceToDbPayload,
  dbInvoiceToApp,
  profileToCompanySettings,
} from "@/lib/invoice-mapper";
import { emptyPaymentDetails } from "@/lib/country";
import { resolveProfileAssetUrls } from "@/lib/supabase/asset-url";
import { createClient } from "@/lib/supabase/server";
import type { CompanySettings, Invoice } from "@/types/invoice";
import type { InvoiceWithItems, ProfileRow } from "@/types/database";

function emptyCompanySettings(): CompanySettings {
  return {
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    logo: null,
    signature: null,
    countryCode: "US",
    currencyCode: "USD",
    taxLabel: "VAT",
    defaultPayment: emptyPaymentDetails(),
  };
}

async function getCompanyForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<CompanySettings> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) return emptyCompanySettings();

  const withAssetUrls = await resolveProfileAssetUrls(
    profile as ProfileRow,
    supabase
  );

  return profileToCompanySettings(withAssetUrls);
}

export async function saveInvoice(invoice: Invoice): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const invoiceId = invoice.id || randomUUID();
  const payload = appInvoiceToDbPayload(
    { ...invoice, id: invoiceId },
    user.id
  );

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      invoiceId
    );

  let savedInvoiceId = invoiceId;

  if (isUuid) {
    const { data: existing } = await supabase
      .from("invoices")
      .select("id")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { id: _id, user_id: _userId, ...updateFields } = payload.invoice;
      let updateError = (
        await supabase
          .from("invoices")
          .update(updateFields)
          .eq("id", invoiceId)
          .eq("user_id", user.id)
      ).error;

      if (updateError && /template_id|additional_charges/i.test(updateError.message)) {
        const fallback = { ...updateFields };
        delete fallback.template_id;
        delete fallback.additional_charges;
        updateError = (
          await supabase
            .from("invoices")
            .update(fallback)
            .eq("id", invoiceId)
            .eq("user_id", user.id)
        ).error;
      }

      if (updateError) throw new Error(updateError.message);

      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);

      const items = payload.items.map((item) => ({
        ...item,
        invoice_id: invoiceId,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(items);

      if (itemsError) throw new Error(itemsError.message);

      void logActivity({
        actorId: user.id,
        action: "invoice.updated",
        resourceType: "invoice",
        resourceId: invoiceId,
        metadata: { invoiceNumber: invoice.invoice.invoiceNumber },
      });

      revalidatePath("/dashboard");
      revalidatePath("/invoice-history");
      revalidatePath("/customers");
      return { id: invoiceId };
    }
  }

  savedInvoiceId = randomUUID();
  let insertError = (
    await supabase.from("invoices").insert({
      ...payload.invoice,
      id: savedInvoiceId,
    })
  ).error;

  if (insertError && /template_id|additional_charges/i.test(insertError.message)) {
    const fallback = { ...payload.invoice };
    delete fallback.template_id;
    delete fallback.additional_charges;
    insertError = (
      await supabase.from("invoices").insert({
        ...fallback,
        id: savedInvoiceId,
      })
    ).error;
  }

  if (insertError) throw new Error(insertError.message);

  const items = payload.items.map((item) => ({
    ...item,
    invoice_id: savedInvoiceId,
  }));

  const { error: itemsError } = await supabase.from("invoice_items").insert(items);

  if (itemsError) {
    await supabase.from("invoices").delete().eq("id", savedInvoiceId);
    throw new Error(itemsError.message);
  }

  void logActivity({
    actorId: user.id,
    action: "invoice.created",
    resourceType: "invoice",
    resourceId: savedInvoiceId,
    metadata: { invoiceNumber: invoice.invoice.invoiceNumber },
  });

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
  return { id: savedInvoiceId };
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const company = await getCompanyForUser(supabase, user.id);

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as InvoiceWithItems[]).map((row) => dbInvoiceToApp(row, company));
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const company = await getCompanyForUser(supabase, user.id);

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return dbInvoiceToApp(data as InvoiceWithItems, company);
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice["status"]
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  void logActivity({
    actorId: user.id,
    action: "invoice.status_changed",
    resourceType: "invoice",
    resourceId: id,
    metadata: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
}

export async function deleteInvoice(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  void logActivity({
    actorId: user.id,
    action: "invoice.deleted",
    resourceType: "invoice",
    resourceId: id,
  });

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
}
