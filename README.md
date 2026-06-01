# InvoiceFlow — Freelancer Invoice Generator

A premium, frontend-only invoice generator for freelancers and agencies. Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Framer Motion**.

## Features

- 📊 Dashboard with animated analytics
- ✍️ Create & edit invoices with live preview
- 📄 PDF export & print (jsPDF + html2canvas)
- 📁 Invoice history with search & status filter
- 🌙 Dark mode (default) with theme toggle
- 💾 localStorage persistence (no backend)
- 📱 Fully responsive (mobile drawer sidebar)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### "Internal Server Error" in dev?

This usually means a **stale dev server** or a **corrupted `.next` cache** (common on Windows).

1. Stop all running dev servers (`Ctrl+C` in every terminal running `npm run dev`).
2. Run a clean start:

```bash
npm run dev:clean
```

Or manually: delete the `.next` folder, then `npm run dev`.

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
