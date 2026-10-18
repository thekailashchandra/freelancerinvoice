export type InvoiceStatusDb =
  | "draft"
  | "pending"
  | "sent"
  | "paid"
  | "overdue"
  | "void";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface ProfileRow {
  id: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  signature_url: string | null;
  currency_code: string;
  tax_label: string;
  country_code: string;
  default_account_name: string;
  default_bank_name: string;
  default_account_number: string;
  default_upi_id: string;
  default_routing_number: string;
  default_iban: string;
  default_swift_code: string;
  default_bank_address: string;
  default_sort_code: string;
  logo_height?: number;
  brand_color?: string;
  hide_invoice_branding?: boolean;
  hide_signature_text_fallback?: boolean;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  subscription_status?: "none" | "active" | "past_due" | "canceled";
  subscription_plan?: "cloud_monthly" | null;
  subscription_started_at?: string | null;
  subscription_expires_at?: string | null;
  subscription_last_payment_id?: string | null;
  role?: string;
  privacy_policy_accepted_at?: string | null;
  privacy_policy_version?: string | null;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  address: string;
  gstin?: string;
  created_at: string;
}

export interface InvoiceRow {
  id: string;
  user_id: string;
  invoice_number: string;
  client_id: string | null;
  client_name_snapshot: string;
  client_email_snapshot: string;
  client_phone_snapshot: string;
  client_company_snapshot: string;
  client_address_snapshot: string;
  invoice_date: string;
  due_date: string;
  tax_percent: number;
  discount_amount: number;
  currency_code: string;
  tax_label: string;
  status: InvoiceStatusDb;
  notes: string;
  payment_terms: string;
  purchase_order: string;
  project_name: string;
  terms_and_conditions: string;
  gst_supply_type: string;
  seller_gstin: string;
  client_gstin: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  upi_id: string;
  routing_number: string;
  iban: string;
  swift_code: string;
  bank_address: string;
  sort_code: string;
  page_size?: string;
  template_id?: string;
  additional_charges?: Json;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItemRow {
  id: string;
  invoice_id: string;
  service_name: string;
  service_description: string;
  qty: number;
  price: number;
  sort_order: number;
}

export interface InvoiceWithItems extends InvoiceRow {
  invoice_items: InvoiceItemRow[];
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          company_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          logo_url?: string | null;
          signature_url?: string | null;
          currency_code?: string;
          tax_label?: string;
          country_code?: string;
          default_bank_name?: string;
          default_account_number?: string;
          default_upi_id?: string;
          default_routing_number?: string;
          default_iban?: string;
          default_swift_code?: string;
          default_bank_address?: string;
          default_sort_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      clients: {
        Row: ClientRow;
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          email?: string;
          phone?: string;
          company_name?: string;
          address?: string;
          created_at?: string;
        };
        Update: Partial<ClientRow>;
        Relationships: [];
      };
      invoices: {
        Row: InvoiceRow;
        Insert: {
          id?: string;
          user_id: string;
          invoice_number: string;
          client_id?: string | null;
          client_name_snapshot?: string;
          client_email_snapshot?: string;
          client_phone_snapshot?: string;
          client_company_snapshot?: string;
          client_address_snapshot?: string;
          invoice_date?: string;
          due_date: string;
          tax_percent?: number;
          discount_amount?: number;
          currency_code?: string;
          tax_label?: string;
          status?: InvoiceStatusDb;
          notes?: string;
          bank_name?: string;
          account_number?: string;
          upi_id?: string;
          routing_number?: string;
          iban?: string;
          swift_code?: string;
          bank_address?: string;
          sort_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<InvoiceRow>;
        Relationships: [];
      };
      invoice_items: {
        Row: InvoiceItemRow;
        Insert: {
          id?: string;
          invoice_id: string;
          service_name?: string;
          service_description?: string;
          qty?: number;
          price?: number;
          sort_order?: number;
        };
        Update: Partial<InvoiceItemRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      invoice_status: InvoiceStatusDb;
    };
    CompositeTypes: Record<string, never>;
  };
}
