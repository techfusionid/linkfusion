# Deployment & Commands

Development commands, environment setup, and deployment guide for LinkFusion.

---

## Commands

```bash
# Development
pnpm dev                  # Next.js dev server
pnpm build                # Production build
pnpm start                # Start production server

# Database
pnpm db:migrate           # Run Drizzle migrations
pnpm db:push              # Push schema changes to DB
pnpm db:studio            # Drizzle Studio (DB GUI)

# Worker (Cloudflare)
pnpm worker:dev           # Hono worker dev (wrangler dev)
pnpm worker:deploy        # Deploy to Cloudflare Workers

# Code Quality
pnpm lint:fix             # ESLint with auto-fix (run before commit)
pnpm type-check           # TypeScript type check
```

---

## Environment Variables

### Required

```bash
# Database
DATABASE_URL=postgresql://...

# Auth (BetterAuth)
BETTERAUTH_SECRET=your-secret-key
BETTERAUTH_URL=http://localhost:3000

# OAuth (optional for MVP)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Optional (Cloudflare Workers)

```bash
# Worker
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx

# R2 (image uploads)
R2_BUCKET_NAME=linkfusion-uploads
```

---

## Deployment Checklist

### First Time Setup

1. **Neon Database**
   - Create project at [neon.tech](https://neon.tech)
   - Get connection string
   - Add `DATABASE_URL` to env

2. **BetterAuth Setup**
   - Generate `BETTERAUTH_SECRET` (use `openssl rand -base64 32`)
   - Add to env variables

3. **Run Migrations**
   ```bash
   pnpm db:migrate
   ```

### Deploy to Production

1. **Vercel (Next.js)**
   ```bash
   vercel login
   vercel link
   vercel env add DATABASE_URL
   vercel env add BETTERAUTH_SECRET
   vercel --prod
   ```

2. **Cloudflare Workers** (optional for MVP)
   ```bash
   pnpm worker:deploy
   ```

---

## Deployment Structure

```
Production
├── Vercel / Cloudflare Pages    # Next.js frontend + API
└── Cloudflare Workers           # Edge layer (redirects, tracking)
```

**MVP**: Deploy Next.js only. Add Workers later for edge optimization.
