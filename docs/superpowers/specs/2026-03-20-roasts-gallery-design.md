# Roasts Gallery Design

## Overview
Create a public gallery page displaying all roasts in a card layout with infinite scroll pagination.

## URL
- `/roasts` - Gallery page (Server Component)
- `/roast/[id]` - Existing roast result page (singular)

## Components

### Reusable UI Components
- `ScoreRing` - Score visualization with gradient arc
- `Button` - CTA "View roast"
- `CodeBlock` - Code preview with syntax highlighting
- `CardRoot`, `CardBadge` - Card structure

### New Components to Create
- `RoastCard` - Card matching Pencil design
- `RoastsGallery` - Client component with infinite scroll

## Card Design (per Pencil)

**Structure:**
```
┌─────────────────────────────────────────┐
│  ┌─────┐                                │
│  │Score│  Title              "2h ago"  │
│  │Ring │                                │
│  └─────┘                                │
│                                         │
│  ● needs_serious_help                   │
│                                         │
│  "roast quote..."                       │
│                                         │
│  [javascript] [7 lines] [crítico]      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ code preview (3-5 lines)        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [View roast]                           │
│                                         │
│  lang: javascript · 7 lines · Mar 2026  │
└─────────────────────────────────────────┘
```

**Details:**
- Score ring: 180px with gradient arc (reuse existing ScoreRing component)
- Verdict: Display verdict string as badge with color mapping:
  - `needs_serious_help` → red (#EF4444)
  - `rough_around_edges` → amber (#F59E0B)
  - `decent_code` / `solid_work` / `exceptional` → green (#10B981)
- Code preview: max 5 lines with syntax highlighting
- CTA button: "View roast" → use Next.js `<Link>` component with Button styling

## Data Flow

1. **Server Page** (`src/app/roasts/page.tsx`):
   - Fetches initial 15 roasts via tRPC
   - Passes data to client component

2. **Client Component** (`src/app/roasts/_components/RoastsGallery.tsx`):
   - Displays initial roasts
   - Loads more when scrolling to bottom
   - Uses Intersection Observer for scroll detection

3. **tRPC Procedure** (`src/trpc/routers/_app.ts`):
   - `roastsList` - cursor-based pagination
   - Returns: id, code, language, score, verdict, roastQuote, lineCount, createdAt

## Query Design

```typescript
// Cursor-based pagination (more performant for large datasets)
roastsList: baseProcedure
  .input(z.object({
    cursor: z.string().optional(), // roast id to start after
    limit: z.number().min(1).max(50).default(15),
  }))
  .query(async ({ input }) => {
    // fetch roasts ordered by createdAt DESC
  })
```

## Ordering
- Most recent first (`ORDER BY createdAt DESC`)

## Loading State
- Use Suspense with skeleton component for initial load
- Show "Loading more..." indicator for pagination

### Null Handling
- `roastQuote` (optional): Show "No roast quote available" placeholder if null
- Use `|| "No roast quote available"` fallback

## Implementation Steps

1. Add `roastsList` tRPC procedure with cursor pagination
2. Create `getRoastsPaginated` query function in `src/db/queries.ts`
3. Create `RoastCard` component:
   - Use ScoreRing for score display
   - Use CardRoot/CardBadge for structure
   - Use CodeBlock for code preview (max 5 lines, no header)
   - Use Next.js `<Link>` with Button styling for CTA
4. Create `RoastsGallery` client component with infinite scroll
5. Create `src/app/roasts/page.tsx` (Server Component)
6. Add navigation link to navbar

## Acceptance Criteria
- [ ] Page loads at `/roasts` with 15 roasts initially
- [ ] Cards display: score, title, verdict, quote, tags, code preview
- [ ] Clicking "View roast" navigates to `/roast/[id]`
- [ ] Scrolling to bottom loads 15 more roasts
- [ ] Loading states shown during data fetch
- [ ] Ordered by most recent first