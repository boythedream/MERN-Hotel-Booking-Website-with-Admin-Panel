# Meridian House — MERN Hotel Booking Platform

A full-featured hotel booking website built with MongoDB, Express, React, and Node.js.

## Features

- **Auth** — JWT-based register/login (httpOnly cookie + bearer token fallback), role-based access (guest/admin)
- **Rooms** — browse, filter by category/price/search, live availability check by date range
- **Bookings** — date-conflict-safe reservations, per-user booking history, cancellation
- **Payments** — Stripe Payment Intents + Stripe Elements checkout
- **Admin dashboard** — stats overview, room CRUD, booking status management, user/role management

## Project structure

```
hotel-booking-mern/
├── backend/     Express API, MongoDB models, JWT auth, Stripe integration
└── frontend/    React (Vite) + Tailwind CSS SPA
```

## Prerequisites

- Node.js 18+
- MongoDB (local install or a free MongoDB Atlas cluster)
- A Stripe account (test mode is fine) if you want payments working

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/hotel_booking
JWT_SECRET=some_long_random_string
STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=http://localhost:5173
```

Seed sample rooms + demo accounts (optional but recommended):

```bash
npm run seed
```

This creates:
- Admin login: `admin@hotel.com` / `admin123`
- Guest login: `guest@hotel.com` / `guest123`
- 6 sample rooms across all categories

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

Start the dev server:

```bash
npm run dev
```

The site runs at `http://localhost:5173`.

> If you skip Stripe keys, everything works except the payment step — bookings are still created as "pending / unpaid" and admins can mark them confirmed manually.

## API overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/rooms` | Public (supports `?category&minPrice&maxPrice&capacity&search&sort`) |
| GET | `/api/rooms/:id/availability?checkIn&checkOut` | Public |
| POST | `/api/rooms` | Admin |
| POST | `/api/bookings` | Guest (checks date conflicts server-side) |
| GET | `/api/bookings/my` | Guest |
| PUT | `/api/bookings/:id/cancel` | Owner or admin |
| GET | `/api/bookings` | Admin |
| POST | `/api/payments/create-payment-intent` | Guest |
| GET | `/api/users` | Admin |

## Deployment notes

- Backend: any Node host (Render, Railway, Fly.io). Set env vars, point `MONGO_URI` to Atlas.
- Frontend: Vercel/Netlify. Set `VITE_API_URL` to your deployed backend URL, update backend `CLIENT_URL` to match your deployed frontend origin (for CORS).
- Switch Stripe to live keys only once you've tested the full flow in test mode.
