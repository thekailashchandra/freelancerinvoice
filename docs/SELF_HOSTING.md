# Self-hosting Invoice for Freelance

Run the full product on your own server with **no subscription and no feature
gates**. The hosted Cloud plan exists for people who would rather not manage a
database.

## What you need

- Node.js 20+
- A Supabase project (Postgres, auth, and asset storage)
- Any Node host: a VPS, Railway, Render, Fly.io, or Vercel

## 1. Clone and install

```bash
git clone <your-repository-url>
cd invoice-for-freelance
npm install
cp .env.example .env.local
```

## 2. Connect Supabase

Follow [`docs/SUPABASE_SETUP.md`](./SUPABASE_SETUP.md), then fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

## 3. Apply the database migrations

Run every file in [`supabase/migrations`](../supabase/migrations) in order in the
Supabase SQL editor (or with the Supabase CLI). The subscription migration
(`018_cloud_subscription.sql`), brand color (`019_brand_color.sql`), invoice
template (`020_invoice_template.sql`), additional charges
(`021_invoice_additional_charges.sql`), and subscription provider
(`022_subscription_provider.sql`) migrations are recommended on all installs;
the app falls back gracefully if they are missing.

## 4. Turn off cloud billing

Add this to `.env.local`:

```env
NEXT_PUBLIC_SELF_HOSTED=true
```

That single flag:

- unlocks PDF download, printing, receipts, and every template
- hides the Cloud upgrade dialog and paywall banners
- tells the pricing page to show the self-hosted edition only
- leaves Razorpay completely unused

If you want to keep the Cloud UI but disable payments, use
`NEXT_PUBLIC_CLOUD_BILLING_ENABLED=false` instead.

## 5. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # production server
```

## 6. Optional configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for auth redirects and metadata |
| `NEXT_PUBLIC_GITHUB_URL` | Repository link shown in pricing/self-host CTAs |
| `SUPERADMIN_EMAILS` | Comma-separated emails allowed into `/admin` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Distributed rate limiting |
| `RECEIPT_SIGNING_SECRET` | Dedicated secret for signed receipt links |

## Running the hosted Cloud plan yourself

If you are the operator of the public instance and want to charge for Cloud:

1. Create a Razorpay merchant account for Indian INR payments and copy the live key ID and secret.
2. Create one-time Dodo Payments products priced at $5 and $19, then copy the API key, webhook key, and product IDs.
3. Set:

   ```env
   NEXT_PUBLIC_RAZORPAY_ENABLED=true
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   RAZORPAY_KEY_SECRET=your-live-secret
   RAZORPAY_WEBHOOK_SECRET=whsec_from_razorpay_dashboard

   DODO_PAYMENTS_API_KEY=your-dodo-api-key
   DODO_PAYMENTS_WEBHOOK_KEY=your-dodo-webhook-key
   DODO_PAYMENTS_ENVIRONMENT=live_mode
   DODO_PAYMENTS_PRODUCT_ID_MONTHLY=pdt_xxxxxxxxxxxxxxxxx
   DODO_PAYMENTS_PRODUCT_ID_YEARLY=pdt_xxxxxxxxxxxxxxxxx
   ```

4. Add a Razorpay webhook pointing to `https://your-domain/api/razorpay/webhook`
   with the events `payment.captured`, `payment.failed`, and
   `refund.processed`.
5. Add a Dodo webhook pointing to `https://your-domain/api/dodo/webhook`
   and subscribe to `payment.succeeded`. Each successful USD payment adds
   30 or 365 days of access, matching the no-auto-renew model used for India.
6. Leave `NEXT_PUBLIC_SELF_HOSTED` unset.

Prices live in [`lib/subscription.ts`](../lib/subscription.ts): ₹299/month or
₹999/year for India, and $5/month or $19/year for the rest of the world. Indian
customers use Razorpay. International customers use Dodo Payments. Adding another
payment extends from the current expiry.

## Notes

- Self-hosting still uses Supabase for authentication, Postgres, and storage.
  There is no SQLite/offline mode yet.
- Uploaded logos and signatures use Supabase storage buckets created by the
  migrations.
- The open-source license is MIT - see [`LICENSE`](../LICENSE).
