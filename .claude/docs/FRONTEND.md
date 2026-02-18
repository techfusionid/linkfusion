# Frontend & Code Style

Code style guidelines, TypeScript rules, and frontend patterns for LinkFusion.

For component patterns and design system tokens, see [`../skills/SKILL.md`](../skills/SKILL.md).

---

## TypeScript

- Use TypeScript everywhere
- Prefer `interface` for objects, `type` for unions/aliases
- Avoid `any`; use `unknown` where type is truly unknown
- Use Zod for runtime schema validation in shared schemas

```typescript
// lib/schemas/block.ts
import { z } from "zod";

export const BlockSchema = z.object({
  id: z.string(),
  type: z.enum(["link", "text", "image", "heading"]),
  content: z.string(),
  url: z.string().url().optional(),
  bgColor: z.string().optional(),
});
export type Block = z.infer<typeof BlockSchema>;
```

---

## React Components

- Functional components only; `const Foo = () =>` style
- `"use client"` only where absolutely needed (editor, drag-drop)
- Co-locate types with components unless shared
- Keep components under 200-300 lines; extract sub-components aggressively

---

## Design System Rules

- **NEVER** hardcode colors in components — use Tailwind semantic tokens only
- All colors defined as HSL in CSS variables
- Use `bg-primary`, `text-muted-foreground`, etc. — never `bg-blue-500`
- Design tokens: `--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--card`

---

## Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BentoGrid.tsx` |
| Hooks | `use` prefix | `useEditor()` |
| API routes | resource + method | `blocks.post.ts` |
| Directories | kebab-case | `editor/` |
| Functions/vars | camelCase | `updateBlock` |
| Constants | UPPER_SNAKE_CASE | `MAX_BLOCKS` |
| Types/interfaces | PascalCase | `BlockType` |

---

## Design Patterns & UI Guidelines

For:
- Semantic design tokens
- Component patterns (FloatingToolbar, Sidebar, Block controls)
- Dynamic color logic
- Animation guidelines
- State architecture

See: **[`../skills/SKILL.md`](../skills/SKILL.md)**

---

## Frontend File Structure

```
app/
├── editor/                         # "use client" — drag-drop editor
│   ├── page.tsx                    # Main editor page
│   └── context.tsx                 # EditorContext (state + actions)
├── [username]/                     # SSR — public profile page
│   └── page.tsx
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
│   ├── BentoGrid.tsx               # react-grid-layout canvas
│   ├── BottomToolbar.tsx           # Floating toolbar
│   ├── EditorSidebar.tsx           # Left sidebar
│   ├── Navbar.tsx                  # Top bar
│   ├── ProfileSection.tsx          # Avatar + name + bio
│   └── AvatarCropDialog.tsx        # Avatar upload modal
└── ui/                             # shadcn/ui — do not edit directly

lib/
├── utils.ts                        # Utility functions
└── cn.ts                           # clsx + tailwind-merge helper
```

---

## Stack

Next.js (latest) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · react-grid-layout · @tanstack/react-query · lucide-react · sonner · framer-motion · Unovis
