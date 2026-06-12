import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_SUPPORT_EMAIL = "invoiceforfreelance@gmail.com";

function readSupportConfig() {
  const host = process.env.SUPPORT_SMTP_HOST?.trim() ?? "";
  const portRaw = process.env.SUPPORT_SMTP_PORT?.trim() ?? "587";
  const user = process.env.SUPPORT_SMTP_USER?.trim() ?? "";
  const pass = process.env.SUPPORT_SMTP_PASS?.trim() ?? "";
  const from = process.env.SUPPORT_FROM_EMAIL?.trim() || user;
  const to = process.env.SUPPORT_TO_EMAIL?.trim() || DEFAULT_SUPPORT_EMAIL;
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

export type SupportRequestInput = {
  type: string;
  subject: string;
  message: string;
  contactName: string;
  contactEmail: string;
  source: string;
};

export type SupportRequestResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function submitSupportRequest(
  input: SupportRequestInput
): Promise<SupportRequestResult> {
  const type = input.type.trim() || "Feature request";
  const subject = input.subject.trim();
  const message = input.message.trim();
  const contactName = input.contactName.trim();
  const contactEmail = input.contactEmail.trim();
  const source = input.source.trim() || "support-page";

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
