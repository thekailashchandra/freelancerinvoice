# Supabase setup for Invoice for Freelance

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Copy **Project URL**, **publishable** key, and **secret** key from **Settings → API Keys**.

## 2. Configure the Next.js app

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Dashboard → API Keys → **Publishable**)
- `SUPABASE_SECRET_KEY` (Dashboard → API Keys → **Secret** - server-only)

Then restart `npm run dev`.

## 3. Run the database migrations

Run **both** files in order:

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste and run `supabase/migrations/001_initial_schema.sql`.
3. Paste and run `supabase/migrations/002_country_and_payment_fields.sql` (country + payment columns).

This creates:

- `profiles`, `clients`, `invoices`, `invoice_items`
- Row Level Security policies (users only see their own rows)
- `handle_new_user()` trigger (auto-creates a profile on signup)
- `invoice-assets` storage bucket and folder policies

## 4. Enable auth providers & URL configuration

1. **Authentication → Providers → Email** - enable Email.
2. For local dev, disable **Confirm email** if you want instant sign-in after signup.
3. **Authentication → Providers → Google** - enable Google:
   - In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create **OAuth client ID** → **Web application**:
     - **Authorized JavaScript origins:** `http://localhost:3000`, `https://www.invoiceforfreelance.com`
     - **Authorized redirect URIs:** `https://<project-ref>.supabase.co/auth/v1/callback` (from Supabase Google provider page)
   - **APIs & Services → OAuth consent screen** (this controls the name users see):
     - **App name:** `Invoice for Freelance`
     - **User support email:** your email
     - **App logo:** upload your brand logo (optional)
     - **Application home page:** `https://www.invoiceforfreelance.com`
     - **Authorized domains:** `invoiceforfreelance.com`
   - Paste **Client ID** + **Client Secret** into Supabase → Google provider → Save.
   - Add the same Client ID to `.env.local`:
     - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com`
4. **Authentication → URL Configuration** (required for localhost):
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs** (add all):
     - `http://localhost:3000/**`
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/callback?next=/onboarding`

4. `.env.local` must include all three keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY` (required for signup on the server)

   You do **not** need `NEXT_PUBLIC_SITE_URL` for local dev (the app uses `http://localhost:3000` automatically).

Email/password auth runs via **server actions**. Google sign-in uses **Google Identity Services** + Supabase `signInWithIdToken`, so the consent screen shows your app name instead of `*.supabase.co`.

### Production (`https://www.invoiceforfreelance.com`)

Set in `.env.local` / Vercel:

- `NEXT_PUBLIC_SITE_URL=https://www.invoiceforfreelance.com`

Supabase **Site URL** and **Redirect URLs** must include:

- `https://www.invoiceforfreelance.com`
- `https://www.invoiceforfreelance.com/auth/callback`
- `https://www.invoiceforfreelance.com/auth/callback?next=/onboarding`

## 5. Storage bucket (if migration insert failed)

If the bucket was not created by SQL:

1. **Storage → New bucket**
2. Name: `invoice-assets`
3. Public bucket: **on**
4. Re-run the storage policy section from the migration file.

Upload paths look like: `{user_id}/logo.png`, `{user_id}/signature.png`.

## 6. Troubleshooting “fetch failed” on signup

If signup shows **fetch failed** but `.env.local` looks correct:

1. **Shell env overrides `.env.local`** - Next.js will not replace variables that are already set in the terminal or Windows. Check PowerShell:
   ```powershell
   $env:NEXT_PUBLIC_SUPABASE_URL
   ```
   If this prints `https://example.supabase.co` (or any placeholder), remove it:
   - **Settings → System → About → Advanced system settings → Environment Variables**
   - Delete any `NEXT_PUBLIC_SUPABASE_*` entries under User or System.
   - Close Cursor/VS Code and all terminals, then reopen the project.

2. **Clear the dev cache** after fixing env:
   ```bash
   npm run dev:clean
   ```

3. Use **http://localhost:3000** (port 3000 only).

## 7. Smoke test

1. Sign up at `/signup` → complete `/onboarding`.
2. Open `/settings` - upload logo/signature.
3. Create an invoice at `/create-invoice` and **Save Invoice**.
4. Confirm rows in **Table Editor** and files under **Storage**.

## 8. Route map

| Path | Purpose |
|------|---------|
| `/login`, `/signup` | Auth |
| `/onboarding` | First-time company setup |
| `/dashboard` | Analytics |
| `/create-invoice` | Editor |
| `/invoice-history` | List + search |
| `/settings` | Company profile |

Legacy URLs `/create` and `/history` redirect to the new paths.
