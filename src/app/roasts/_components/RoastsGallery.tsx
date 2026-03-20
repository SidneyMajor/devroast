"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [roasts, setRoasts] = useState<RoastListItem[]>(initialRoasts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(!!initialCursor);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = trpc.roastsList.useQuery(
    { cursor: cursor ?? undefined, limit: 15 },
    { enabled: !!cursor && !loadingRef.current }
  );

  const loadMoreRoasts = useCallback(() => {
    if (loadingRef.current || !cursor) return;
    loadingRef.current = true;
  }, [cursor]);

  useEffect(() => {
    if (!loadMore.data || loadMore.isFetching) return;

    if (loadMore.data.items.length > 0) {
      setRoasts((prev) => [...prev, ...loadMore.data.items]);
      setCursor(loadMore.data.nextCursor);
      setHasMore(!!loadMore.data.nextCursor);
    } else {
      setHasMore(false);
    }
    loadingRef.current = false;
  }, [loadMore.data, loadMore.isFetching]);

  useEffect(() => {
    if (!hasMore || loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor && !loadingRef.current) {
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

      {hasMore && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {loadMore.isFetching ? (
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