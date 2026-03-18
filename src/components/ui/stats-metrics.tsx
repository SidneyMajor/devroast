"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function StatsMetrics() {
  const { data } = trpc.stats.useQuery();

  const isLoading = !data;
  const total = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-10 animate-pulse rounded bg-[#2A2A2A]" />
          <span className="font-mono text-xs text-[#6B7280]">codes roasted</span>
        </div>
        <span className="font-mono text-xs text-[#6B7280]">·</span>
        <div className="flex items-center gap-2 font-mono text-xs text-[#6B7280]">
          <span>avg score:</span>
          <span className="h-3 w-8 animate-pulse rounded bg-[#2A2A2A]" />
          <span>/10</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <NumberFlow
          value={total}
          format={{ notation: "compact" }}
          className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]"
          suppressHydrationWarning
        />
        <span className="font-mono text-xs text-[#6B7280]">codes roasted</span>
      </div>
      <span className="font-mono text-xs text-[#6B7280]">·</span>
      <div className="flex items-center gap-2 font-mono text-xs text-[#6B7280]">
        <span>avg score:</span>
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]"
          suppressHydrationWarning
        />
        <span>/10</span>
      </div>
    </div>
  );
}
