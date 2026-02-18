# LinkFusion — AI Agent Reference

Main reference for agentic coding agents operating in the LinkFusion codebase.

**DO NOT EDIT** these files without user permission.

---

## Quick Links

| Topic | Location |
|-------|----------|
| **Project Overview** | [below](#project-overview) |
| **Tech Stack** | [below](#tech-stack) |
| **Architecture & Database** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| **Frontend & Code Style** | [docs/FRONTEND.md](docs/FRONTEND.md) |
| **Design Patterns** | [skills/SKILL.md](skills/SKILL.md) |
| **Deployment & Commands** | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) |

---

## Project Overview

**LinkFusion** is a Bento-style personal profile & smart link page builder — think Linktree meets Notion's Markdown Editor meets Bento.me.

Users create a customizable profile page with:
- Draggable blocks (links, text, images, headings)
- Analytics tracking
- Smart redirect links
- Custom themes & layouts

**Target users:** Creators, indie hackers, developers.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router) |
| React | 19 |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Auth | BetterAuth (email + OAuth2) |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle |
| Validation | Zod |
| State Management | TanStack Query |
| Drag & Drop | react-grid-layout |
| Charts | Unovis |
| Deployment | Cloudflare Workers |

### Rendering Strategy

| Page | Mode | Reason |
|------|------|--------|
| `/[username]` | SSR (Edge) | OG meta tags, social preview, edge cache |
| `/editor` | `"use client"` | react-grid-layout, real-time state, DnD |
| `/analytics` | SSR | Server data fetch, no SEO need |
| `/settings` | SSR | Simple, no heavy interactivity |

### Backend Architecture

**Primary (Next.js):**
- API Routes / Server Actions
- Auth-protected operations
- CRUD profile/editor data
- Analytics queries
- File uploads

**Optional Edge Layer (Cloudflare Workers + Hono):**
- Smart link redirects (`GET /:slug`)
- Analytics ingestion (`POST /track`)

---

## Project Structure

```
app/
├── [username]/             # SSR — public profile page
├── editor/                 # "use client" — drag-drop editor
├── analytics/              # SSR — analytics dashboard
├── settings/               # SSR — account settings
├── api/                    # API routes
└── layout.tsx

components/
├── editor/                 # Editor-specific components
└── ui/                     # shadcn/ui components

drizzle/
└── schema.ts               # Database schema

lib/
├── auth.ts                 # BetterAuth setup
├── db.ts                   # Drizzle client
└── utils.ts
```

---

## What to Build Next

1. **Project initialization** — Next.js + dependencies setup
2. **Database setup** — Drizzle + Neon + initial migration
3. **Authentication** — BetterAuth + login/register pages
4. **Editor UI foundation** — BentoGrid + EditorContext + basic block rendering
5. **Persistence layer** — save/load blocks from DB with debounced autosave
6. **Public profile page** — `/[username]` SSR page with OG tags
7. **Analytics** — event tracking + dashboard
8. **Smart links** — custom short URLs with click tracking

---

## Optional / Post-MVP Features

- Rate limiting
- Developer analytics: PostHog, Umami
- QR code link sharing
- Custom domain support (CNAME mapping)
- Onboarding flow wizard
- Block templates / starter layouts
- Export/import profile config

---

## Commits

Tell the user when it's enough/time to commit. Don't run commit commands directly — just provide the commands in chat.

Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
