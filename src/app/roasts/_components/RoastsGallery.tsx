"use client";

import { useEffect, useMemo, useRef } from "react";
import { trpc } from "@/trpc/client";
import { RoastCard } from "@/components/ui/roast-card";

interface RoastListItem {
  id: string;
  code: string;
  language: string;
  score: number;
  verdict: string;
  roastQuote: string | null;
  lineCount: number;
  createdAt: string;
}

interface RoastsGalleryProps {
  initialRoasts: RoastListItem[];
  initialCursor: string | null;
}

export function RoastsGallery({ initialRoasts, initialCursor }: RoastsGalleryProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const roastsQuery = trpc.roastsList.useInfiniteQuery(
    { limit: 15 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialData: {
        pages: [{ items: initialRoasts, nextCursor: initialCursor }],
        pageParams: [undefined],
      },
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const roasts = useMemo(
    () => roastsQuery.data?.pages.flatMap((p) => p.items) ?? initialRoasts,
    [roastsQuery.data?.pages, initialRoasts]
  );

  const hasMore = roastsQuery.hasNextPage ?? false;

  useEffect(() => {
    if (!hasMore || loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          roastsQuery.fetchNextPage().finally(() => {
            loadingRef.current = false;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, roastsQuery]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {roasts.map((roast) => (
          <RoastCard key={roast.id} {...roast} />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {roastsQuery.isFetchingNextPage ? (
            <span className="font-mono text-[14px] text-[#6B7280]">Loading more...</span>
          ) : (
            <span className="font-mono text-[14px] text-[#6B7280]">Scroll for more</span>
          )}
        </div>
      )}

      {!hasMore && roasts.length > 0 && (
        <div className="py-8">
          <span className="font-mono text-[14px] text-[#6B7280]">No more roasts to show</span>
        </div>
      )}

      {roasts.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-[16px] text-[#6B7280]">No roasts yet. Be the first to submit!</p>
        </div>
      )}
    </div>
  );
}
