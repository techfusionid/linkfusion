# LinkFusion — Frontend Design Skills

This skill guides creation of distinctive, production-grade frontend interfaces for **LinkFusion** — a minimalist, open-source Link-in-Bio editor. Avoid generic "AI slop" aesthetics. Every component must feel intentional, cohesive, and native to the existing design system.

---

## Project Context

**What it is:** A single-page Link-in-Bio editor. One account → one slug → one live public profile. Users go from login to a live page in under 3 minutes.

**Who uses it:** Creators, indie hackers, developers — people who care about quality, performance, and aesthetics.

**Core editor model:**

- `EditorProvider` (React Context) owns all state: `blocks`, `layout`, `profile`, `theme`, `previewMode`, `layoutPreset`
- `react-grid-layout` drives the draggable/resizable bento canvas
- Block types: `link | text | image | heading`
- Layout presets: `classic` (profile top, max-w 680px) and `bento` (profile left sidebar, max-w 960px)
- Bottom toolbar is the primary control surface; sidebar is secondary / desktop-only

---

## Design Thinking — Before Coding

Commit to a **BOLD aesthetic direction** before touching code:

**Purpose:** What problem does this UI solve? Who sees it — the editor (creator) or the visitor (public profile)?

**Tone:** Pick an extreme and execute it precisely:

- Editor UI → refined, calm, dark sidebar + light canvas. Confident utility.
- Public profile → the creator's aesthetic. Could be brutalist, editorial, maximalist, or zen.
- Marketing/landing → high-contrast, typographically expressive, memorable.

**Differentiation:** What is the one thing a user will remember? Commit to it.

**CRITICAL:** No design should look the same. Vary light/dark, typography pairs, spatial rhythm. Never default to the obvious.

---

## Design System — Use These, Not Raw Values

### Semantic Tokens (app/globals.css → tailwind.config.ts)

Always use semantic tokens. **Never hardcode hex/rgb values in components.**

```tsx
// ✅ Correct
<div className="bg-card text-card-foreground border-border" />
<div className="bg-sidebar text-sidebar-foreground border-sidebar-border" />

// ❌ Wrong
<div className="bg-white text-gray-900 border-gray-200" />
<div style={{ backgroundColor: '#1a1a2e' }} />  // only for user-customizable bgColor
```

**Core tokens:**
| Token | Usage |
|---|---|
| `bg-background` | Page/canvas background |
| `bg-card` | Popovers, toolbar, navbar, white surfaces |
| `bg-sidebar` | Dark left sidebar |
| `bg-primary` | Active states, selected, CTA buttons |
| `bg-secondary` | Hover backgrounds, inactive tabs |
| `bg-muted` | Subtle fills |
| `text-foreground` | Primary text on light bg |
| `text-muted-foreground` | Labels, hints, secondary text |
| `text-sidebar-foreground` | Text inside dark sidebar |
| `text-sidebar-accent-foreground` | Active/highlighted sidebar text |
| `border-border` | General dividers |
| `border-sidebar-border` | Sidebar-specific dividers |
| `text-destructive` | Delete actions |
| `shadow-card` | Resting card shadow |
| `shadow-elevated` | Popovers, dropdowns, active states |

**Exception:** User-chosen `block.bgColor` and `theme.bgColor` are raw hex values applied via `style={{ backgroundColor }}`. This is intentional — it's user data, not design system.

### Typography

```tsx
// Display / headings
<h1 className="font-display font-bold">  // Space Grotesk
// Body / UI
<p className="font-body">               // Inter (default body)
// Labels / meta
<span className="text-xs uppercase tracking-wider text-muted-foreground">
```

**Rules:**

- `font-display` for brand name ("LinkFusion"), section headings, block headings
- Body font for all UI chrome, labels, descriptions
- `text-[10px]` or `text-[11px]` for micro-labels (color pickers, dimension hints)
- `uppercase tracking-wider` for section label pattern inside popovers/sidebar

### Radius

Controlled via `theme.cardRadius` for bento blocks. Editor chrome uses:

```tsx
rounded-lg   // popovers, inputs, toolbar pills
rounded-xl   // larger panels, theme popover
rounded-full // icon buttons, avatar, color swatches, toolbar pills
rounded-2xl  // main floating panels (BottomToolbar popover)
```

