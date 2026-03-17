"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";

export function StatsMetrics() {
  const { data } = trpc.stats.useQuery();

  const total = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <NumberFlow
          value={total}
          format={{ notation: "compact" }}
          className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]"
        />
        <span className="font-mono text-xs text-[#6B7280]">codes roasted</span>
      </div>
      <span className="font-mono text-xs text-[#6B7280]">·</span>
      <div className="flex items-center gap-2">
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]"
        />
        <span className="font-mono text-xs text-[#6B7280]">avg score</span>
      </div>
    </div>
  );
}
