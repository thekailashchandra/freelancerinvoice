"use server";

import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";

export type SupportFormState = { ok: boolean; message: string } | null;

const DEFAULT_SUPPORT_EMAIL = "invoiceforfreelance@gmail.com";

function readSupportConfig() {
  const host = process.env.SUPPORT_SMTP_HOST?.trim() ?? "";
  const portRaw = process.env.SUPPORT_SMTP_PORT?.trim() ?? "587";
  const user = process.env.SUPPORT_SMTP_USER?.trim() ?? "";
  const pass = process.env.SUPPORT_SMTP_PASS?.trim() ?? "";
  const from = process.env.SUPPORT_FROM_EMAIL?.trim() || user;
  const to =
    process.env.SUPPORT_TO_EMAIL?.trim() || DEFAULT_SUPPORT_EMAIL;
  const port = Number(portRaw);

  if (!host || !user || !pass || !from || Number.isNaN(port)) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    to,
    secure: port === 465,
  };
}

export async function submitSupportRequestAction(
  _prev: SupportFormState,
  formData: FormData
): Promise<SupportFormState> {
  const type = String(formData.get("type") ?? "Feature request").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const source = String(formData.get("source") ?? "support-page").trim();

  if (!subject || !message || !contactEmail) {
    return {
      ok: false,
      message: "Please fill subject, message, and contact email.",
    };
  }

  if (message.length < 20) {
    return {
      ok: false,
      message: "Please add more details (minimum 20 characters).",
    };
  }

  if (subject.length > 150 || message.length > 4000) {
    return {
      ok: false,
      message: "Subject or message is too long.",
    };
  }

  const supportConfig = readSupportConfig();
  if (!supportConfig) {
    return {
      ok: false,
      message:
        "Support email is not configured yet. Set SUPPORT_SMTP_* values in .env.local.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const transporter = nodemailer.createTransport({
    host: supportConfig.host,
    port: supportConfig.port,
    secure: supportConfig.secure,
    auth: {
      user: supportConfig.user,
      pass: supportConfig.pass,
    },
  });

  const now = new Date().toISOString();
  const safeName = contactName || "Not provided";
  const safeUserEmail = user?.email || "Unknown";

  const textBody = [
    "New support request from Invoice for Freelance",
    "",
    `Type: ${type}`,
    `Subject: ${subject}`,
    `Contact Name: ${safeName}`,
    `Contact Email: ${contactEmail}`,
    `Signed In User: ${safeUserEmail}`,
    `User ID: ${user?.id ?? "Unknown"}`,
    `Source: ${source}`,
    `Submitted At: ${now}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: supportConfig.from,
      to: supportConfig.to,
      replyTo: contactEmail,
      subject: `[Invoice for Freelance] ${type}: ${subject}`,
      text: textBody,
    });

    return {
      ok: true,
      message: "Request sent. We will get back to you soon.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not send your request right now. Please try again.",
    };
  }
}