---

## Component Patterns

### Floating Toolbar (BottomToolbar)

- `fixed bottom-4 left-1/2 -translate-x-1/2` pill shape
- `bg-card border rounded-full p-1.5 shadow-elevated`
- Active state: `bg-foreground text-background` (device toggle) or `bg-primary text-primary-foreground` (action buttons)
- Popovers slide up: `fixed bottom-20 left-1/2 -translate-x-1/2 ... animate-in slide-in-from-bottom-2 fade-in duration-200`
- Always include a backdrop `div` at `z-40` to close on outside click

### Sidebar (EditorSidebar)

- `w-72 bg-sidebar border-r border-sidebar-border h-screen overflow-hidden`
- Tab pattern: `bg-sidebar-accent text-sidebar-accent-foreground` for active, hover on inactive
- Inputs inside sidebar: `bg-sidebar-accent text-sidebar-accent-foreground rounded-lg p-2.5 text-sm border-0 outline-none focus:ring-1 focus:ring-sidebar-ring`

### Navbar

- `h-12 bg-card/80 backdrop-blur-sm border-b z-50`
- Brand: `font-display font-bold` with `text-primary` on first word only ("**Link**Fusion")
- Edit/Preview toggle: `bg-primary text-primary-foreground` vs `bg-accent text-accent-foreground ring-1 ring-primary/30`

### Block Controls (on-canvas)

- Hover/select ring: `ring-2 ring-primary shadow-elevated` for selected, `ring-1 ring-primary/40` on hover
- Floating edit button: `-top-3 -left-3 z-[60] w-8 h-8 rounded-full bg-card border shadow-elevated`
- Delete button: `-top-3 -right-3` same treatment
- Edit popover: `absolute top-0 right-full mr-2 bg-card border rounded-xl p-4 shadow-elevated z-[80] w-[220px] animate-in fade-in slide-in-from-right-2`

### Color Swatches (pattern used in multiple places)

```tsx
<button
	onClick={() => onSelect(color)}
	className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
		isSelected ? "border-foreground scale-110" : "border-border"
	}`}
	style={{ backgroundColor: color }}
