# Roasts Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a public gallery page at `/roasts` that displays roasts in a card layout with infinite scroll pagination (15 cards at a time).

**Architecture:** Server Component page fetches initial data via tRPC, client component handles infinite scroll with Intersection Observer. Cursor-based pagination for optimal performance with large datasets.

**Tech Stack:** Next.js 16 (App Router), tRPC, Drizzle ORM, PostgreSQL

---

## Files Structure

| File | Responsibility |
|------|----------------|
| `src/db/queries.ts` | Add `getRoastsPaginated` query function with cursor pagination |
| `src/trpc/routers/_app.ts` | Add `roastsList` tRPC procedure |
| `src/components/ui/roast-card.tsx` | New card component (reuses ScoreRing, CodeBlock, CardRoot) |
| `src/app/roasts/_components/RoastsGallery.tsx` | Client component with infinite scroll |
| `src/app/roasts/page.tsx` | Server Component page for `/roasts` |
| `src/components/navbar.tsx` | Add "roasts" navigation link |

---

## Implementation Tasks

### Task 1: Add Database Query Function

**File:** `src/db/queries.ts`

- [ ] **Step 1: Add types and function**

```typescript
export interface RoastListItem {
  id: string;
  code: string;
  language: string;
  score: number;
  verdict: string;
  roastQuote: string | null;
  lineCount: number;
  createdAt: Date;
}

export interface RoastsPaginatedResult {
  items: RoastListItem[];
  nextCursor: string | null;
}

export async function getRoastsPaginated(cursor: string | null, limit: number): Promise<RoastsPaginatedResult> {
  const cursorCondition = cursor 
    ? sql`${roasts.createdAt} < (SELECT createdAt FROM ${roasts} WHERE id = ${cursor})` 
    : undefined;

  const items = await db
    .select({
      id: roasts.id,
      code: roasts.code,
      language: roasts.language,
      score: roasts.score,
      verdict: roasts.verdict,
      roastQuote: roasts.roastQuote,
      lineCount: roasts.lineCount,
      createdAt: roasts.createdAt,
    })
    .from(roasts)
    .where(cursorCondition ? sql`${cursorCondition}` : undefined)
    .orderBy(desc(roasts.createdAt))
    .limit(limit + 1);

  const hasMore = items.length > limit;
  const resultItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? resultItems[resultItems.length - 1]?.id ?? null : null;

  return {
    items: resultItems.map((r) => ({
      id: r.id,
      code: r.code,
      language: r.language,
      score: Number(r.score),
      verdict: r.verdict,
      roastQuote: r.roastQuote,
      lineCount: r.lineCount,
      createdAt: r.createdAt,
    })),
    nextCursor,
  };
}
```

### Task 2: Add tRPC Procedure

**File:** `src/trpc/routers/_app.ts`

- [ ] **Step 1: Add import and procedure**

```typescript
import { z } from "zod";
import { getRoastsPaginated } from "@/db/queries";

// Add to appRouter:
roastsList: baseProcedure
  .input(z.object({
    cursor: z.string().optional(),
    limit: z.number().min(1).max(50).default(15),
  }))
  .query(async ({ input }) => {
    const result = await getRoastsPaginated(input.cursor ?? null, input.limit);
    return {
      items: result.items.map((r) => ({
        id: r.id,
        code: r.code,
        language: r.language,
        score: r.score,
        verdict: r.verdict,
        roastQuote: r.roastQuote,
        lineCount: r.lineCount,
        createdAt: r.createdAt.toISOString(),
      })),
      nextCursor: result.nextCursor,
    };
  }),
```

### Task 3: Create RoastCard Component

**File:** `src/components/ui/roast-card.tsx`

- [ ] **Step 1: Create component using existing UI**

