const SKELETON_WIDTHS = [85, 72, 90, 65, 78, 88, 70, 82] as const;

export function LeaderboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
          <div className="flex h-12 items-center justify-between border-b border-[#2A2A2A] px-5">
            <div className="flex items-center gap-4">
              <div className="h-4 w-8 animate-pulse rounded bg-[#2A2A2A]" />
              <div className="h-4 w-[60px] animate-pulse rounded bg-[#2A2A2A]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-[60px] animate-pulse rounded bg-[#2A2A2A]" />
              <div className="h-4 w-[50px] animate-pulse rounded bg-[#2A2A2A]" />
            </div>
          </div>
          <div className="flex h-[120px] bg-[#111111]">
            <div className="flex flex-col gap-1.5 border-r border-[#2A2A2A] py-3 pr-2 pl-3.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 w-4 animate-pulse rounded bg-[#2A2A2A]" />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 animate-pulse rounded bg-[#2A2A2A]" style={{ width: `${SKELETON_WIDTHS[j % SKELETON_WIDTHS.length]}%` }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
