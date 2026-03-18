"use client";

import Link from "next/link";
import { trpc } from "@/trpc/client";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { LeaderboardSkeleton } from "@/components/ui/leaderboard-skeleton";
import { Suspense } from "react";

interface LeaderboardItem {
  id: string;
  code: string;
  language: string;
  score: number;
  roastMode: boolean;
  lineCount?: number;
  verdict?: string;
}

function ShameLeaderboardContent() {
  const { data, isLoading } = trpc.homePageData.useQuery();

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const items = (data?.leaderboard ?? []) as LeaderboardItem[];

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-[#2A2A2A] bg-[#0A0A0A] py-8">
        <span className="font-mono text-xs text-[#6B7280]">
          // no codes roasted yet. be the first!
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[48px_70px_1fr_120px_80px] items-center gap-4 border border-[#2A2A2A] bg-[#0A0A0A] px-5 py-3 text-[11px] font-mono text-[#6B7280] uppercase tracking-wide">
        <span>rank</span>
        <span>score</span>
        <span>code</span>
        <span>language</span>
        <span>mood</span>
      </div>
      <div className="flex flex-col rounded-md border border-[#2A2A2A] border-t-0 overflow-hidden">
        {items.map((item, index) => (
          <LeaderboardRow
            key={item.id}
            rank={index + 1}
            score={item.score}
            language={item.language}
            code={item.code}
            roastMode={item.roastMode}
            lineCount={item.lineCount}
            verdict={item.verdict}
          />
        ))}
      </div>
    </>
  );
}

export function ShameLeaderboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-[#FAFAFA]">
          <span className="text-[#10B981]">//</span> shame_leaderboard
        </h2>
        <Link
          href="/leaderboard"
          className="font-mono text-xs text-[#6B7280] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] py-1.5 px-3 transition-colors"
        >
          view_all &gt;&gt;
        </Link>
      </div>

      <p className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
        // the worst code on the internet, ranked by shame
      </p>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <ShameLeaderboardContent />
      </Suspense>
    </div>
  );
}
