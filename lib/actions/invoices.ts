"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { appInvoiceToDbPayload, dbInvoiceToApp, profileToCompanySettings } from "@/lib/invoice-mapper";
import type { Invoice } from "@/types/invoice";
import type { InvoiceWithItems } from "@/types/database";
import { randomUUID } from "crypto";

export async function saveInvoiceAction(invoice: Invoice): Promise<{ id: string }> {
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
      const { error: updateError } = await supabase
        .from("invoices")
        .update(updateFields)
        .eq("id", invoiceId)
        .eq("user_id", user.id);

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

      revalidatePath("/dashboard");
      revalidatePath("/invoice-history");
      revalidatePath("/customers");
      return { id: invoiceId };
    }
  }

  savedInvoiceId = randomUUID();
  const { error: insertError } = await supabase.from("invoices").insert({
    ...payload.invoice,
    id: savedInvoiceId,
  });

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

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
  return { id: savedInvoiceId };
}

export async function updateInvoiceStatusAction(
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

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
}

export async function deleteInvoiceAction(id: string): Promise<void> {
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

  revalidatePath("/dashboard");
  revalidatePath("/invoice-history");
  revalidatePath("/customers");
}

export async function fetchInvoiceByIdAction(
  id: string
): Promise<Invoice | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  const company = profile
    ? profileToCompanySettings(profile)
    : {
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        logo: null,
        signature: null,
        countryCode: "US",
        currencyCode: "USD",
        taxLabel: "VAT",
        defaultPayment: {
          bankName: "",
          accountNumber: "",
          upiId: "",
          routingNumber: "",
          iban: "",
          sortCode: "",
        },
      };

  return dbInvoiceToApp(data as InvoiceWithItems, company);
}

export async function fetchInvoicesAction(): Promise<Invoice[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const company = profile
    ? profileToCompanySettings(profile)
    : {
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        logo: null,
        signature: null,
        countryCode: "US",
        currencyCode: "USD",
        taxLabel: "VAT",
        defaultPayment: {
          bankName: "",
          accountNumber: "",
          upiId: "",
          routingNumber: "",
          iban: "",
          sortCode: "",
        },
      };

  return (data as InvoiceWithItems[]).map((row) =>
    dbInvoiceToApp(row, company)
  );
}
