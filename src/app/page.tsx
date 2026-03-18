"use client";

import Link from "next/link";
import { useState } from "react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { StatsMetrics } from "@/components/ui/stats-metrics";
import { CodeEditor, MAX_CODE_LENGTH } from "@/components/code-editor";
import { ShameLeaderboard } from "@/components/ui/shame-leaderboard";
import { LeaderboardSkeleton } from "@/components/ui/leaderboard-skeleton";
import { trpc } from "@/trpc/client";

function LeaderboardFooter() {
  const { data } = trpc.homePageData.useQuery();
  const total = data?.stats.totalSubmissions ?? 0;

  return (
    <div className="flex justify-center py-4">
      <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
        showing top 3 of {total.toLocaleString()} ·{" "}
        <Link href="/leaderboard" className="hover:text-[#FAFAFA] transition-colors">
          view full leaderboard &gt;&gt;
        </Link>
      </span>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);

  const isOverLimit = code.length > MAX_CODE_LENGTH;

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      <div className="flex w-full max-w-[780px] flex-col gap-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-mono text-[36px] font-bold leading-tight">
            <span className="text-[#10B981]">$</span>{" "}
            <span className="text-[#FAFAFA]">paste your code. get roasted.</span>
          </h1>
          <p className="font-[family:var(--font-secondary)] text-sm text-[#6B7280]">
            // drop your code below and we&apos;ll rate it — brutally honest or full roast mode
          </p>
        </div>

        {/* Code Editor */}
        <CodeEditor
          placeholder="paste your code here..."
          value={code}
          onChange={setCode}
        />

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
            <span className="font-[family:var(--font-secondary)] text-xs text-[#6B7280]">
              // maximum sarcasm enabled
            </span>
          </div>
          <Button disabled={isOverLimit || !code.trim()}>roast_my_code</Button>
        </div>

        {/* Footer Stats */}
        <StatsMetrics />

        {/* Spacer */}
        <div className="h-[60px]" />

        {/* Leaderboard Preview */}
        <Suspense fallback={<LeaderboardSkeleton />}>
          <ShameLeaderboard />
          <LeaderboardFooter />
        </Suspense>

        {/* Bottom Spacer */}
        <div className="h-[60px]" />
      </div>
    </div>
  );
}
