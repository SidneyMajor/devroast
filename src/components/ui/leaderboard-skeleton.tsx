const SKELETON_WIDTHS = [85, 72, 90, 65, 78, 88, 70, 82] as const;

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="flex items-center gap-4 border-b border-[#2A2A2A] bg-[#0A0A0A] px-5 py-4 last:border-b-0">
            <div className="h-4 w-8 animate-pulse rounded bg-[#2A2A2A]" />
            <div className="h-4 w-[60px] animate-pulse rounded bg-[#2A2A2A]" />
            <div className="h-4 flex-1 animate-pulse rounded bg-[#2A2A2A]" />
            <div className="h-4 w-12 animate-pulse rounded bg-[#2A2A2A]" />
            <div className="h-4 w-4 animate-pulse rounded bg-[#2A2A2A]" />
          </div>
          <div className="flex h-[200px] border-t border-[#2A2A2A]">
            <div className="flex flex-col gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0D] py-3 pr-2 pl-3">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-4 w-4 animate-pulse rounded bg-[#2A2A2A]" />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 animate-pulse rounded bg-[#2A2A2A]" style={{ width: `${SKELETON_WIDTHS[j % SKELETON_WIDTHS.length]}%` }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