```typescript
"use client";

import Link from "next/link";
import { ScoreRing } from "@/components/ui/score-ring";
import { CardRoot } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { twMerge } from "tailwind-merge";

// Interface and helper functions...

export function RoastCard({ id, code, language, score, verdict, roastQuote, lineCount, createdAt }: RoastCardProps) {
  const verdictColors = getVerdictColor(verdict);
  const codePreview = getCodePreview(code, 5);

  return (
    <CardRoot className="w-full max-w-[520px] gap-4 p-5">
      {/* Score ring */}
      <div className="flex items-start gap-4">
        <ScoreRing score={score} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-[family:var(--font-secondary)] text-[22px] font-bold text-[#FAFAFA]">
              Roast #{id.slice(0, 8)}
            </span>
            <span className="font-mono text-[13px] font-medium text-[#6B7280]">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Verdict badge */}
      <div className="flex items-center gap-2">
        <span className={twMerge("size-3 rounded-full", verdictColors.bg)} />
        <span className={twMerge("font-mono text-[16px] font-medium", verdictColors.text)}>
          {verdict.replace(/_/g, " ")}
        </span>
      </div>

      {/* Quote */}
      <p className="font-[family:var(--font-secondary)] text-[16px] leading-relaxed text-[#FAFAFA]">
        {roastQuote || "No roast quote available"}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 font-mono text-[13px] text-[#6B7280]">
          {language}
        </span>
        <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 font-mono text-[13px] text-[#6B7280]">
          {lineCount} lines
        </span>
      </div>

      {/* Code preview */}
      <CodeBlock code={codePreview} language={language} maxHeight="120px" />

      {/* CTA */}
      <Link href={`/roast/${id}`} className="...">
        View roast
      </Link>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-[#6B7280]">
          lang: {language} · {lineCount} lines · {date}
        </span>
      </div>
    </CardRoot>
  );
}
```

### Task 4: Create RoastsGallery Client Component

**File:** `src/app/roasts/_components/RoastsGallery.tsx`

- [ ] **Step 1: Implement infinite scroll with Intersection Observer**

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/trpc/client";
import { RoastCard } from "@/components/ui/roast-card";

export function RoastsGallery({ initialRoasts, initialCursor }: RoastsGalleryProps) {
  const [roasts, setRoasts] = useState(initialRoasts);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(!!initialCursor);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = trpc.roastsList.useQuery(
    { cursor: cursor ?? undefined, limit: 15 },
    { enabled: !!cursor }
  );

  useEffect(() => {
    if (!loadMore.data || loadMore.isFetching) return;

    if (loadMore.data.items.length > 0) {
      setRoasts((prev) => [...prev, ...loadMore.data.items]);
      setCursor(loadMore.data.nextCursor);
      setHasMore(!!loadMore.data.nextCursor);
    } else {
      setHasMore(false);
    }
  }, [loadMore.data, loadMore.isFetching]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor) {
          loadMore.refetch();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, cursor, loadMore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {roasts.map((roast) => (
          <RoastCard key={roast.id} {...roast} />
        ))}
      </div>
      {hasMore && <div ref={loadMoreRef}>Loading more...</div>}
    </div>
  );
}
```

### Task 5: Create Server Page

**File:** `src/app/roasts/page.tsx`

- [ ] **Step 1: Create page**

```typescript
import { getServerClient } from "@/trpc/server";
import { RoastsGallery } from "./_components/RoastsGallery";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function RoastsPage() {
  const caller = await getServerClient();
  const initialData = await caller.roastsList({ limit: 15 });

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col gap-10 px-4 py-10 md:px-8 lg:px-16">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[32px] font-bold text-[#10B981]">›</span>
          <h1 className="font-mono text-[28px] font-bold text-[#FAFAFA]">roasts</h1>
        </div>
        <p className="font-mono text-[14px] text-[#6B7280]">// all the code that got roasted</p>
      </div>

      <RoastsGallery
        initialRoasts={initialData.items}
        initialCursor={initialData.nextCursor}
      />
    </div>
  );
}
```

### Task 6: Add Navigation Link

**File:** `src/components/navbar.tsx`

- [ ] **Step 1: Add roasts link**

```typescript
<Link href="/roasts" className="font-mono text-[13px] text-[#6B7280] hover:text-[#FAFAFA] transition-colors">
  roasts
</Link>
```

---

## Acceptance Criteria

- [ ] Page loads at `/roasts` with 15 roasts initially
- [ ] Cards display: score, title, verdict, quote, tags, code preview
- [ ] Clicking "View roast" navigates to `/roast/[id]`
- [ ] Scrolling to bottom loads 15 more roasts
- [ ] Loading states shown during data fetch
- [ ] Ordered by most recent first
- [ ] Navigation link present in navbar

---

## Verification Commands

```bash
npm run check    # Lint and format
npm run build    # Production build
```

**Expected:** All checks pass, build succeeds with `/roasts` route listed.