# Veloura

A full beauty shop built with the MERN stack: MongoDB, Express, React, and Node. The storefront is a cream-and-burgundy editorial layout with a catalog, product pages, bag, promo codes, guest checkout, and accounts.

Browsing and checkout work before a database is attached. Sign-in and saved orders turn on when you add MongoDB.

## Run it locally

```bash
npm install
npm install --prefix client
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:5000.

## Turn on accounts and saved orders

1. Create a free database on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` and a long `JWT_SECRET`.
4. Restart `npm run dev`.

Gift codes at checkout: `GLOW30` (30% off best sellers) and `WELCOME10` (10% off the order). Complimentary shipping starts at $75. Checkout uses cash on delivery.

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the repository on Vercel.
3. Framework preset: **Other**.
4. The included `vercel.json` builds the React app and routes `/api` to the Express server.
5. In Vercel project settings, add `MONGODB_URI` and `JWT_SECRET`, then redeploy.

The shop is usable as soon as the site is live. Add the two environment variables when you want accounts and orders to persist.

## What is included

- Home, shop with filters and search, product page, bag, checkout, order confirmation
- Register, sign in, and an account page for saved orders
- Express API for products, JWT auth, and orders
- Shared catalog and pricing used by both the React app and the API
