# Invoice for Freelance

A monochrome invoicing studio for freelancers - live preview, cloud history, and
client-ready PDFs. **Open source and free to self-host.** The hosted Cloud plan
(₹299/month or ₹999/year in India, $5/month or $19/year elsewhere) funds the
public instance.

## Features

- 📊 Dashboard with invoice analytics
- ✍️ Create & edit invoices with live preview
- 📄 PDF export & print (jsPDF + html2canvas)
- ➕ Custom additional charges with labels
- 📁 Invoice history with search & status filter
- 🖤 Black-and-white editorial UI with light/dark mode
- ☁️ Supabase cloud sync (auth, profiles, invoices)
- 🔐 Row-level security for every account
- 📱 Fully responsive (mobile drawer sidebar)

## Editions

| Edition | Price | What you get |
| --- | --- | --- |
| **Cloud** | ₹299/month or ₹999/year in India · $5/month or $19/year elsewhere | Hosted workspace, PDF download, print, brand colors, every template |
| **Cloud preview** | Free | Create, edit, and preview invoices; exports locked |
| **Self-hosted** | Free, MIT | Every feature unlocked on your own server |

Set `NEXT_PUBLIC_SELF_HOSTED=true` to run the self-hosted edition. See
[`docs/SELF_HOSTING.md`](docs/SELF_HOSTING.md).

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL, publishable key, and secret key (see docs/SUPABASE_SETUP.md)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (the dev script always uses port **3000**).

### Docker

Docker runs the app, while Supabase remains your external project. After
creating the Supabase project and running the migrations:

```bash
cp .env.docker.example .env
# Fill in Supabase URL, publishable key, secret key, and public site URL
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000). See
[`docs/SELF_HOSTING.md`](docs/SELF_HOSTING.md#run-with-docker-compose) for
updates, ports, and rebuild notes.

### Cloud billing

The hosted plan uses Razorpay for India and Dodo Payments for international
USD passes. Add the live keys, product IDs, and webhook secrets, then run
the latest Supabase migrations:
`018_cloud_subscription.sql`, `019_brand_color.sql`,
`020_invoice_template.sql`, `021_invoice_additional_charges.sql`, and
`022_subscription_provider.sql`. Leave `NEXT_PUBLIC_SELF_HOSTED` unset. Full steps:
[`docs/SELF_HOSTING.md#running-the-hosted-cloud-plan-yourself`](docs/SELF_HOSTING.md#running-the-hosted-cloud-plan-yourself).

### Dev server stuck on "Starting…" or EPERM errors?

On Windows this usually means **several `next dev` processes** are still running and locking `.next`.

1. Stop **every** terminal running `npm run dev` (`Ctrl+C`).
2. In Task Manager, end any leftover **Node.js** processes for this project (optional).
3. Run:

```bash
npm run dev:clean
```

If clean fails, close Cursor/VS Code terminals, delete the `.next` folder manually, then `npm run dev` again.

## Deploy on Vercel

```bash
npm run build
```

Push to GitHub and import the repo in [Vercel](https://vercel.com).

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- Framer Motion
- Lucide React
- jsPDF + html2canvas
- Sonner (toasts)

## Project Structure

```
app/           # Pages (dashboard, create, history, settings)
components/    # UI & feature components
components/ui/ # shadcn-style primitives
hooks/         # Custom React hooks
lib/           # Utils, storage, PDF, calculations
types/         # TypeScript interfaces
data/          # Navigation & defaults
```

## License

MIT
