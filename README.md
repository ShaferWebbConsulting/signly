# Signly

Signly is a secure, modern e-signature platform that makes document signing fast and effortless. Upload, send, sign, and manage contracts from anywhere. Built for individuals, businesses, and teams, Signly streamlines approvals, reduces paperwork, and keeps documents organized and legally compliant.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Install Dependencies](#install-dependencies)
- [Database Setup](#database-setup)
- [Run Prisma Migrations](#run-prisma-migrations)
- [Start the Dev Server](#start-the-dev-server)
- [Open the App](#open-the-app)
- [Useful npm Commands](#useful-npm-commands)
- [Authentication Setup](#authentication-setup)
- [Stripe Setup](#stripe-setup)
- [AWS / S3 / KMS Setup](#aws--s3--kms-setup)
- [Future: Blockchain / Hash Anchoring](#future-blockchain--hash-anchoring)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

Get Signly running locally in five steps:

```bash
# 1. Clone the repo
git clone https://github.com/ShaferWebbConsulting/signly.git
cd signly

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.example .env.local
# Edit .env.local — at minimum set DATABASE_URL and AUTH_SECRET (see below)

# 4. Push the database schema
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. That's it!

---

## Project Overview

Signly lets users:

- Create and manage contracts with a rich-text editor (Tiptap)
- Invite participants to sign via unique, tokenised links
- Collect typed or drawn signatures
- Track every action through a full audit log
- Manage subscriptions via Stripe (Free, Pro, Business)
- Store finalised contract snapshots in AWS S3 with SHA-256 hashes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database ORM | [Prisma 7](https://www.prisma.io/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| Authentication | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with credentials + Prisma adapter |
| Rich Text Editor | [Tiptap 3](https://tiptap.dev/) |
| Payments | [Stripe](https://stripe.com/) |
| File Storage | [AWS S3](https://aws.amazon.com/s3/) |
| Encryption | [AWS KMS](https://aws.amazon.com/kms/) (optional) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |

---

## Prerequisites

Make sure the following are installed on your machine before you start:

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **npm** v9+ (bundled with Node), or **pnpm** v8+, or **yarn** v1.22+
- **PostgreSQL** v14 or later — [postgresql.org](https://www.postgresql.org/download/) or use a managed service such as [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
- **Git** — [git-scm.com](https://git-scm.com)

> **Tip:** The quickest way to get a local PostgreSQL database is with Docker:
> ```bash
> docker run --name signly-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=signly -p 5432:5432 -d postgres:16
> ```

---

## Environment Variables

Create a `.env.local` file in the project root (Next.js loads this automatically in development). A minimal configuration looks like this:

```env
# ─── Database ────────────────────────────────────────────────────────────────
# PostgreSQL connection string
DATABASE_URL="******localhost:5432/signly"

# ─── Authentication ──────────────────────────────────────────────────────────
# Generate a random secret: openssl rand -base64 32
AUTH_SECRET="replace-with-a-random-secret"
# The canonical URL of your app (used by NextAuth for redirects)
NEXTAUTH_URL="http://localhost:3000"

# ─── Stripe (optional for local dev) ─────────────────────────────────────────
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# ─── AWS (optional for local dev) ────────────────────────────────────────────
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="signly-contracts"
AWS_KMS_KEY_ID="arn:aws:kms:us-east-1:..."   # optional
```

> **Required for the app to boot:** `DATABASE_URL` and `AUTH_SECRET`.  
> All other variables are optional locally — features that depend on them (Stripe billing, S3 uploads, KMS signing) will be gracefully disabled.

---

## Install Dependencies

Choose your preferred package manager:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

---

## Database Setup

1. **Create a PostgreSQL database** (skip if you already have one):

   ```bash
   # Using psql
   createdb signly

   # Or using Docker (see Prerequisites above)
   ```

2. **Set `DATABASE_URL`** in `.env.local` to point at that database.

3. **Generate the Prisma client:**

   ```bash
   npx prisma generate
   ```

---

## Run Prisma Migrations

### Option A — Push schema directly (recommended for local dev)

This syncs the database schema without creating migration files. Ideal when you just want to get started:

```bash
npx prisma db push
```

### Option B — Run migrations (recommended for staging / production)

If the project already has migration files (in `prisma/migrations/`), apply them:

```bash
npx prisma migrate deploy
```

To create a new migration after changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe-your-change
```

### Explore your data

After migrating, you can browse the database in a visual UI:

```bash
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555).

---

## Start the Dev Server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

The terminal will show:

```
▲ Next.js 16.x.x
- Local: http://localhost:3000
```

The server watches for file changes and hot-reloads automatically.

---

## Open the App

Navigate to [http://localhost:3000](http://localhost:3000).

- **Register** a new account at `/register`
- **Log in** at `/login`
- **Dashboard** is at `/dashboard`

---

## Useful npm Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server (requires a build first) |
| `npm run lint` | Run ESLint across the project |
| `npx prisma generate` | Regenerate the Prisma client after schema changes |
| `npx prisma db push` | Sync schema to the database (no migration files) |
| `npx prisma migrate dev` | Create and apply a new migration |
| `npx prisma migrate deploy` | Apply pending migrations (CI / production) |
| `npx prisma studio` | Open the Prisma visual database browser |

---

## Authentication Setup

Signly uses **NextAuth.js v5 (Auth.js)** with a **Credentials provider** (email + bcrypt-hashed password) and a **Prisma adapter** that stores sessions and accounts in PostgreSQL.

**What you need locally:**

1. Set `AUTH_SECRET` to any random string (minimum 32 characters):
   ```bash
   openssl rand -base64 32
   ```
2. Set `NEXTAUTH_URL=http://localhost:3000`.
3. Run `npx prisma db push` so the `User`, `Account`, `Session`, and `VerificationToken` tables exist.
4. Register a user through the app UI at `/register` — there is no seed script required.

**OAuth providers** (e.g. Google, GitHub) are not wired up by default but can be added to `src/lib/auth.ts` following the [Auth.js provider docs](https://authjs.dev/getting-started/providers).

---

## Stripe Setup

Stripe powers the subscription billing (Free / Pro / Business plans).

**Local setup:**

1. Create a free [Stripe account](https://dashboard.stripe.com/register) and grab your **test** API keys from the Stripe Dashboard.
2. Add the keys to `.env.local`:
   ```env
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
3. To test webhooks locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events to your dev server:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
   Copy the **webhook signing secret** printed by the CLI into `STRIPE_WEBHOOK_SECRET`.

> **Stripe is optional for local development.** If the keys are absent, the Stripe client initialises as `null` and billing endpoints will return an error — the rest of the app works normally.

---

## AWS / S3 / KMS Setup

AWS services power two features:

- **S3** — stores finalised contract snapshots (JSON + hash)
- **KMS** — optional envelope encryption for contract content

**Local setup:**

1. Create an S3 bucket and an IAM user with `s3:PutObject` and `s3:GetObject` permissions on that bucket.
2. Optionally create a KMS symmetric key and note its ARN.
3. Add to `.env.local`:
   ```env
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="AKIA..."
   AWS_SECRET_ACCESS_KEY="..."
   AWS_S3_BUCKET="your-bucket-name"
   AWS_KMS_KEY_ID="arn:aws:kms:..."   # optional
   ```

> **AWS is optional for local development.** When the credentials are absent, `s3` and `kms` clients initialise as `null` and upload/encryption steps are silently skipped.

---

## Future: Blockchain / Hash Anchoring

Each finalised contract already receives a **SHA-256 hash** of its content (see `src/lib/hash.ts`) stored in the `Contract.hash` field and in `ContractSnapshot`. This hash can serve as the input for future tamper-evidence features, including:

- **Blockchain anchoring** — submitting the hash to a public blockchain (e.g. Ethereum, Bitcoin via OP_RETURN) to create an immutable timestamp
- **Verifiable credentials / DID** — wrapping the hash in a W3C Verifiable Credential
- **Third-party notarisation APIs** — services such as Chainpoint or OpenTimestamps

No additional environment variables are required for these features today. The groundwork (hashing + snapshot storage) is already in place.

---

## Troubleshooting

### `Error: Cannot find module '.prisma/client/default'`

The Prisma client has not been generated yet. Run:

```bash
npx prisma generate
```

### `PrismaClientInitializationError: Can't reach database server`

- Check that your PostgreSQL server is running.
- Verify `DATABASE_URL` in `.env.local` is correct (host, port, username, password, database name).
- If using Docker, make sure the container is started: `docker start signly-db`.

### `Error: Please set AUTH_SECRET`

Set a random value for `AUTH_SECRET` in `.env.local`:

```bash
echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Port 3000 already in use

Kill the process using port 3000 or start on a different port:

```bash
npm run dev -- --port 3001
```

### Tailwind styles not applying

Make sure you have run `npm install` — the PostCSS plugin for Tailwind v4 is a dev dependency. A full reinstall sometimes helps:

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### `Module not found` after pulling new changes

Dependencies may have changed. Run `npm install` again after every `git pull`.

### Prisma migration errors in production

Never use `prisma db push` against a production database. Use `prisma migrate deploy` which only applies pre-generated, reviewed migration files.
