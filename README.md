# Invoice for Freelance

Freelancer invoice SaaS at [invoiceforfreelance.com](https://www.invoiceforfreelance.com/). Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Framer Motion**.

## Features

- 📊 Dashboard with animated analytics
- ✍️ Create & edit invoices with live preview
- 📄 PDF export & print (jsPDF + html2canvas)
- 📁 Invoice history with search & status filter
- 🌙 Dark mode (default) with theme toggle
- ☁️ Supabase cloud sync (auth, profiles, invoices)
- 📱 Fully responsive (mobile drawer sidebar)

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL, publishable key, and secret key (see docs/SUPABASE_SETUP.md)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (the dev script always uses port **3000**).

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