/>
```

### Add Block / Empty State

- Dashed border: `border-2 border-dashed border-border/60 rounded-xl`
- Hover: `hover:border-primary/30 hover:bg-card/50`
- Icon: `group-hover:scale-110 transition-transform`

### Confirm Delete Popover (inline, not modal)

- `absolute top-8 right-0 bg-card border rounded-lg p-3 shadow-elevated z-[70] min-w-[160px]`
- Cancel: `bg-secondary text-secondary-foreground`
- Delete: `bg-destructive text-destructive-foreground`

---

## Dynamic Color Logic

Blocks have user-chosen `bgColor` (hex). Always adapt text/icons to the background:

```ts
function isDarkColor(hex: string): boolean {
	const c = hex.replace("#", "");
	const r = parseInt(c.substring(0, 2), 16);
	const g = parseInt(c.substring(2, 4), 16);
	const b = parseInt(c.substring(4, 6), 16);
	return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

function textColorFor(bgColor?: string): string {
	if (!bgColor) return "inherit";
	return isDarkColor(bgColor) ? "#f1f5f9" : "#1e293b";
}

// Derived
const txtColor = textColorFor(block.bgColor);
const subtleColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
const iconBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
```

Same logic applies to `ProfileSection` text when `theme.bgColor` is dark.

---

## Canvas & Background Patterns

Pattern rendering lives in `app/editor/page.tsx` or a utility function:

```ts
function getPatternStyle(
	pattern: string,
	bgColor: string,
): React.CSSProperties {
	const bg = bgColor || "#f8fafc";
	switch (pattern) {
		case "dots":
			return {
				backgroundColor: bg,
				backgroundImage:
					"radial-gradient(circle, #00000008 1.5px, transparent 1.5px)",
				backgroundSize: "20px 20px",
			};
		case "grid":
			return {
				backgroundColor: bg,
				backgroundImage:
					"linear-gradient(#00000006 1px, transparent 1px), linear-gradient(90deg, #00000006 1px, transparent 1px)",
				backgroundSize: "24px 24px",
			};
		case "lines":
			return {
				backgroundColor: bg,
				backgroundImage: "linear-gradient(#00000006 1px, transparent 1px)",
				backgroundSize: "100% 24px",
			};
		default:
			return { backgroundColor: bg };
	}
}
```

New patterns follow this same format. Keep opacity ultra-low (`#00000006`–`#0000000a`) to stay subtle.

---

## State Architecture

```
EditorContext (single source of truth)
├── blocks: BentoBlockData[]        // content + color per block
├── layout: LayoutItem[]            // {i, x, y, w, h} for react-grid-layout
├── selectedBlockId: string | null  // drives sidebar panel switching
├── profile: ProfileData            // name, username, bio, avatarUrl
├── theme: ThemeConfig              // bgColor, pattern, accentColor, cardRadius
├── previewMode: 'desktop'|'mobile' // controls canvas max-width
├── isEditing: boolean              // toggle between edit and preview mode
└── layoutPreset: 'classic'|'bento' // controls profile placement
```

**Grid constants:**

- `cols={4}` — always 4 columns
- `rowHeight={80}` — each row unit = 80px
- `margin={[12, 12]}` — 12px gap between blocks
- Block sizes stored as `{w, h}` integers; `minW: 1, minH: 1` always

---

## Motion & Animation

Use Tailwind `animate-in` utilities (via `tailwindcss-animate`) for enter states:

```tsx
// Popovers sliding up
animate-in slide-in-from-bottom-2 fade-in duration-200

// Edit popovers from side
animate-in fade-in slide-in-from-right-2 duration-150
```

Framer Motion is available for more complex sequences (hero reveals, page transitions, stagger effects).

**Rules:**

- One well-orchestrated animation beats scattered micro-interactions
- Editor chrome: subtle, functional (100–200ms)
- Public profile / landing: can be expressive (staggered reveals, scroll-triggered)
- Never animate layout shifts that could disorient the user mid-edit

---

## Aesthetic Guidelines

**DO:**

- Commit to a clear tonal direction before writing any code
- Use asymmetry, generous negative space, or controlled density — not the middle ground
- Typography: pair a distinctive display font with a refined body font
- One dramatic hero element > ten scattered decorative elements
- Backgrounds with depth: gradient meshes, subtle noise, geometric patterns, layered transparencies
- Hover states that genuinely surprise or delight

**DON'T:**

- Generic purple-gradient-on-white color schemes
- Overused font stacks (Inter everywhere, Roboto, system-ui as the only choice)
- Predictable card-grid-on-white layouts with no spatial tension
- Micro-animations on every element (visual noise)
- Raw color values in component JSX (use tokens)
- Modify `app/editor/context.tsx` for purely visual changes — it owns business logic

---

## File Structure Reference (Next.js App Router)

```
app/
├── [username]/                     # SSR — public profile page
│   └── page.tsx
├── editor/                         # "use client" — drag-drop editor
│   ├── page.tsx                    # Main editor page, canvas layout switching
│   └── context.tsx                 # EditorContext (all editor state + actions)
├── analytics/                      # SSR — analytics dashboard
│   └── page.tsx
├── settings/                       # SSR — account settings
│   └── page.tsx
├── api/                            # API routes
│   ├── auth/
│   ├── blocks/
│   ├── profile/
│   └── smart-links/
└── layout.tsx

components/
├── editor/                         # Editor-specific components
│   ├── BentoGrid.tsx               # react-grid-layout canvas + block renderers
│   ├── BottomToolbar.tsx           # Floating toolbar (add/theme/preview)
│   ├── EditorSidebar.tsx           # Left sidebar (desktop, blocks/style tabs)
│   ├── Navbar.tsx                  # Top bar (brand, edit toggle, avatar menu)
│   ├── ProfileSection.tsx          # Avatar + name + bio (editable)
│   └── AvatarCropDialog.tsx        # Modal crop interface for avatar upload
└── ui/                             # shadcn/ui — do not edit directly

lib/
├── utils.ts                        # Utility functions
└── cn.ts                           # clsx + tailwind-merge helper
```

---

## Commands

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm type-check       # TypeScript type check
```

**Stack:** Next.js (latest) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · react-grid-layout · @tanstack/react-query · lucide-react · sonner · framer-motion · Unovis
