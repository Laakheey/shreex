# Shreex - High-Yield Token Investment Platform

A full-stack investment platform built with **Next.js 15**, **Neon PostgreSQL** (Drizzle ORM), **Clerk Auth**, and **Tailwind CSS v4**.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
- **Database:** Neon PostgreSQL via `@neondatabase/serverless`
- **ORM:** Drizzle ORM with type-safe schema
- **Auth:** Clerk (`@clerk/nextjs`) with middleware protection
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Deployment:** Vercel / any Node.js host

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Laakheey/shreex.git
cd shreex
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

### 3. Push database schema

```bash
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes (withdrawals, referral, webhooks)
    dashboard/            # User dashboard (SSR + client components)
    admin/                # Admin panel (protected)
    sign-in/              # Clerk sign-in
    sign-up/              # Clerk sign-up
  components/
    ui/                   # Shared UI (Navbar, Hero, Plans, About)
    dashboard/            # Dashboard components (investments, ROI, support)
    admin/                # Admin components (users, withdrawals, chat)
  lib/
    db/                   # Drizzle schema + Neon connection
    actions/              # Server actions (user, investments, admin, etc.)
    utils/                # Utility functions (investment windows)
```

## Database

Uses Drizzle ORM with Neon PostgreSQL. Schema is defined in `src/lib/db/schema.ts`.

```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema directly
npm run db:studio     # Open Drizzle Studio
```

## Key Features

- **Token Purchases:** Buy tokens via USDT (TRC20) with payment proof upload
- **Investment Plans:** Monthly (10% ROI), 6-Month (1.75x), Yearly (3x)
- **Withdrawals:** Tron wallet or Mobile Money cashout
- **Referral System:** Earn bonuses on referred user investments
- **Admin Panel:** User management, withdrawal processing, support chat
- **ROI Tracking:** Lifetime/monthly/yearly earnings breakdown
