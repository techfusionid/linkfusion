# Architecture & Database

Backend architecture, database schema, API routes, and design decisions for LinkFusion.

---

## Database Schema (Drizzle)

File: `drizzle/schema.ts`

```typescript
import { pgTable, text, timestamp, boolean, integer, jsonb, index } from "drizzle-pg";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // UUID from auth provider
  email: text("email").notNull().unique(),
  role: text("role").default("user"), // future-proof: admin/user/etc
  createdAt: timestamp("created_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  username: text("username").notNull().unique(), // public slug
  name: text("name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  layoutPreset: text("layout_preset").default("classic"),
  theme: jsonb("theme"), // ThemeConfig JSON
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("profiles_user_idx").on(table.userId),
}));

export const blocks = pgTable("blocks", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => profiles.id)
    .notNull(),

  type: text("type").notNull(), // 'link' | 'text' | 'image' | 'heading'
  content: text("content"),
  url: text("url"),
  imageUrl: text("image_url"),
  bgColor: text("bg_color"),

  isHidden: boolean("is_hidden").default(false), // hide without delete

  sortOrder: integer("sort_order").default(0),

  layoutData: jsonb("layout_data"), // { x,y,w,h } from react-grid-layout

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  profileIdx: index("blocks_profile_idx").on(table.profileId),
}));

export const smartLinks = pgTable("smart_links", {
  id: text("id").primaryKey(),
  profileId: text("profile_id")
    .references(() => profiles.id)
    .notNull(),

  slug: text("slug").notNull().unique(),
  destinationUrl: text("destination_url").notNull(),
  title: text("title"),

  expiresAt: timestamp("expires_at"),
  clickCount: integer("click_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  profileIdx: index("smartlinks_profile_idx").on(table.profileId),
}));

export const analyticsEvents = pgTable("analytics_events", {
  id: text("id").primaryKey(),

  profileId: text("profile_id"),
  blockId: text("block_id"),
  smartLinkId: text("smart_link_id"),

  eventType: text("event_type").notNull(), // 'page_view' | 'block_click' | 'link_click'

  country: text("country"),
  device: text("device"),
  referrer: text("referrer"),

  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  profileIdx: index("analytics_profile_idx").on(table.profileId),
  blockIdx: index("analytics_block_idx").on(table.blockId),
  smartIdx: index("analytics_smart_idx").on(table.smartLinkId),
}));
```

---

## Design Decisions

### Users vs Profiles

- **users** = identity/auth layer
- **profiles** = public page config
- **profile** = the public page visitors see
- **editor** = the tool to edit profiles

**MVP**: 1 user = 1 profile. Schema allows multiple profiles for future Pro/agency features.

### Auth

- Support email+password AND OAuth2
- Password/session tables handled by BetterAuth
- `users` table stores minimal identity only
- `role` field added for future admin/moderation (default = "user")

### Blocks

- Nullable fields allowed in DB
- Validation enforced at Zod layer (more flexible & safe)
- `layoutData` uses JSONB for direct react-grid-layout output
- No need to split columns now (premature optimization)

### isHidden Flag

Hide blocks without deleting — useful for:
- Draft blocks
- Seasonal links
- Testing
- Preserving analytics history

This enables draft-mode style workflow (more advanced than Linktree).

### Editor State Saving

**Don't save on every drag** — too heavy & race-prone.

Use:
- Local state for real-time updates
- Autosave debounced (1–2s idle)
- Optional localStorage backup

**Rationale**: Smooth UX, no DB spam, crash-safe.

### Preview Mode

Preview/edit toggle is stored in React state / localStorage, **NOT** in DB.
It's a UI concern, not public configuration.

---

## API Routes

### Next.js API Routes (Core)

Used for: auth-protected operations, CRUD, analytics queries, uploads, onboarding

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/profile/me` | GET | Get current user profile |
| `/api/profile` | PUT | Update profile |
| `/api/blocks` | GET | Get all blocks |
| `/api/blocks` | POST | Create block |
| `/api/blocks/:id` | PUT | Update block |
| `/api/blocks/:id` | DELETE | Delete block |
| `/api/smart-links` | GET | Get smart links |
| `/api/smart-links` | POST | Create smart link |
| `/api/smart-links/:id` | PUT | Update smart link |
| `/api/smart-links/:id` | DELETE | Delete smart link |
| `/api/analytics` | GET | Get analytics data |

### Hono Worker (Edge Layer)

Used for: public, high-frequency, low-latency, simple logic endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/:slug` | GET | Smart link redirect (fast edge) |
| `/track` | POST | Ingest analytics event |

**Why in Worker**: Super-fast redirects, high-volume analytics ingestion, reduce main server load, edge caching/geo-detection.

---

## Cloudflare Bindings (Optional)

Access via `c.env` in Hono handlers:

```typescript
const { DB, KV, ANALYTICS, R2 } = c.env;
```

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 (optional) | Users, profiles, blocks, links |
| `DATABASE_URL` | Env string | Neon Postgres (primary DB) |
| `KV` | Workers KV | Smart link cache (`link:{slug}`) |
| `ANALYTICS` | Analytics Engine | Optional high-volume logging |
| `R2` | R2 Bucket | Avatar / image uploads |

*Optional bindings are not for MVP.*

---

## Data Model Types

Key types (defined in `app/editor/context.tsx`):

```typescript
type BlockType = "link" | "text" | "image" | "heading";

interface BentoBlockData {
  id: string;
  type: BlockType;
  content: string;
  url?: string;
  imageUrl?: string;
  bgColor?: string;
}

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
}

type LayoutPreset = "classic" | "bento";

interface ThemeConfig {
  bgColor: string;
  pattern: "none" | "dots" | "grid" | "lines";
  accentColor: string;
  cardRadius: "sm" | "md" | "lg" | "xl";
}

interface LayoutItem {
  i: string; // block id
  x: number; // col position
  y: number; // row position
  w: number; // width in cols
  h: number; // height in rows
}
```