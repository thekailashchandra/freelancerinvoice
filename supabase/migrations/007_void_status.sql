-- Add void status for cancelled invoices
ALTER TYPE public.invoice_status ADD VALUE IF NOT EXISTS 'void';
