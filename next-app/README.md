# Emoura · Next.js

E-commerce site for Emoura natural beauty products. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Stack

- Next.js 14 (App Router, server components by default)
- React 18, TypeScript
- Tailwind CSS
- nodemailer for order email notifications

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in Gmail SMTP credentials
npm run dev
```

The dev server starts on http://localhost:3000.

## Routes

- `/` – home (hero, categories, products grid, filters/sort)
- `/about` – about page
- `/contact` – contact form (WhatsApp + email links)
- `/favorites` – saved favorites (localStorage)
- `/checkout` – order form (validates Egyptian phone)
- `/success` – order confirmation
- `POST /api/send-order` – sends order email via Gmail SMTP

## State

- Cart and favorites persist in `localStorage` under `emoura-cart` and `emoura-favorites`.
- Language (ar/en) persists under `emoura-lang`.
- All shared state lives in `components/StoreProvider.tsx` and `components/UIProvider.tsx`.

## Deploy

The app works on Vercel out of the box. Set the env vars from `.env.example` in the project settings.

For Netlify, use `@netlify/plugin-nextjs`.
