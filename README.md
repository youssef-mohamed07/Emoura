# Emoura

E-commerce site for Emoura natural beauty products. Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

The Next.js app lives in [`next-app/`](./next-app).

## Features

- Bilingual storefront (Arabic / English)
- Product catalog with filters, sort, search, and favorites
- Cart and Buy Now flows
- Checkout with WhatsApp / InstaPay / Vodafone Cash payment options
- Egyptian governorates and phone validation
- Order email notifications via Gmail SMTP
- Fully responsive, RTL-first design

## Run locally

```bash
cd next-app
npm install
cp .env.example .env.local   # fill in Gmail SMTP credentials
npm run dev
```

The dev server starts on http://localhost:3000.

## Deploy

Works on Vercel out of the box. Set the env vars from `next-app/.env.example` in the project settings.
